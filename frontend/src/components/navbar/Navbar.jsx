import LoginDropdown from './LoginDropdown';
import SignedOutButtons from './SignedOutButtons';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import  sonata_logo from '../../assets/imgs/Sonata.png';

function Navbar() {
	
	const {session}= useAuth();

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
				<NavLink
					to="/"
					className="btn btn-ghost gap-1 normal-case px-3 flex items-center"
				>
					<img
						src={sonata_logo}
						alt="Sonata logo"
						className="w-9 h-9 rounded-full object-cover shadow-sm"
					/>
					<span className="text-2xl font-semibold tracking-tight">Sonata</span>
				</NavLink>
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
