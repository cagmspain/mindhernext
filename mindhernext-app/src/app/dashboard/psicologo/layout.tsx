import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="p-10 border border-gray-200">
			<h2 className="text-xl font-semibold mb-4">Panel del Psicólogo</h2>
			{children}
		</div>
	);
}
