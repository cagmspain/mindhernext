"use client";
// src/app/dashboard/coach/page.tsx
"use client";

import { useSession } from "next-auth/react";

export default function CoachDashboard() {
	const { data: session, status } = useSession();

	if (status === "loading") return <p className="p-6">Cargando...</p>;
	if (!session || session.user.role !== "COACH") return <p>No autorizado</p>;

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">
				Bienvenido/a, {session.user.name}
			</h1>
			<p>
				Este es tu panel como coach. Aquí podrás gestionar tus eventos, sesiones
				y seguimiento.
			</p>
		</div>
	);
}
