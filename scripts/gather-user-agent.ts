const port = 8080;

const handler = (request: Request): Response => {
  console.log(request.headers);
  const body = `Your user-agent is:\n\n${
    request.headers.get("user-agent") ?? "Unknown"
  }\nAccept header:\n\n${request.headers.get("accept") ?? "Unknown"}`;

  return new Response(body, { status: 200 });
};

console.log(`HTTP server running. Access it at: http://localhost:8080/`);
Deno.serve({ port }, handler);
