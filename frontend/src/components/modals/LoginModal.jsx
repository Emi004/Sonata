import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function LoginModal({ isOpen, onClose, onSubmit }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const {Login} = useAuth();
	if (!isOpen) return null;

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try{
			const response = await Login({email,password});
			if (response.data){
				onClose?.();
			} else {
				setError(response.error || "Failed to log in");
			}
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
				<form onSubmit={handleLogin} className="space-y-4">
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

