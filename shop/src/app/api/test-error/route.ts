import { NextResponse } from "next/server";

/**
 * GET /api/test-error
 * Endpoint dùng để test CloudWatch log monitoring.
 * Mỗi lần gọi sẽ:
 *  1. Log ra console.error (→ PM2 stderr → pm2-error stream trên CloudWatch)
 *  2. Throw unhandled exception giả lập
 *  3. Trả về HTTP 500
 *
 * ⚠️  XÓA ENDPOINT NÀY SAU KHI TEST XONG
 */
export async function GET() {
    const timestamp = new Date().toISOString();

    // Log ERROR ra stderr (PM2 capture và ship lên CloudWatch pm2-error stream)
    console.error(`[${timestamp}] ERROR: Test error triggered via /api/test-error`);
    console.error(`[${timestamp}] ERROR: Simulated database connection failure`);
    console.error(`[${timestamp}] FATAL: Unhandled exception in request handler`);

    // Trả về HTTP 500 → Nginx access log ghi lại status 500
    // → CloudWatch metric filter Http5xxCount tăng lên
    return NextResponse.json(
        {
            status: "error",
            message: "Test error generated. Check CloudWatch Log Group: /so-contest/ec2",
            streams: {
                "pm2-error": "ERROR lines logged to stderr",
                "nginx-access": "HTTP 500 logged to nginx access log",
            },
            timestamp,
        },
        { status: 500 }
    );
}
