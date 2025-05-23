// src/app/api/coach/eventos/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "COACH") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const eventos = await prisma.evento.findMany({
		where: {
			creadoPor: {
				email: session.user.email!,
			},
		},
		orderBy: {
			fechaHora: "asc",
		},
	});

	return NextResponse.json(eventos);
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "COACH") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const { titulo, descripcion, fechaHora } = await req.json();

	if (!titulo || !fechaHora) {
		return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
	}

	const evento = await prisma.evento.create({
		data: {
			titulo,
			descripcion,
			fechaHora: new Date(fechaHora),
			creadoPor: {
				connect: { email: session.user.email! },
			},
		},
	});

	return NextResponse.json(evento);
}

export async function DELETE(req: NextRequest) {
	const session = await getServerSession(authOptions);
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	if (!session || session.user.role !== "COACH") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	if (!id) {
		return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
	}

	await prisma.evento.delete({
		where: { id },
	});

	return NextResponse.json({ success: true });
}
