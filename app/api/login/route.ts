const DEMO_USERS = [
  {
    email: "admin@carbon.cloud",
    password: "carbon2024",
    name: "Ada Lovelace",
    role: "Administrator",
    initials: "AL",
  },
  {
    email: "demo@carbon.cloud",
    password: "demo1234",
    name: "Demo User",
    role: "Member",
    initials: "DU",
  },
];

const FAILURE_DELAY_MS = 600;

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return Response.json(
      { success: false, error: "Email and password are required." },
      { status: 400 }
    );
  }

  const match = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email && u.password === password
  );

  await new Promise((r) => setTimeout(r, FAILURE_DELAY_MS));

  if (!match) {
    return Response.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  }

  return Response.json({
    success: true,
    user: {
      email: match.email,
      name: match.name,
      role: match.role,
      initials: match.initials,
    },
    token: `demo.${match.email}.${Date.now()}`,
    issuedAt: new Date().toISOString(),
  });
}

export async function GET() {
  return Response.json(
    {
      endpoint: "/api/login",
      method: "POST",
      demoCredentials: DEMO_USERS.map(({ email, password, name, role }) => ({
        email,
        password,
        name,
        role,
      })),
    },
    { status: 200 }
  );
}
