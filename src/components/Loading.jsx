export default function Loading({ label = "Loading…" }) {
	return (
		<div
			role="status"
			aria-live="polite"
			aria-label={label}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		>
			<div className="flex flex-col items-center gap-6">
				<div className="relative">
					{/* Glow ring */}
					<div className="absolute -inset-6 rounded-full bg-white/10 blur-2xl" />
					{/* Logo with flicker */}
					<img
						src="/logo.png"
						alt="App logo"
						className="animate-flicker h-20 w-20 select-none"
						draggable={false}
					/>
				</div>

				<div className="flex items-center gap-2 text-white/90">
					<span className="h-2 w-2 animate-bounce rounded-full bg-white/80 [animation-delay:-0.2s]" />
					<span className="h-2 w-2 animate-bounce rounded-full bg-white/80" />
					<span className="h-2 w-2 animate-bounce rounded-full bg-white/80 [animation-delay:0.2s]" />
					<span className="sr-only">{label}</span>
				</div>
			</div>
		</div>
	);
}

