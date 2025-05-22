"use client";

import { useState } from "react";

export default function CrearEventoAdmin() {
	const [titulo, setTitulo] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [fechaHora, setFechaHora] = useState("");
	const [mensaje, setMensaje] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await fetch("/api/admin/eventos", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ titulo, descripcion, fechaHora }),
		});

		const data = await res.json();
		if (res.ok) {
			setMensaje("Evento creado con éxito");
			setTitulo("");
			setDescripcion("");
			setFechaHora("");
		} else {
			setMensaje(data.error || "Error al crear el evento");
		}
	};

	return (
		<div className="max-w-xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Crear nuevo evento</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					placeholder="Título"
					value={titulo}
					onChange={(e) => setTitulo(e.target.value)}
					className="border p-2 w-full rounded"
					required
				/>
				<textarea
					placeholder="Descripción"
					value={descripcion}
					onChange={(e) => setDescripcion(e.target.value)}
					className="border p-2 w-full rounded"
				/>
				<input
					type="datetime-local"
					value={fechaHora}
					onChange={(e) => setFechaHora(e.target.value)}
					className="border p-2 w-full rounded"
					required
				/>
				<button
					type="submit"
					className="bg-blue-600 text-white px-4 py-2 rounded"
				>
					Crear evento
				</button>
			</form>
			{mensaje && <p className="mt-4">{mensaje}</p>}
		</div>
	);
}
