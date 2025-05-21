// src/app/api/admin/usuarios/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "ADMIN") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	const [total, pacientes, psicologos, coaches, admins] = await Promise.all([
		prisma.user.count(),
		prisma.user.count({ where: { role: "PACIENTE" } }),
		prisma.user.count({ where: { role: "PSICOLOGO" } }),
		prisma.user.count({ where: { role: "COACH" } }),
		prisma.user.count({ where: { role: "ADMIN" } }),
	]);

	return NextResponse.json({
		total,
		pacientes,
		psicologos,
		coaches,
		admins,
	});
}
