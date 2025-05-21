"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ContadorUsuarios {
	total: number;
	pacientes: number;
	psicologos: number;
	coaches: number;
	admins: number;
}

export default function PerfilAdmin() {
	const { data: session, status } = useSession();
	const [stats, setStats] = useState<ContadorUsuarios | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			const res = await fetch("/api/admin/usuarios/stats");
			const data = await res.json();
			setStats(data);
		};
		fetchStats();
	}, []);

	if (status === "loading") return <p className="p-6">Cargando sesión...</p>;
	if (!session || session.user.role !== "ADMIN") return <p>No autorizado</p>;

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-4">Mi Perfil (Admin)</h1>

			<div className="bg-white text-black p-4 rounded shadow mb-6">
				<p>
					<strong>Nombre:</strong> {session.user.name}
				</p>
				<p>
					<strong>Email:</strong> {session.user.email}
				</p>
				<p>
					<strong>Rol:</strong> {session.user.role}
				</p>
			</div>

			{stats ? (
				<div className="bg-white text-black p-4 rounded shadow">
					<h2 className="text-xl font-semibold mb-2">
						Estadísticas de usuarios
					</h2>
					<p>
						<strong>Total:</strong> {stats.total}
					</p>
					<p>
						<strong>Pacientes:</strong> {stats.pacientes}
					</p>
					<p>
						<strong>Psicólogos:</strong> {stats.psicologos}
					</p>
					<p>
						<strong>Coaches:</strong> {stats.coaches}
					</p>
					<p>
						<strong>Administradores:</strong> {stats.admins}
					</p>
				</div>
			) : (
				<p className="text-gray-400">Cargando estadísticas...</p>
			)}
		</div>
	);
}
