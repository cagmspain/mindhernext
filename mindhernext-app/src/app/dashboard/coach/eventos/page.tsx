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

	const [titulo, setTitulo] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [fechaHora, setFechaHora] = useState("");
	const [creando, setCreando] = useState(false);

	useEffect(() => {
		fetchEventos();
	}, []);

	const fetchEventos = async () => {
		const res = await fetch("/api/coach/eventos");

		if (!res.ok) {
			console.warn("Error al obtener eventos:", await res.text());
			setLoading(false);
			return;
		}

		const data: Evento[] = await res.json();

		if (!Array.isArray(data)) {
			console.error("La respuesta no es un array:", data);
			setLoading(false);
			return;
		}

		setEventos(data);
		setLoading(false);
	};

	const crearEvento = async (e: React.FormEvent) => {
		e.preventDefault();
		setCreando(true);

		const res = await fetch("/api/coach/eventos", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ titulo, descripcion, fechaHora }),
		});

		if (!res.ok) {
			console.error("Error al crear evento:", await res.text());
			setCreando(false);
			return;
		}

		setTitulo("");
		setDescripcion("");
		setFechaHora("");
		await fetchEventos();
		setCreando(false);
	};

	const eliminarEvento = async (id: string) => {
		const res = await fetch(`/api/coach/eventos?id=${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error("Error al eliminar evento:", await res.text());
			return;
		}

		await fetchEventos();
	};

	if (status === "loading" || loading)
		return <p className="p-6">Cargando...</p>;
	if (!session || session.user.role !== "COACH") return <p>No autorizado</p>;

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Tus eventos de coaching</h1>

			<form
				onSubmit={crearEvento}
				className="space-y-4 bg-white text-black p-4 rounded shadow mb-8"
			>
				<h2 className="text-lg font-semibold">Crear nuevo evento</h2>
				<input
					type="text"
					placeholder="Título"
					value={titulo}
					onChange={(e) => setTitulo(e.target.value)}
					required
					className="w-full border p-2 rounded"
				/>
				<textarea
					placeholder="Descripción (opcional)"
					value={descripcion}
					onChange={(e) => setDescripcion(e.target.value)}
					className="w-full border p-2 rounded"
				/>
				<input
					type="datetime-local"
					value={fechaHora}
					onChange={(e) => setFechaHora(e.target.value)}
					required
					className="w-full border p-2 rounded"
				/>
				<button
					type="submit"
					disabled={creando}
					className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
				>
					{creando ? "Creando..." : "Crear evento"}
				</button>
			</form>

			{eventos.length === 0 ? (
				<p className="text-gray-400">No tienes eventos programados aún.</p>
			) : (
				<ul className="space-y-4">
					{eventos.map((evento) => (
						<li
							key={evento.id}
							className="p-4 border bg-white text-black rounded shadow flex justify-between items-start"
						>
							<div>
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
							</div>
							<button
								onClick={() => eliminarEvento(evento.id)}
								className="text-red-600 text-sm hover:underline ml-4"
							>
								Eliminar
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
