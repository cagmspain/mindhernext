// src/app/api/disponibilidad/todas/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
	const disponibilidades = await prisma.disponibilidad.findMany({
		include: {
			psicologo: {
				select: { name: true },
			},
		},
	});

	return NextResponse.json(disponibilidades);
}
