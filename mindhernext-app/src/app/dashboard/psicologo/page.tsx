// src/app/dashboard/psicologo/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Cita {
	id: string;
	fechaHora: string;
	estado: string;
	paciente: {
		name: string;
	};
}

export default function PsicologoDashboard() {
	const { data: session, status } = useSession();
	const [citas, setCitas] = useState<Cita[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCitas = async () => {
			const res = await fetch("/api/psicologo/citas");
			const data = await res.json();
			setCitas(data);
			setLoading(false);
		};

		fetchCitas();
	}, []);

	if (status === "loading" || loading)
		return <p className="p-6">Cargando...</p>;
	if (!session || session.user.role !== "PSICOLOGO")
		return <p>No autorizado</p>;

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Tus Citas Programadas</h1>

			{citas.length === 0 ? (
				<p className="text-gray-600">No tienes citas próximas.</p>
			) : (
				<ul className="space-y-4">
					{citas.map((cita) => (
						<li key={cita.id} className="p-4 bg-white border rounded shadow">
							<p>
								Paciente: <strong>{cita.paciente.name || "Sin nombre"}</strong>
							</p>
							<p>
								Fecha y hora:{" "}
								<strong>
									{new Date(cita.fechaHora).toLocaleString("es-ES", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</strong>
							</p>
							<p>Estado: {cita.estado}</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
