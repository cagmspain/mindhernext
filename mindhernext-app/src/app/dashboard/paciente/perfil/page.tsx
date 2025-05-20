"use client";

import { useSession } from "next-auth/react";

export default function PerfilPage() {
	const { data: session, status } = useSession();

	if (status === "loading") return <p className="p-6">Cargando sesión...</p>;
	if (!session || session.user.role !== "PACIENTE") return <p>No autorizado</p>;

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
			<h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
			<div className="space-y-4">
				<div>
					<label className="font-semibold">Nombre:</label>
					<p className="text-gray-700">
						{session.user.name || "No registrado"}
					</p>
				</div>
				<div>
					<label className="font-semibold">Email:</label>
					<p className="text-gray-700">{session.user.email}</p>
				</div>
				<div>
					<label className="font-semibold">Rol:</label>
					<p className="text-gray-700">{session.user.role}</p>
				</div>
			</div>
		</div>
	);
}
