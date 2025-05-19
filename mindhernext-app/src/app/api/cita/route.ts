// src/app/api/cita/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	const { disponibilidadId } = await req.json();

	if (!session || session.user.role !== "PACIENTE") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	// 1. Buscar la disponibilidad para extraer el psicólogo asociado
	const disponibilidad = await prisma.disponibilidad.findUnique({
		where: { id: disponibilidadId },
		include: { psicologo: true },
	});

	if (!disponibilidad) {
		return NextResponse.json(
			{ error: "Disponibilidad no encontrada" },
			{ status: 404 }
		);
	}

	// 2. Crear la cita con el ID del paciente y del psicólogo
	const cita = await prisma.cita.create({
		data: {
			paciente: { connect: { email: session.user.email! } },
			psicologo: { connect: { id: disponibilidad.psicologo.id } },
			fechaHora: new Date(), // ⚠️ o puedes derivarlo de disponibilidad si tienes lógica temporal
		},
	});

	return NextResponse.json(cita);
}
