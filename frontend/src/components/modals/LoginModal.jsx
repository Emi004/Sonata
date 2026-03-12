import { useState } from "react";

// Props:
// - isOpen: boolean – controls visibility
// - onClose: () => void – called when modal should close
// - onSubmit: ({ email, password }) => Promise<void> | void – optional auth handler
function LoginModal({ isOpen, onClose, onSubmit }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!onSubmit) {
			// No handler wired yet; just close.
			onClose?.();
			return;
		}
		try {
			setIsSubmitting(true);
			await onSubmit({ email, password });
			onClose?.();
		} catch (err) {
			setError(err?.message || "Failed to log in");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-[350px] pt-4">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-lg">Login</h3>
					<button
						type="button"
						className="btn btn-circle btn-ghost text-lg"
						onClick={onClose}
					>
						✖
					</button>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="form-control">
						<label className="label">
							<span className="label-text">Email</span>
						</label>
						<input
							type="email"
							className="input input-bordered w-full"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Password</span>
						</label>
						<input
							type="password"
							className="input input-bordered w-full"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{error && (
						<p className="text-sm text-error mt-1">{error}</p>
					)}
					<button
						type="submit"
						className="btn btn-primary w-full mt-2"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
			<button className="modal-backdrop" onClick={onClose} />
		</div>
	);
}

export default LoginModal;

