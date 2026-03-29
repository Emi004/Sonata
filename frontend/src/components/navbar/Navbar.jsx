import { useEffect, useRef, useState } from 'react';
import LoginDropdown from './LoginDropdown';
import SignedOutButtons from './SignedOutButtons';
import { useAuth } from '../../context/AuthContext';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import  sonata_logo from '../../assets/imgs/Sonata.png';
import { default_cover } from '../../assets/imgs/image.jsx';
import { useTracks } from '../../context/TrackContext.jsx';


function Navbar() {
	
	const {session}= useAuth();
	const { searchQuery, setSearchQuery, searchSuggestions } = useTracks();
	const navigate = useNavigate();
	const location = useLocation();
	const searchInputRef = useRef(null);
	const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
	const [isSuggestionOpen, setIsSuggestionOpen] = useState(true);
	const isOnSongsPage = location.pathname === '/';
	const showSuggestions =
		isOnSongsPage && isSuggestionOpen && searchQuery.trim().length > 0 && searchSuggestions.length > 0;

	useEffect(() => {
		if (!showSuggestions) {
			setSelectedSuggestionIndex(-1);
			return;
		}

		setSelectedSuggestionIndex((currentIndex) => {
			if (currentIndex >= searchSuggestions.length) {
				return searchSuggestions.length - 1;
			}
			return currentIndex;
		});
	}, [showSuggestions, searchSuggestions]);

	useEffect(() => {
		if (!isOnSongsPage) {
			setSearchQuery('');
			setIsSuggestionOpen(false);
			setSelectedSuggestionIndex(-1);
		}
	}, [isOnSongsPage, setSearchQuery]);

	useEffect(() => {
		if (location.pathname !== '/' || !searchQuery.trim()) {
			return;
		}

		const focusTimer = window.setTimeout(() => {
			searchInputRef.current?.focus();
			const queryLength = searchQuery.length;
			searchInputRef.current?.setSelectionRange(queryLength, queryLength);
		}, 0);

		return () => window.clearTimeout(focusTimer);
	}, [location.pathname, searchQuery]);

	const showSearchResultsPage = () => {
		if (location.pathname !== '/') {
			navigate('/');
		}
	};

	const applySuggestion = (suggestionTitle) => {
		setIsSuggestionOpen(false);
		setSearchQuery(suggestionTitle);
		setSelectedSuggestionIndex(-1);
		showSearchResultsPage();
	};

	const clearSearch = () => {
		setSearchQuery('');
		setIsSuggestionOpen(false);
		setSelectedSuggestionIndex(-1);
		searchInputRef.current?.focus();
	};

	const handleSearchClick = () => {
		if (searchQuery.trim()) {
			clearSearch();
		}
	};

	const handleSearchBlur = () => {
		window.setTimeout(() => {
			setIsSuggestionOpen(false);
			setSelectedSuggestionIndex(-1);
		}, 100);
	};

	const handleSearchKeyDown = (event) => {
		if (event.key === 'ArrowDown') {
			if (!showSuggestions) {
				return;
			}
			event.preventDefault();
			setSelectedSuggestionIndex((currentIndex) =>
				currentIndex < searchSuggestions.length - 1 ? currentIndex + 1 : 0,
			);
			return;
		}

		if (event.key === 'ArrowUp') {
			if (!showSuggestions) {
				return;
			}
			event.preventDefault();
			setSelectedSuggestionIndex((currentIndex) =>
				currentIndex > 0 ? currentIndex - 1 : searchSuggestions.length - 1,
			);
			return;
		}

		if (event.key === 'Enter') {
			if (selectedSuggestionIndex >= 0 && showSuggestions) {
				event.preventDefault();
				applySuggestion(searchSuggestions[selectedSuggestionIndex].title);
				return;
			}

			if (searchQuery.trim()) {
				setIsSuggestionOpen(false);
				showSearchResultsPage();
			}
		}
	};

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
			<div className="navbar-center relative">
				<input
					ref={searchInputRef}
					type="text"
					placeholder="Listen to..."
					className="input input-bordered focus:outline-none focus:border-accent rounded-full w-lg"
					value={searchQuery}
					onChange={(event) => {
						setIsSuggestionOpen(true);
						setSearchQuery(event.target.value);
						showSearchResultsPage();
					}}
					onClick={handleSearchClick}
					onBlur={handleSearchBlur}
					onKeyDown={handleSearchKeyDown}
				/>
				{showSuggestions && (
					<div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-base-300 bg-base-200 shadow-xl overflow-hidden z-20">
						{searchSuggestions.map((suggestion, index) => (
							<button
								key={suggestion.id}
								type="button"
								className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-base-300 ${index === selectedSuggestionIndex ? 'bg-base-300' : ''}`}
								onClick={() => applySuggestion(suggestion.title)}
								onMouseEnter={() => setSelectedSuggestionIndex(index)}
							>
								<img
									src={suggestion.image_url || default_cover}
									alt={suggestion.title}
									className="h-12 w-12 rounded-xl object-cover shrink-0"
								/>
								<span className="flex min-w-0 flex-col">
									<span className="truncate text-sm font-medium text-base-content">
										{suggestion.title}
									</span>
									<span className="truncate text-xs text-gray-400">
										{suggestion.artist_name}
									</span>
								</span>
							</button>
						))}
					</div>
				)}
			</div>
			<div className="navbar-end gap-3">
				{session ? <LoginDropdown /> : <SignedOutButtons />}
			</div>
		</nav>
	);
}

export default Navbar;
