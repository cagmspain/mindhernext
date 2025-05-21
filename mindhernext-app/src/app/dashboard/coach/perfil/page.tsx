"use client";
import { useSession } from "next-auth/react";

export default function PerfilCoach() {
	const { data: session, status } = useSession();

	if (status === "loading") return <p>Cargando...</p>;
	if (!session || session.user.role !== "COACH") return <p>No autorizado</p>;

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-4">Mi Perfil</h1>
			<div className="bg-white text-black p-4 rounded shadow">
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
		</div>
	);
}
