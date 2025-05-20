import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Utilidad para calcular la próxima fecha según día y hora
function getProximaFecha(diaSemana: number, hora: string): Date {
	const [horaStr, minutoStr] = hora.split(":");
	const ahora = new Date();
	const fecha = new Date(ahora);
	const diaActual = ahora.getDay();

	let diasParaSumar = diaSemana - diaActual;
	if (diasParaSumar < 0) diasParaSumar += 7;

	fecha.setDate(ahora.getDate() + diasParaSumar);
	fecha.setHours(Number(horaStr), Number(minutoStr), 0, 0);

	return fecha;
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	const { disponibilidadId } = await req.json();

	if (!session || session.user.role !== "PACIENTE") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

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

	const fechaCita = getProximaFecha(
		disponibilidad.diaSemana,
		disponibilidad.horaInicio
	);

	const cita = await prisma.cita.create({
		data: {
			paciente: { connect: { email: session.user.email! } },
			psicologo: { connect: { id: disponibilidad.psicologo.id } },
			fechaHora: fechaCita,
		},
	});

	return NextResponse.json(cita);
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "PACIENTE") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const citas = await prisma.cita.findMany({
		where: {
			paciente: { email: session.user.email! },
		},
		include: {
			psicologo: {
				select: { name: true },
			},
		},
		orderBy: {
			fechaHora: "asc",
		},
	});

	return NextResponse.json(citas);
}

export async function DELETE(req: NextRequest) {
	const session = await getServerSession(authOptions);
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	if (!session || session.user.role !== "PACIENTE") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	await prisma.cita.delete({
		where: { id: id || undefined },
	});

	return NextResponse.json({ success: true });
}
