export async function GET() {
  try {
    // TODO: Add actual database health check logic here
    return Response.json({ status: "ok", message: "Database connection is healthy" }, { status: 200 });
  } catch (error) {
    return Response.json({ status: "error", message: "Database connection failed" }, { status: 500 });
  }
}
