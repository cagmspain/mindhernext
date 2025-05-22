"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Usuario {
	id: string;
	name: string;
	email: string;
	role: string;
	createdAt: string;
}

export default function UsuariosAdminPage() {
	const { data: session, status } = useSession();
	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("");

	useEffect(() => {
		fetchUsuarios();
	}, []);

	const fetchUsuarios = async () => {
		setLoading(true);
		const res = await fetch("/api/admin/usuarios");
		const data = await res.json();
		setUsuarios(data);
		setLoading(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await fetch("/api/admin/usuarios", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password, role }),
		});

		if (res.ok) {
			await fetchUsuarios();
			setName("");
			setEmail("");
			setPassword("");
			setRole("");
		} else {
			alert("Error al crear usuario");
		}
	};

	if (status === "loading" || loading)
		return <p className="p-6 text-white">Cargando...</p>;
	if (!session || session.user.role !== "ADMIN")
		return <p className="text-white">No autorizado</p>;

	return (
		<div className="max-w-5xl mx-auto p-6 text-white">
			<h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

			<form
				onSubmit={handleSubmit}
				className="bg-white text-black rounded shadow p-4 mb-8 space-y-4"
			>
				<h2 className="text-xl font-semibold">Crear nuevo usuario</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<input
						type="text"
						placeholder="Nombre"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="border p-2 rounded w-full"
						required
					/>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="border p-2 rounded w-full"
						required
					/>
					<input
						type="password"
						placeholder="Contraseña"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="border p-2 rounded w-full"
						required
					/>
					<select
						value={role}
						onChange={(e) => setRole(e.target.value)}
						className="border p-2 rounded w-full"
						required
					>
						<option value="">Selecciona un rol</option>
						<option value="PACIENTE">Paciente</option>
						<option value="PSICOLOGO">Psicólogo</option>
						<option value="COACH">Coach</option>
						<option value="ADMIN">Admin</option>
					</select>
				</div>
				<button
					type="submit"
					className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
				>
					Crear usuario
				</button>
			</form>

			{usuarios.length === 0 ? (
				<p className="text-gray-400">No hay usuarios registrados.</p>
			) : (
				<table className="min-w-full bg-white text-black shadow rounded overflow-hidden">
					<thead className="bg-gray-100">
						<tr>
							<th className="text-left px-4 py-2">Nombre</th>
							<th className="text-left px-4 py-2">Email</th>
							<th className="text-left px-4 py-2">Rol</th>
							<th className="text-left px-4 py-2">Fecha de registro</th>
						</tr>
					</thead>
					<tbody>
						{usuarios.map((usuario) => (
							<tr key={usuario.id} className="border-t hover:bg-gray-50">
								<td className="px-4 py-2">{usuario.name || "Sin nombre"}</td>
								<td className="px-4 py-2">{usuario.email}</td>
								<td className="px-4 py-2">{usuario.role}</td>
								<td className="px-4 py-2">
									{new Date(usuario.createdAt).toLocaleDateString("es-ES")}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
