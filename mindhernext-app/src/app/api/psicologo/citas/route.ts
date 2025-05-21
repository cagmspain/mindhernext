import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener citas del psicólogo
export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "PSICOLOGO") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const citas = await prisma.cita.findMany({
		where: {
			psicologo: {
				email: session.user.email!,
			},
		},
		include: {
			paciente: {
				select: { name: true },
			},
		},
		orderBy: {
			fechaHora: "asc",
		},
	});

	return NextResponse.json(citas);
}

// Actualizar el estado de una cita
export async function POST(req: Request) {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "PSICOLOGO") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const { citaId, nuevoEstado } = await req.json();

	const estadosPermitidos = [
		"PENDIENTE",
		"CONFIRMADA",
		"CANCELADA",
		"COMPLETADA",
	];

	if (!estadosPermitidos.includes(nuevoEstado)) {
		return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
	}

	const citaActualizada = await prisma.cita.update({
		where: { id: citaId },
		data: {
			estado: nuevoEstado,
		},
	});

	return NextResponse.json(citaActualizada);
}
