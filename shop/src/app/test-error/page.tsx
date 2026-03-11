"use client";

import { useState } from "react";

/**
 * /test-error — Trang test CloudWatch monitoring
 * Gọi /api/test-error liên tục để sinh log lỗi vào PM2 stderr và Nginx 500
 * ⚠️  XÓA TRANG NÀY SAU KHI TEST XONG
 */
export default function TestErrorPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [count, setCount] = useState(0);

    const fireOnce = async () => {
        const res = await fetch("/api/test-error");
        const data = await res.json();
        const line = `[${data.timestamp}] HTTP ${res.status} — ${data.message}`;
        setLogs((prev) => [line, ...prev].slice(0, 50));
        setCount((c) => c + 1);
    };

    const startLoop = () => {
        setRunning(true);
        const id = setInterval(async () => {
            await fireOnce();
        }, 1000); // mỗi giây 1 lần
        // Tự dừng sau 30 giây
        setTimeout(() => {
            clearInterval(id);
            setRunning(false);
        }, 30000);
    };

    return (
        <div style={{ fontFamily: "monospace", padding: "2rem", background: "#111", color: "#0f0", minHeight: "100vh" }}>
            <h1 style={{ color: "#f00" }}>⚠️ CloudWatch Error Test Page</h1>
            <p style={{ color: "#aaa" }}>
                Trang này gọi <code>/api/test-error</code> để sinh log lỗi vào PM2 stderr và HTTP 500.
                Kiểm tra CloudWatch Log Group <strong>/so-contest/ec2</strong> sau khi chạy.
            </p>

            <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
                <button
                    onClick={fireOnce}
                    style={{ padding: "0.5rem 1.5rem", background: "#c00", color: "#fff", border: "none", cursor: "pointer", borderRadius: 4 }}
                >
                    🔥 Fire Once
                </button>

                <button
                    onClick={startLoop}
                    disabled={running}
                    style={{ padding: "0.5rem 1.5rem", background: running ? "#555" : "#a00", color: "#fff", border: "none", cursor: running ? "not-allowed" : "pointer", borderRadius: 4 }}
                >
                    {running ? "⏳ Running 30s loop..." : "🚀 Start 30s Loop (1 req/sec)"}
                </button>
            </div>

            <p style={{ color: "#ff0" }}>Total fired: <strong>{count}</strong></p>

            <div style={{
                background: "#000", padding: "1rem", height: "400px",
                overflowY: "auto", border: "1px solid #333", borderRadius: 4
            }}>
                {logs.length === 0
                    ? <span style={{ color: "#555" }}>Chưa có log...</span>
                    : logs.map((l, i) => <div key={i} style={{ color: "#f66", fontSize: 13 }}>{l}</div>)
                }
            </div>

            <p style={{ color: "#555", marginTop: "1rem", fontSize: 12 }}>
                ⚠️ Xóa file <code>shop/src/app/test-error/</code> và <code>shop/src/app/api/test-error/</code> sau khi test xong.
            </p>
        </div>
    );
}
