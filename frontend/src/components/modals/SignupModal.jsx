import { useState } from "react";
import { useAuth } from "../../context/AuthContext";


function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const { signUp } = useAuth();
	if (!isOpen) return null;

	const handleSignUp = async (e) => {
		e.preventDefault();
        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }
        setIsSubmitting(true);
        try{
            const response = await signUp({email,password,username});

            if (response.data){
				onClose?.();
				onSwitchToLogin?.();
            }

        }catch(err){
            setError(err?.message || "Failed to sign up");
        } finally {
            setIsSubmitting(false);
        }
		
	};

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-[500px] pt-4">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-lg">Create an account</h3>
					<button
						type="button"
						className="btn btn-circle btn-ghost text-lg"
						onClick={onClose}
					>
						✖
					</button>
				</div>
				<form onSubmit={handleSignUp} className="space-y-4">
					<div className="flex gap-3">
						<div className="form-control w-1/2">
							<label className="label">
								<span className="label-text">Username</span>
							</label>
							<input
								type="text"
								className="input input-bordered w-full"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div className="form-control w-1/2">
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
					<div className="form-control">
						<label className="label">
							<span className="label-text">Confirm Password</span>
						</label>
						<input
							type="password"
							className="input input-bordered w-full"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
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
						{isSubmitting ? "Signing up..." : "Sign Up"}
					</button>
				</form>
			</div>
			<button className="modal-backdrop" onClick={onClose} />
		</div>

	);
}

export default SignupModal;

