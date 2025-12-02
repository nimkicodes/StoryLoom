import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { FaVolumeUp, FaVolumeMute, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import HTMLFlipBook from "react-pageflip";
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './index.css';
import { NavBar } from './Globals';
import usePageTitle from './hooks/usePageTitle';

const Page = React.forwardRef((props, ref) => {
    return (
        <div ref={ref}>
            {props.children}
        </div>
    );
});

const ZineDetail = () => {
    const { id } = useParams();
    const [zine, setZine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    usePageTitle(zine?.title);

    useEffect(() => {
        const fetchZine = async () => {
            try {
                const response = await fetch(`/api/zines/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setZine(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const checkBookmark = async () => {
            if (!currentUser) return;
            try {
                const response = await fetch(`/api/users/${currentUser.uid}`);
                if (response.ok) {
                    const userData = await response.json();
                    const bookmarks = userData.bookmarkedZines || [];
                    const isBookmarked = bookmarks.some(b => b.zineId === id);
                    setIsBookmarked(isBookmarked);
                }
            } catch (error) {
                console.error("Error checking bookmark:", error);
            }
        };

        fetchZine();
        checkBookmark();
    }, [id, currentUser]);

    const handleBookmark = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // Optimistic update
        const previousState = isBookmarked;
        setIsBookmarked(!previousState);

        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ zineId: id })
            });

            if (!response.ok) {
                // Revert on server error
                setIsBookmarked(previousState);
                console.error("Failed to toggle bookmark");
            } else {
                // Optional: Sync with server response if needed, but we trust optimistic update for speed
                const data = await response.json();
                if (data.bookmarked !== !previousState) {
                    setIsBookmarked(data.bookmarked);
                }
            }
        } catch (error) {
            // Revert on network error
            setIsBookmarked(previousState);
            console.error("Error toggling bookmark:", error);
        }
    };

    const [dimensions, setDimensions] = useState({ width: 550, height: 650 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const headerRef = React.useRef(null);

    useEffect(() => {
        let timeoutId;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const isMobileView = window.innerWidth < 768;
                setIsMobile(isMobileView);

                let width, height;

                // Calculate available height dynamically
                // Window - NavBar (approx 64px) - Padding/Margins (approx 40px) - Header Content Height
                const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 150; // Fallback 150
                const availableHeight = window.innerHeight - 110 - headerHeight;

                if (isMobileView) {
                    // Mobile: nearly full width, appropriate height
                    width = Math.min(window.innerWidth - 30, 400);
                    height = Math.min(availableHeight, 600);
                } else {
                    // Desktop: standard sizing
                    // Ensure height doesn't exceed available space
                    height = Math.min(availableHeight, 650);
                    // Maintain aspect ratio roughly (e.g., 0.85) or max width
                    width = Math.min(window.innerWidth * 0.45, height * 0.85);
                }

                // Ensure minimum dimensions to avoid breaking
                width = Math.max(width, 200);
                height = Math.max(height, 300);

                setDimensions({ width, height });
            }, 100); // Debounce resize
        };

        // Run resize handler when zine data loads (to measure header) and on window resize
        if (!loading && zine) {
            handleResize();
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [loading, zine]);

    const bookRef = React.useRef();
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    const playFlipSound = useCallback(() => {
        if (!isSoundEnabled) return;
        const audio = new Audio('/page-flip.mp3');
        audio.play().catch(e => console.log("Audio play failed (user interaction required or file missing):", e));
    }, [isSoundEnabled]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (bookRef.current) {
                const book = bookRef.current.pageFlip();
                if (book) {
                    if (e.key === 'ArrowRight') {
                        book.flipNext();
                    } else if (e.key === 'ArrowLeft') {
                        book.flipPrev();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
    if (!zine) return <div className="text-center mt-10">Zine not found</div>;

    return (
        <div className="flex flex-col h-dvh overflow-y-auto md:h-screen md:overflow-hidden bg-sl-background">
            <NavBar />
            <div className="flex-grow w-full md:w-7/8 mx-auto text-center pb-5 relative px-4 md:px-0 flex flex-col">
                {/* Sound Toggle Button */}
                <button
                    onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                    className="absolute top-4 right-4 md:top-10 md:right-0 p-2 text-sl-title hover:text-sl-orange transition-colors z-40"
                    title={isSoundEnabled ? "Mute sound" : "Unmute sound"}
                >
                    {isSoundEnabled ? <FaVolumeUp size={20} /> : <FaVolumeMute size={20} />}
                </button>

                {/* Bookmark Button */}
                <button
                    onClick={handleBookmark}
                    className="absolute top-4 left-4 md:top-10 md:left-0 p-2 text-sl-title hover:text-sl-orange transition-colors z-40"
                    title={isBookmarked ? "Remove bookmark" : "Bookmark this zine"}
                >
                    {isBookmarked ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
                </button>

                <div ref={headerRef}>
                    <div className="pt-16 md:pt-5 pb-2 flex flex-col md:flex-row items-center md:items-baseline justify-center gap-2 md:gap-4">
                        <h1 className="font-serif font-bold text-sl-title text-2xl md:text-4xl">{zine.title}</h1>
                        <span className="text-xs md:text-base text-gray-600">by {zine.author}</span>
                    </div>
                    <hr className="border-sl-text"></hr>

                    {/* Tags */}
                    {/* Tags */}
                    {zine.tags && zine.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mt-3">
                            {zine.tags.map((tag, index) => (
                                <Link
                                    key={index}
                                    to={`/browse?tag=${encodeURIComponent(tag)}`}
                                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs hover:bg-sl-orange hover:text-white transition-colors"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-grow flex flex-col justify-center items-center min-h-0">
                    <HTMLFlipBook
                        key={`${dimensions.width}-${dimensions.height}-${isMobile}`} // Force re-render on resize
                        className="bg-transparent"
                        flippingTime={500}
                        width={dimensions.width}
                        height={dimensions.height}
                        showCover={true}
                        usePortrait={isMobile}
                        ref={bookRef}
                        onFlip={playFlipSound}
                    >
                        {zine.pages.map((url, index) => (
                            <Page key={index} number={index}>
                                <div className="flex justify-center items-center h-full bg-white shadow-lg">
                                    <img src={url} alt={`Page ${index + 1}`} className="max-h-full max-w-full object-contain" />
                                </div>
                            </Page>
                        ))}
                    </HTMLFlipBook>
                </div>
            </div>


        </div>
    );
};

export default ZineDetail;
