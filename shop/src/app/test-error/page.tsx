"use client";

import { useState } from "react";

const BURST_SIZE = 30; // số request bắn song song mỗi giây

export default function TestErrorPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [count, setCount] = useState(0);

    const fireBurst = async () => {
        // Bắn BURST_SIZE request song song cùng lúc
        const results = await Promise.allSettled(
            Array.from({ length: BURST_SIZE }, () => fetch("/api/test-error"))
        );
        const timestamp = new Date().toISOString();
        const ok = results.filter((r) => r.status === "fulfilled").length;
        const line = `[${timestamp}] Burst: ${ok}/${BURST_SIZE} fired (HTTP 500 each)`;
        setLogs((prev) => [line, ...prev].slice(0, 100));
        setCount((c) => c + ok);
    };

    const startLoop = () => {
        setRunning(true);
        // Bắn burst ngay lập tức, sau đó lặp mỗi 1000ms
        fireBurst();
        const id = setInterval(fireBurst, 1000);
        setTimeout(() => {
            clearInterval(id);
            setRunning(false);
        }, 10000); // 10 giây × 30 req = 300 requests
    };

    return (
        <div style={{ fontFamily: "monospace", padding: "2rem", background: "#111", color: "#0f0", minHeight: "100vh" }}>
            <h1 style={{ color: "#f00" }}>⚠️ CloudWatch Error Test Page</h1>
            <p style={{ color: "#aaa" }}>
                Mỗi lần bắn: <strong style={{ color: "#ff0" }}>{BURST_SIZE} requests song song</strong> — mỗi request sinh 3 dòng ERROR vào pm2-error và 1 HTTP 500 vào nginx-access.
            </p>

            <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
                <button
                    onClick={fireBurst}
                    style={{ padding: "0.5rem 1.5rem", background: "#c00", color: "#fff", border: "none", cursor: "pointer", borderRadius: 4 }}
                >
                    🔥 Burst x{BURST_SIZE} Once
                </button>

                <button
                    onClick={startLoop}
                    disabled={running}
                    style={{ padding: "0.5rem 1.5rem", background: running ? "#555" : "#a00", color: "#fff", border: "none", cursor: running ? "not-allowed" : "pointer", borderRadius: 4 }}
                >
                    {running ? `⏳ Bursting... (${BURST_SIZE}/s × 10s)` : `🚀 Start 10s Loop (${BURST_SIZE} req/sec)`}
                </button>
            </div>

            <p style={{ color: "#ff0" }}>Total fired: <strong>{count}</strong></p>

            <div style={{
                background: "#000", padding: "1rem", height: "400px",
                overflowY: "auto", border: "1px solid #333", borderRadius: 4
            }}>
                {logs.length === 0
                    ? <span style={{ color: "#555" }}>Chưa có burst...</span>
                    : logs.map((l, i) => <div key={i} style={{ color: "#f66", fontSize: 13 }}>{l}</div>)
                }
            </div>

            <p style={{ color: "#555", marginTop: "1rem", fontSize: 12 }}>
                ⚠️ Xóa <code>shop/src/app/test-error/</code> và <code>shop/src/app/api/test-error/</code> sau khi test xong.
            </p>
        </div>
    );
}
