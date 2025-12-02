import './index.css';
import logoYarn from '../resource/logo_yarn.png'; // Import the image directly
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useState } from 'react';
import { LuHouse, LuBookOpen, LuCirclePlus, LuUser, LuMenu, LuX, LuLogIn } from 'react-icons/lu';

export const NavBar = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const getLinkClass = (path) => {
        const baseClass = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all w-full md:w-auto";
        if (isActive(path)) {
            return `${baseClass} bg-sl-title text-white`;
        }
        return `${baseClass} hover:text-sl-title hover:bg-gray-100`;
    };

    return (
        <div className="relative w-full bg-white drop-shadow-sm z-[100]">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
                {/* logo */}
                <Link to="/" className="flex items-center gap-2 md:gap-4" onClick={closeMenu}>
                    <div className="h-10 w-10 md:h-12 md:w-12">
                        <img src={logoYarn} alt="StoryLoom Logo" className="h-full w-full object-contain" />
                    </div>
                    <span className="font-serif text-2xl md:text-4xl font-bold text-sl-title">StoryLoom</span>
                </Link>

                {/* Hamburger Menu Button */}
                <button
                    className="md:hidden text-3xl text-sl-title p-2"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <LuX /> : <LuMenu />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4 font-medium text-lg text-sl-text">
                    <Link to="/" className={getLinkClass('/')}>
                        <LuHouse className="text-xl" />
                        <span>Home</span>
                    </Link>
                    <Link to="/browse" className={getLinkClass('/browse')}>
                        <LuBookOpen className="text-xl" />
                        <span>Browse</span>
                    </Link>
                    <Link to="/create" className={getLinkClass('/create')}>
                        <LuCirclePlus className="text-xl" />
                        <span>Create</span>
                    </Link>

                    {currentUser ? (
                        <Link to="/profile" className={getLinkClass('/profile')}>
                            <LuUser className="text-xl" />
                            <span>Profile</span>
                        </Link>
                    ) : (
                        <Link to="/login" className={getLinkClass('/login')}>
                            <LuLogIn className="text-xl" />
                            <span>Log In</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col gap-2 border-t border-gray-100">
                    <Link to="/" className={getLinkClass('/')} onClick={closeMenu}>
                        <LuHouse className="text-xl" />
                        <span>Home</span>
                    </Link>
                    <Link to="/browse" className={getLinkClass('/browse')} onClick={closeMenu}>
                        <LuBookOpen className="text-xl" />
                        <span>Browse</span>
                    </Link>
                    <Link to="/create" className={getLinkClass('/create')} onClick={closeMenu}>
                        <LuCirclePlus className="text-xl" />
                        <span>Create</span>
                    </Link>

                    {currentUser ? (
                        <Link to="/profile" className={getLinkClass('/profile')} onClick={closeMenu}>
                            <LuUser className="text-xl" />
                            <span>Profile</span>
                        </Link>
                    ) : (
                        <Link to="/login" className={getLinkClass('/login')} onClick={closeMenu}>
                            <LuLogIn className="text-xl" />
                            <span>Log In</span>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

