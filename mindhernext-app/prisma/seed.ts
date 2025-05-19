import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	const emails = [
		"admin@mindher.com",
		"psico@mindher.com",
		"paciente@mindher.com",
	];

	// 🔄 Eliminar usuarios previos con esos correos (para pruebas limpias)
	await prisma.user.deleteMany({
		where: {
			email: { in: emails },
		},
	});

	const password = await hash("123456", 10); // contraseña común

	await prisma.user.createMany({
		data: [
			{
				name: "Administrador",
				email: "admin@mindher.com",
				password,
				role: "ADMIN",
			},
			{
				name: "Psicóloga Ana",
				email: "psico@mindher.com",
				password,
				role: "PSICOLOGO",
			},
			{
				name: "Carlos Paciente",
				email: "paciente@mindher.com",
				password,
				role: "PACIENTE",
			},
		],
	});

	console.log("✅ Usuarios de prueba creados con éxito");
}

main()
	.catch((e) => {
		console.error("❌ Error al ejecutar seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
