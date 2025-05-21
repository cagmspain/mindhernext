"use client";
import { useSession } from "next-auth/react";

export default function CoachDashboard() {
	const { data: session, status } = useSession();

	if (status === "loading") return <p>Cargando...</p>;
	if (!session || session.user.role !== "COACH") return <p>No autorizado</p>;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Bienvenido Coach</h1>
			<p>
				Este es tu panel. Aquí podrás ver y gestionar tus sesiones de coaching.
			</p>
		</div>
	);
}
