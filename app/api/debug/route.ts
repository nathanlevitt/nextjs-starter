import { cookies } from "next/headers";

export async function GET(request: Request) {
  const headers = Object.fromEntries(request.headers);
  const cookieStore = (await cookies()).getAll();

  const response = {
    url: request.url,
    method: request.method,
    headers,
    cookies: cookieStore,
  };

  return Response.json(response);
}
