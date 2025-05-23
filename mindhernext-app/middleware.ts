import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const dashboardRootByRole = {
	ADMIN: "/dashboard/admin",
	PSICOLOGO: "/dashboard/psicologo",
	PACIENTE: "/dashboard/paciente",
	COACH: "/dashboard/coach",
} as const;

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const url = req.nextUrl.pathname;

	const publicPaths = ["/", "/login", "/registro"];
	if (publicPaths.includes(url)) return NextResponse.next();

	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	const role = token.role as keyof typeof dashboardRootByRole;

	// Redirigir si el usuario intenta ir al dashboard de otro rol
	if (
		url.startsWith("/dashboard") &&
		dashboardRootByRole[role] && // 👈 Validación
		!url.startsWith(dashboardRootByRole[role])
	) {
		return NextResponse.redirect(new URL(dashboardRootByRole[role], req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
