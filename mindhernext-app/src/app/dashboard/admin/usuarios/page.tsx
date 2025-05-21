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

	useEffect(() => {
		const fetchUsuarios = async () => {
			const res = await fetch("/api/admin/usuarios");
			const data = await res.json();
			setUsuarios(data);
			setLoading(false);
		};
		fetchUsuarios();
	}, []);

	if (status === "loading" || loading)
		return <p className="p-6">Cargando...</p>;
	if (!session || session.user.role !== "ADMIN") return <p>No autorizado</p>;

	return (
		<div className="max-w-5xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Gestín de Usuarios</h1>

			{usuarios.length === 0 ? (
				<p className="text-gray-600">No hay usuarios registrados.</p>
			) : (
				<table className="min-w-full bg-white shadow rounded overflow-hidden">
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
