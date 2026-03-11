function SignedOutButtons() {
	return (
		<div className="flex gap-2">
			<button
				onClick={0}
				className="btn bg-transparent  border-base-300 transition ease-in-out duration-300 hover:bg-base-300"
			>
				Login
			</button>
			<button className="btn bg-transparent border-accent transition ease-in-out duration-300  hover:bg-accent">
				Sign Up
			</button>
		</div>
	);
}
export default SignedOutButtons;
