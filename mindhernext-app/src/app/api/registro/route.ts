import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { name, email, password, role } = await req.json();

	// ✅ Validación básica
	if (!email || !password || password.length < 6) {
		return new Response("Email o contraseña inválida", { status: 400 });
	}

	// ✅ Verificar que no exista el email
	const existe = await prisma.user.findUnique({ where: { email } });
	if (existe) {
		return new Response("Ya existe un usuario con ese email", { status: 409 });
	}

	const hashedPassword = await hash(password, 10);

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
			role: role || "PACIENTE", // 👈 por defecto
		},
	});
	console.log("✅ Usuario creado:", user);
	return new Response(JSON.stringify({ success: true }), { status: 201 });
}
