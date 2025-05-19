"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Disponibilidad = {
	id: string;
	diaSemana: number;
	horaInicio: string;
	horaFin: string;
};

const dias = [
	"Domingo",
	"Lunes",
	"Martes",
	"Miércoles",
	"Jueves",
	"Viernes",
	"Sábado",
];

export default function DisponibilidadPage() {
	const { data: session, status } = useSession();
	const [diaSemana, setDiaSemana] = useState(1);
	const [horaInicio, setHoraInicio] = useState("09:00");
	const [horaFin, setHoraFin] = useState("13:00");
	const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>(
		[]
	);
	const [loading, setLoading] = useState(false);

	const fetchDisponibilidades = async () => {
		const res = await fetch("/api/disponibilidad");
		const data = await res.json();
		setDisponibilidades(data);
	};

	useEffect(() => {
		fetchDisponibilidades();
	}, []);

	const crearDisponibilidad = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		await fetch("/api/disponibilidad", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ diaSemana, horaInicio, horaFin }),
		});

		setDiaSemana(1);
		setHoraInicio("09:00");
		setHoraFin("13:00");

		await fetchDisponibilidades();
		setLoading(false);
	};

	const eliminarDisponibilidad = async (id: string) => {
		await fetch(`/api/disponibilidad?id=${id}`, {
			method: "DELETE",
		});

		setDisponibilidades(disponibilidades.filter((d) => d.id !== id));
	};

	if (status === "loading") return <p className="p-6">Cargando sesión...</p>;
	if (!session || session.user.role !== "PSICOLOGO")
		return <p>No autorizado</p>;

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Gestiona tu disponibilidad</h1>

			<form
				onSubmit={crearDisponibilidad}
				className="space-y-4 bg-gray-50 p-4 rounded-lg shadow"
			>
				<div>
					<label className="block mb-1 font-medium">Día de la semana</label>
					<select
						value={diaSemana}
						onChange={(e) => setDiaSemana(Number(e.target.value))}
						className="border p-2 w-full rounded"
					>
						{dias.map((dia, index) => (
							<option key={index} value={index}>
								{dia}
							</option>
						))}
					</select>
				</div>

				<div className="flex gap-4">
					<div className="flex-1">
						<label className="block mb-1 font-medium">Hora inicio</label>
						<input
							type="time"
							value={horaInicio}
							onChange={(e) => setHoraInicio(e.target.value)}
							className="border p-2 w-full rounded"
							required
						/>
					</div>

					<div className="flex-1">
						<label className="block mb-1 font-medium">Hora fin</label>
						<input
							type="time"
							value={horaFin}
							onChange={(e) => setHoraFin(e.target.value)}
							className="border p-2 w-full rounded"
							required
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
				>
					{loading ? "Guardando..." : "Añadir disponibilidad"}
				</button>
			</form>

			<div className="mt-8">
				<h2 className="text-xl font-semibold mb-3">Tus disponibilidades</h2>
				{disponibilidades.length === 0 ? (
					<p className="text-gray-600">No hay disponibilidad registrada.</p>
				) : (
					<ul className="space-y-2">
						{disponibilidades.map((d) => (
							<li
								key={d.id}
								className="flex justify-between items-center border p-3 rounded bg-white shadow-sm"
							>
								<span>
									{dias[d.diaSemana]}: {d.horaInicio} - {d.horaFin}
								</span>
								<button
									onClick={() => eliminarDisponibilidad(d.id)}
									className="text-red-500 hover:underline text-sm"
								>
									Eliminar
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
