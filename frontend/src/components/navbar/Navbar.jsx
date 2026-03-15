import LoginDropdown from './LoginDropdown';
import SignedOutButtons from './SignedOutButtons';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
	
	const {session,user}= useAuth();

	return (
		<nav className="navbar pl-5 pr-5 bg-base-100 shadow-accent shadow-sm">
			<div className="navbar-start">
				<button className="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						className="inline-block h-5 w-5 stroke-current"
					>
						{' '}
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>{' '}
					</svg>
				</button>
				<a className="btn btn-ghost text-xl">Sonata {user?.username}</a>
			</div>
			<div className="navbar-center">
				<input
					type="text"
					placeholder="Listen to..."
					className="input input-bordered focus:outline-none focus:border-accent rounded-full w-lg"
				/>
			</div>
			<div className="navbar-end gap-3">
				{session ? <LoginDropdown /> : <SignedOutButtons />}
			</div>
		</nav>
	);
}

export default Navbar;
