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

export default function CitasPage() {
	const { data: session, status } = useSession();
	const [citas, setCitas] = useState<Cita[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchCitas = async () => {
		const res = await fetch("/api/cita");
		const data = await res.json();
		setCitas(data);
	};

	const cancelarCita = async (id: string) => {
		setLoading(true);
		await fetch(`/api/cita?id=${id}`, { method: "DELETE" });
		await fetchCitas();
		setLoading(false);
	};

	useEffect(() => {
		fetchCitas();
	}, []);

	if (status === "loading") return <p className="p-6">Cargando sesión...</p>;
	if (!session || session.user.role !== "PACIENTE") return <p>No autorizado</p>;

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Mis Citas</h1>
			{citas.length === 0 ? (
				<p className="text-gray-600">No tienes citas agendadas.</p>
			) : (
				<ul className="space-y-3">
					{citas.map((cita) => (
						<li
							key={cita.id}
							className="flex justify-between items-center border p-4 rounded-lg bg-white shadow"
						>
							<span>
								<strong>{cita.psicologo.name}</strong> -{" "}
								{new Date(cita.fechaHora).toLocaleString("es-ES")}({cita.estado}
								)
							</span>
							{cita.estado === "PENDIENTE" && (
								<button
									onClick={() => cancelarCita(cita.id)}
									disabled={loading}
									className="text-red-600 hover:underline"
								>
									Cancelar
								</button>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
