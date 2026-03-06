
export async function GET() {
  // Nginx routes /api/* to the backend. This is just a local route example.
  return Response.json({ status: "web-ok" });
}
