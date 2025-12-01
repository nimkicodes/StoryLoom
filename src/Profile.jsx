import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { NavBar } from './Globals';
import { HiLogout } from 'react-icons/hi';
import './index.css';

const Profile = () => {
    const { currentUser, logout } = useAuth();
    const [error, setError] = useState('');
    const [zines, setZines] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserZines = async () => {
            if (!currentUser) return;

            try {
                // Add timestamp to prevent caching
                const response = await fetch(`http://localhost:3001/api/zines?_t=${Date.now()}`);
                if (!response.ok) throw new Error('Failed to fetch zines');

                const allZines = await response.json();

                // Filter zines for the current user. 

                const userZines = allZines.filter(zine => zine.userId === currentUser.uid);
                setZines(userZines);
            } catch (err) {
                console.error("Error fetching zines:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserZines();
    }, [currentUser]);

    async function handleLogout() {
        setError('');
        try {
            await logout();
            navigate('/login');
        } catch {
            setError('Failed to log out');
        }
    }

    if (!currentUser) {
        navigate('/login');
        return null;
    }

    const slugify = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };


    const avatarLetter = currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase();
    const displayName = currentUser.displayName || currentUser.email.split('@')[0];

    return (
        <div className="flex flex-col min-h-screen bg-sl-background font-sans">
            <NavBar />

            <div className="flex-grow w-full max-w-6xl mx-auto px-4 py-8">
                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between relative gap-6 md:gap-0">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
                        {/* Avatar */}
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-sl-orange flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-inner">
                            {avatarLetter}
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col items-center md:items-start">
                            <h1 className="text-2xl md:text-4xl font-bold text-sl-title mb-1">{displayName}</h1>
                            <p className="text-gray-500 text-base md:text-lg mb-4">{currentUser.email}</p>

                            <div className="flex gap-8 text-sl-title">
                                <div className="flex flex-col">
                                    <span className="text-xl md:text-2xl font-bold">{zines.length}</span>
                                    <span className="text-xs md:text-sm text-gray-500">Zines Created</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl md:text-2xl font-bold">0</span>
                                    <span className="text-xs md:text-sm text-gray-500">Bookmarks</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sign Out Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-2 border border-sl-orange text-sl-orange rounded-lg hover:bg-sl-orange hover:text-white transition-colors font-medium md:absolute md:top-8 md:right-8 w-full md:w-auto justify-center"
                    >
                        <HiLogout className="text-xl" />
                        <span>Sign Out</span>
                    </button>

                    {error && <div className="absolute bottom-4 right-8 text-red-500 text-sm">{error}</div>}
                </div>

                {/* Zines Grid */}
                <div className="w-full">
                    <h2 className="text-2xl font-bold text-sl-title mb-6 border-b border-gray-200 pb-2">Your Zines</h2>

                    {loading ? (
                        <p className="text-center text-gray-500 py-10">Loading your zines...</p>
                    ) : zines.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 mb-4">You haven't created any zines yet.</p>
                            <Link to="/create" className="text-sl-orange font-bold hover:underline">Create your first zine!</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {zines.map((zine) => (
                                <Link
                                    key={zine._id}
                                    to={`/zine/${zine._id}/${slugify(zine.title)}`}
                                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="aspect-[3/4] w-full overflow-hidden bg-gray-200 relative">
                                        {zine.pages && zine.pages[0] ? (
                                            <img
                                                src={zine.pages[0]}
                                                alt={`Cover of ${zine.title}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Cover</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <span className="text-white font-bold">Read Now</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-sl-title truncate">{zine.title}</h3>
                                        <p className="text-sm text-gray-500 truncate">by {zine.author}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
