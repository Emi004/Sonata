import { useState } from "react";
import LoginModal from "../modals/LoginModal";
import SignupModal from "../modals/SignupModal";
import { AuthProvider } from "../../context/AuthContext";

function SignedOutButtons() {
	const [showLogin, setShowLogin] = useState(false);
	const [showSignup, setShowSignup] = useState(false);

	return (
		<>
			<div className="flex gap-2">
				<button
					onClick={() => setShowLogin(true)}
					className="btn bg-transparent border-base-300 transition ease-in-out duration-300 hover:bg-base-300"
				>
					Login
				</button>
				<button
					onClick={() => setShowSignup(true)}
					className="btn bg-transparent border-accent transition ease-in-out duration-300 hover:bg-accent"
				>
					Sign Up
				</button>
			</div>

			<LoginModal
				isOpen={showLogin}
				onClose={() => setShowLogin(false)}
			/>
				<SignupModal
					isOpen={showSignup}
					onClose={() => setShowSignup(false)}
					onSwitchToLogin={() => {
						setShowSignup(false);
						setShowLogin(true);
					}}
				/>
		</>
	);
}

export default SignedOutButtons;
