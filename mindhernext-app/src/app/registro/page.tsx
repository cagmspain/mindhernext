"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Las contraseñas no coinciden");
			return;
		}

		const res = await fetch("/api/registro", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		});

		if (res.ok) {
			router.push("/login");
		} else {
			const text = await res.text();
			setError(text || "Error al registrar usuario");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-4">Registro</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="text"
					placeholder="Nombre"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					className="border p-2 rounded"
				/>
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
					minLength={6}
					className="border p-2 rounded"
				/>
				<input
					type="password"
					placeholder="Confirmar contraseña"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
					minLength={6}
					className="border p-2 rounded"
				/>
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<button
					type="submit"
					className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
				>
					Registrarse
				</button>
			</form>
		</div>
	);
}
