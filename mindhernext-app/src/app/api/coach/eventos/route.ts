// src/app/api/coach/eventos/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
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
