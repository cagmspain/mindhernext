import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "ADMIN") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const { titulo, descripcion, fechaHora } = await req.json();

	if (!titulo || !fechaHora) {
		return NextResponse.json(
			{ error: "Faltan campos requeridos" },
			{ status: 400 }
		);
	}

	const nuevoEvento = await prisma.evento.create({
		data: {
			titulo,
			descripcion,
			fechaHora: new Date(fechaHora),
			creadoPor: {
				connect: {
					email: session.user.email!,
				},
			},
		},
	});

	return NextResponse.json(nuevoEvento);
}
