import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	const url = req.nextUrl.pathname;

	// 🔓 Permitir acceso público sin sesión (ej: home, login, registro)
	const publicPaths = ["/", "/login", "/registro"];
	if (publicPaths.includes(url)) return NextResponse.next();

	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// 🔐 Reglas por ruta y rol
	if (url.startsWith("/dashboard/admin") && token.role !== "ADMIN") {
		return NextResponse.redirect(new URL("/dashboard/paciente", req.url));
	}

	if (url.startsWith("/dashboard/psicologo") && token.role !== "PSICOLOGO") {
		return NextResponse.redirect(new URL("/dashboard/paciente", req.url));
	}

	if (url.startsWith("/dashboard/paciente") && token.role !== "PACIENTE") {
		return NextResponse.redirect(new URL("/dashboard/psicologo", req.url));
	}

	return NextResponse.next();
}
