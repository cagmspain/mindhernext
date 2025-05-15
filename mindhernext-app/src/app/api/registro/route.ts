import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	try {
		const { name, email, password } = await req.json();

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: "El usuario ya existe" },
				{ status: 400 }
			);
		}

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password,
				role: "PACIENTE",
			},
		});

		return NextResponse.json(user, { status: 201 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error al registrar usuario" },
			{ status: 500 }
		);
	}
}
