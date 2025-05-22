// src/app/api/admin/usuarios/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "ADMIN") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			createdAt: true,
		},
	});

	return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "ADMIN") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const { name, email, password, role } = await req.json();

	if (!name || !email || !password || !role) {
		return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
	}

	// Verifica si ya existe el email
	const existe = await prisma.user.findUnique({ where: { email } });
	if (existe) {
		return NextResponse.json(
			{ error: "Ya existe un usuario con ese email" },
			{ status: 400 }
		);
	}

	const hashedPassword = await hash(password, 10);

	const nuevo = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
			role,
		},
	});

	return NextResponse.json(nuevo);
}
