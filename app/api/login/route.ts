import { NextResponse } from "next/server";

const sessionCookieName = "smukavchuk_admin_session";

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function isAdminRequest(request: Request) {
  const sessionSecret = getSessionSecret();
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookieName}=`));

  return Boolean(
    sessionSecret && cookie?.split("=")[1] === encodeURIComponent(sessionSecret),
  );
}

export async function GET(request: Request) {
  return NextResponse.json({ authenticated: isAdminRequest(request) });
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const sessionSecret = getSessionSecret();

      if (!sessionSecret) {
        return NextResponse.json(
          { error: "Admin session is not configured" },
          { status: 500 },
        );
      }

      const response = NextResponse.json({ authenticated: true });

      response.cookies.set(sessionCookieName, sessionSecret, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });

  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
