"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		const res = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (res?.error) {
			setError("Credenciales incorrectas");
			return;
		}

		// Obtener la sesión para leer el rol
		const sessionRes = await fetch("/api/auth/session");
		const session = await sessionRes.json();
		console.log("ROL INICIADO:", session.user?.role);
		const role = session.user?.role;

		switch (role) {
			case "ADMIN":
				router.push("/dashboard/admin");
				break;
			case "PSICOLOGO":
				router.push("/dashboard/psicologo");
				break;
			case "COACH":
				router.push("/dashboard/coach");
				break;
			default:
				router.push("/dashboard/paciente");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="border p-2 rounded"
				/>
				<input
					type="password"
					placeholder="Contraseña"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="border p-2 rounded"
				/>
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<button
					type="submit"
					className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
				>
					Entrar
				</button>
			</form>
		</div>
	);
}
