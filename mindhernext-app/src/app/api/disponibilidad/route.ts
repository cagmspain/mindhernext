import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // ajusta si tu archivo está en otra ruta
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session || session.user.role !== "PSICOLOGO") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const disponibilidad = await prisma.disponibilidad.findMany({
		where: {
			psicologo: {
				email: session.user.email!,
			},
		},
		orderBy: {
			diaSemana: "asc",
		},
	});

	return NextResponse.json(disponibilidad);
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session || session.user.role !== "PSICOLOGO") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const body = await req.json();
	const { diaSemana, horaInicio, horaFin } = body;

	const user = await prisma.user.findUnique({
		where: { email: session.user.email! },
	});

	if (!user) {
		return NextResponse.json(
			{ error: "Usuario no encontrado" },
			{ status: 404 }
		);
	}

	const creada = await prisma.disponibilidad.create({
		data: {
			diaSemana,
			horaInicio,
			horaFin,
			psicologoId: user.id,
		},
	});

	return NextResponse.json(creada);
}

export async function DELETE(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session || session.user.role !== "PSICOLOGO") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const id = req.nextUrl.searchParams.get("id");

	if (!id) {
		return NextResponse.json({ error: "ID requerido" }, { status: 400 });
	}

	await prisma.disponibilidad.delete({
		where: { id },
	});

	return NextResponse.json({ success: true });
}
