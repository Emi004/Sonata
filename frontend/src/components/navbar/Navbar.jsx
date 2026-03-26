import LoginDropdown from './LoginDropdown';
import SignedOutButtons from './SignedOutButtons';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import  sonata_logo from '../../assets/imgs/Sonata.png';

function Navbar() {
	
	const {session}= useAuth();

	return (
		<nav className="navbar pl-0 pr-5 bg-base-100 border-b border-accent border-sm">
			<div className="navbar-start">
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
