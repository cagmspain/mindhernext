"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Cita {
	id: string;
	fechaHora: string;
	estado: string;
	psicologo: {
		name: string;
	};
}

export default function InicioPacientePage() {
	const { data: session, status } = useSession();
	const [proximaCita, setProximaCita] = useState<Cita | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCitas = async () => {
			try {
				const res = await fetch("/api/cita");

				if (!res.ok) {
					console.warn("Error al obtener citas:", await res.text());
					setLoading(false);
					return;
				}

				const data: Cita[] = await res.json();

				if (!Array.isArray(data)) {
					console.error("La respuesta no es un array:", data);
					setLoading(false);
					return;
				}

				const futuras = data.filter((c) => new Date(c.fechaHora) > new Date());
				setProximaCita(futuras[0] || null);
			} catch (error) {
				console.error("Error inesperado al obtener citas:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCitas();
	}, []);

	if (status === "loading" || loading)
		return <p className="p-6">Cargando...</p>;

	if (!session || session.user.role !== "PACIENTE") return <p>No autorizado</p>;

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">
				Bienvenido/a, {session.user.name || "Paciente"}
			</h1>

			{proximaCita ? (
				<div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded">
					<h2 className="text-xl font-semibold mb-2">📅 Tu próxima cita</h2>
					<p>
						Con <strong>{proximaCita.psicologo.name}</strong> el{" "}
						<strong>
							{new Date(proximaCita.fechaHora).toLocaleString("es-ES", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</strong>
					</p>
				</div>
			) : (
				<p className="text-gray-700 mb-6">
					No tienes citas próximas. ¡Agenda una nueva!
				</p>
			)}

			<a
				href="/dashboard/paciente/agendar"
				className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
			>
				+ Agendar nueva cita
			</a>
		</div>
	);
}
