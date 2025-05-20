"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Tipo de disponibilidad
interface Disponibilidad {
	id: string;
	diaSemana: number;
	horaInicio: string;
	horaFin: string;
	psicologo: {
		name: string;
	};
}

const dias = [
	"Domingo",
	"Lunes",
	"Martes",
	"Miércoles",
	"Jueves",
	"Viernes",
	"Sábado",
];

export default function AgendarCitaPage() {
	const { data: session, status } = useSession();
	const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>(
		[]
	);
	const [loading, setLoading] = useState(false);
	const [mensaje, setMensaje] = useState("");

	const fetchDisponibilidades = async () => {
		const res = await fetch("/api/disponibilidad/todas");
		const data = await res.json();
		setDisponibilidades(data);
	};

	const agendar = async (disponibilidadId: string) => {
		setLoading(true);
		const res = await fetch("/api/cita", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ disponibilidadId }),
		});

		if (res.ok) {
			const cita = await res.json();
			const fecha = new Date(cita.fechaHora);
			const fechaStr = fecha.toLocaleString("es-ES", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
			setMensaje(`✅ Cita agendada para el ${fechaStr}`);
		} else {
			setMensaje("❌ No se pudo agendar la cita. Intenta de nuevo.");
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchDisponibilidades();
	}, []);

	if (status === "loading") return <p className="p-6">Cargando sesión...</p>;
	if (!session || session.user.role !== "PACIENTE") return <p>No autorizado</p>;

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Agendar una cita</h1>

			{mensaje && (
				<div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
					{mensaje}
				</div>
			)}

			{disponibilidades.length === 0 ? (
				<p className="text-gray-600">No hay disponibilidad por ahora.</p>
			) : (
				<ul className="space-y-3">
					{disponibilidades.map((d) => (
						<li
							key={d.id}
							className="flex justify-between items-center border p-4 rounded-lg bg-white shadow"
						>
							<span>
								<strong>{d.psicologo.name}</strong> - {dias[d.diaSemana]}:{" "}
								{d.horaInicio} a {d.horaFin}
							</span>
							<button
								onClick={() => agendar(d.id)}
								disabled={loading}
								className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
							>
								Reservar
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
