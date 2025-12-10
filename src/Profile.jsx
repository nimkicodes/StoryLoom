import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { NavBar } from './Globals';
import { LogOut, Trash2 } from 'lucide-react';
import { useSnackbar } from './contexts/SnackbarContext';
import { Button } from './components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from './components/ui/dialog';
import './index.css';
import usePageTitle from './hooks/usePageTitle';

const Profile = () => {
    usePageTitle('Profile');
    const { currentUser, logout } = useAuth();
    const { userId } = useParams(); // Get user ID from URL if present
    const { showSnackbar } = useSnackbar();
    const [error, setError] = useState('');
    const [zines, setZines] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [profileUser, setProfileUser] = useState(null); // Stores the user data of the profile being viewed
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const targetUserId = userId || currentUser?.uid;
    const isOwner = currentUser && targetUserId === currentUser.uid;

    useEffect(() => {
        const fetchData = async () => {
            if (!targetUserId) return;

            setLoading(true); // Reset loading state on id change
            try {
                // Fetch user profile
                const userResponse = await fetch(`/api/users/${targetUserId}`);
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setProfileUser(userData);

                    // Handle Created Zines (Denormalized)
                    if (userData.createdZines && Array.isArray(userData.createdZines)) {
                        const mappedZines = userData.createdZines.map(z => ({
                            ...z,
                            _id: z.zineId,
                            pages: [z.coverImage]
                        }));
                        setZines(mappedZines);
                    } else {
                        // Fallback to old API if not present
                        const zinesResponse = await fetch(`/api/zines?userId=${targetUserId}&_t=${Date.now()}`);
                        if (zinesResponse.ok) {
                            const userZines = await zinesResponse.json();
                            setZines(userZines);
                        }
                    }

                    // Handle Bookmarks (Map or Array)
                    let bookmarksData = [];
                    if (userData.bookmarkedZines) {
                        if (Array.isArray(userData.bookmarkedZines)) {
                            bookmarksData = userData.bookmarkedZines;
                        } else {
                            bookmarksData = Object.values(userData.bookmarkedZines);
                        }
                    }

                    const mappedBookmarks = bookmarksData.map(b => ({
                        ...b,
                        _id: b.zineId,
                        pages: [b.coverImage]
                    }));
                    setBookmarks(mappedBookmarks);
                } else {
                    setError("User not found");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [targetUserId]);

    async function handleLogout() {
        setError('');
        try {
            await logout();
            navigate('/login');
        } catch {
            setError('Failed to log out');
        }
    }



    const slugify = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');

    };

    const handleDeleteZine = async (zineId) => {
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`/api/zines/${zineId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove from state immediately
                setZines(prevZines => prevZines.filter(z => z._id !== zineId));
                setBookmarks(prev => prev.filter(b => b._id !== zineId));
                showSnackbar('Zine deleted successfully', 'success');
            } else {
                const errText = await response.text();
                showSnackbar(`Failed to delete zine: ${errText}`, 'error');
            }
        } catch (err) {
            console.error("Error deleting zine:", err);
            showSnackbar('Error deleting zine', 'error');
        }
    };


    const avatarLetter = profileUser?.displayName ? profileUser.displayName.charAt(0).toUpperCase() : (profileUser?.email?.charAt(0).toUpperCase() || (zines.length > 0 ? zines[0].author.charAt(0).toUpperCase() : '?'));
    const displayName = profileUser?.displayName || profileUser?.email?.split('@')[0] || (zines.length > 0 ? zines[0].author : 'Unknown User');

    return (
        <div className="flex flex-col min-h-screen bg-sl-background font-sans">
            <NavBar />

            <div className="flex-grow w-full max-w-6xl mx-auto px-4 py-8">
                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between relative gap-6 md:gap-0">
                    {loading ? (
                        <div className="w-full flex flex-col items-center justify-center py-8">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
                            <div className="h-8 w-48 bg-gray-200 animate-pulse mb-2 rounded"></div>
                            <div className="h-4 w-32 bg-gray-200 animate-pulse mb-4 rounded"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
                                {/* Avatar */}
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-sl-orange flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-inner">
                                    {avatarLetter}
                                </div>

                                <div className="flex flex-col items-center md:items-start">
                                    <h1 className="text-2xl md:text-4xl font-bold text-sl-title mb-1">{displayName}</h1>
                                    {/* Only show email if it's the current user's profile, for privacy */}
                                    {isOwner && <p className="text-gray-500 text-base md:text-lg mb-4">{profileUser?.email}</p>}

                                    <div className="flex gap-8 text-sl-title">
                                        <div className="flex flex-col">
                                            <span className="text-xl md:text-2xl font-bold">{zines.length}</span>
                                            <span className="text-xs md:text-sm text-gray-500">Zines Created</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xl md:text-2xl font-bold">{bookmarks.length}</span>
                                            <span className="text-xs md:text-sm text-gray-500">Bookmarks</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sign Out Button - Only show if owner */}
                            {isOwner && (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-6 py-2 border border-sl-orange text-sl-orange rounded-lg hover:bg-sl-orange hover:text-white transition-colors font-medium md:absolute md:top-8 md:right-8 w-full md:w-auto justify-center"
                                >
                                    <LogOut className="text-xl" />
                                    <span>Sign Out</span>
                                </button>
                            )}

                            {error && <div className="absolute bottom-4 right-8 text-red-500 text-sm">{error}</div>}
                        </>
                    )}
                </div>

                <div className="w-full">
                    <h2 className="text-2xl font-bold text-sl-title mb-6 border-b border-gray-200 pb-2">{isOwner ? 'Your Zines' : 'Zines'}</h2>

                    {loading ? (
                        <p className="text-center text-gray-500 py-10">Loading zines...</p>
                    ) : zines.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 mb-4">{isOwner ? "You haven't created any zines yet." : "This user hasn't created any zines yet."}</p>
                            {isOwner && <Link to="/create" className="text-sl-orange font-bold hover:underline">Create your first zine!</Link>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {zines.map((zine) => (
                                <div
                                    key={zine._id}
                                    className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <Link
                                        to={`/zine/${zine._id}/${slugify(zine.title)}`}
                                        className="flex-grow flex flex-col"
                                    >
                                        <div className="aspect-square w-full overflow-hidden bg-gray-200 relative">
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
                                    {isOwner && (
                                        <div className="absolute top-2 right-2 z-20">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="rounded-full bg-white/90 hover:bg-red-100 text-red-500 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm"
                                                        onClick={(e) => { e.stopPropagation(); }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent onClick={(e) => e.stopPropagation()}>
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Zine</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to delete "{zine.title}"? This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button variant="destructive" onClick={() => handleDeleteZine(zine._id)}>Delete</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bookmarks Grid */}
                <div className="w-full mt-12">
                    <h2 className="text-2xl font-bold text-sl-title mb-6 border-b border-gray-200 pb-2">{isOwner ? 'Your Bookmarks' : 'Bookmarks'}</h2>

                    {loading ? (
                        <p className="text-center text-gray-500 py-10">Loading bookmarks...</p>
                    ) : bookmarks.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 mb-4">{isOwner ? "You haven't bookmarked any zines yet." : "This user hasn't bookmarked any zines yet."}</p>
                            {isOwner && <Link to="/browse" className="text-sl-orange font-bold hover:underline">Explore zines to bookmark!</Link>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {bookmarks.map((zine) => (
                                <Link
                                    key={zine._id}
                                    to={`/zine/${zine._id}/${slugify(zine.title)}`}
                                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="aspect-square w-full overflow-hidden bg-gray-200 relative">
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
