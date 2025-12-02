import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
                const token = await currentUser.getIdToken();
                const response = await fetch(`/api/bookmarks/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setIsBookmarked(data.bookmarked);
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
            if (response.ok) {
                const data = await response.json();
                setIsBookmarked(data.bookmarked);
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
        }
    };

    const [dimensions, setDimensions] = useState({ width: 550, height: 650 });

    useEffect(() => {
        const handleResize = () => {
            const width = Math.min(window.innerWidth * 0.9, 550);
            const height = Math.min(window.innerHeight * 0.8, 650);
            // Maintain aspect ratio roughly if needed, or just fit to screen
            setDimensions({ width, height });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        <div className="flex flex-col h-screen bg-sl-background overflow-hidden">
            <NavBar />
            <div className="flex-grow w-full md:w-7/8 mx-auto text-center pb-5 relative px-4 md:px-0">
                <h1 className="pt-5 pb-2 font-serif font-bold text-sl-title text-2xl md:text-4xl">{zine.title}</h1>
                <hr className="border-sl-text"></hr>
                <p className="mt-2 md:mt-5 text-sm md:text-base">By {zine.author}</p>

                {/* Sound Toggle Button */}
                <button
                    onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                    className="absolute top-4 right-4 md:top-10 md:right-0 p-2 text-sl-title hover:text-sl-orange transition-colors"
                    title={isSoundEnabled ? "Mute sound" : "Unmute sound"}
                >
                    {isSoundEnabled ? <FaVolumeUp size={20} /> : <FaVolumeMute size={20} />}
                </button>

                {/* Bookmark Button */}
                <button
                    onClick={handleBookmark}
                    className="absolute top-4 left-4 md:top-10 md:left-0 p-2 text-sl-title hover:text-sl-orange transition-colors"
                    title={isBookmarked ? "Remove bookmark" : "Bookmark this zine"}
                >
                    {isBookmarked ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
                </button>

                {/* Tags */}
                {zine.tags && zine.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                        {zine.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex flex-col justify-center justify-items-center items-center mt-5 h-[calc(100vh-200px)]">
                    <HTMLFlipBook
                        className="bg-transparent"
                        flippingTime={500}
                        width={dimensions.width}
                        height={dimensions.height}
                        showCover={true}
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

            <footer className="w-full py-4 bg-white text-center text-sl-text border-t border-gray-200 mt-auto z-10 relative">
                <p>Created by Team StoryLoom</p>
            </footer>
        </div>
    );
};

export default ZineDetail;
