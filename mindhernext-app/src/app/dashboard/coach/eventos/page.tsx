"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Evento {
	id: string;
	titulo: string;
	descripcion?: string;
	fechaHora: string;
	creadoEn: string;
}

export default function EventosCoachPage() {
	const { data: session, status } = useSession();
	const [eventos, setEventos] = useState<Evento[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEventos = async () => {
			const res = await fetch("/api/coach/eventos");
			const data = await res.json();
			setEventos(data);
			setLoading(false);
		};

		fetchEventos();
	}, []);

	if (status === "loading" || loading)
		return <p className="p-6">Cargando...</p>;
	if (!session || session.user.role !== "COACH") return <p>No autorizado</p>;

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Tus eventos de coaching</h1>

			{eventos.length === 0 ? (
				<p className="text-gray-400">No tienes eventos programados aún.</p>
			) : (
				<ul className="space-y-4">
					{eventos.map((evento) => (
						<li
							key={evento.id}
							className="p-4 border bg-white text-black rounded shadow"
						>
							<h2 className="text-lg font-semibold">{evento.titulo}</h2>
							<p className="text-sm text-gray-700">
								{new Date(evento.fechaHora).toLocaleString("es-ES", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
							{evento.descripcion && (
								<p className="mt-1 text-gray-600">{evento.descripcion}</p>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
