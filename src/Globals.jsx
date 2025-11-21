import './index.css';
import logoYarn from '../resource/logo_yarn.png'; // Import the image directly
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useState } from 'react';
import { HiHome, HiBookOpen, HiPlusCircle, HiUser } from 'react-icons/hi';

export const NavBar = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const getLinkClass = (path) => {
        const baseClass = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all";
        if (isActive(path)) {
            return `${baseClass} bg-sl-title text-white`;
        }
        return `${baseClass} hover:text-sl-title hover:bg-gray-100`;
    };

    return (
        <div className="flex items-center justify-between px-8 py-4 w-full bg-white drop-shadow-sm">
            {/* logo */}
            <div className="flex items-center gap-4">
                <div className="h-12 w-12">
                    <img src={logoYarn} alt="StoryLoom Logo" className="h-full w-full object-contain" />
                </div>
                <span className="font-serif text-4xl font-bold text-sl-title">StoryLoom</span>
            </div>

            {/* navigation */}
            <div className="flex items-center gap-4 font-medium text-lg text-sl-text">
                <Link to="/" className={getLinkClass('/')}>
                    <HiHome className="text-xl" />
                    <span>Home</span>
                </Link>
                <Link to="/browse" className={getLinkClass('/browse')}>
                    <HiBookOpen className="text-xl" />
                    <span>Browse</span>
                </Link>
                <Link to="/create" className={getLinkClass('/create')}>
                    <HiPlusCircle className="text-xl" />
                    <span>Create</span>
                </Link>

                {currentUser ? (
                    <Link to="/profile" className={getLinkClass('/profile')}>
                        <HiUser className="text-xl" />
                        <span>Profile</span>
                    </Link>
                ) : (
                    <Link to="/login" className={getLinkClass('/login')}>
                        <span>Log In</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

