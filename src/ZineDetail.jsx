import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import HTMLFlipBook from "react-pageflip";
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './index.css';
import { NavBar } from './Globals';

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

    useEffect(() => {
        const fetchZine = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/zines/${id}`);
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

        fetchZine();
    }, [id]);

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
            <div className="flex-grow w-7/8 mx-auto text-center pb-5 relative">
                <h1 className="pt-5 pb-2 font-serif font-bold text-sl-title text-4xl">{zine.title}</h1>
                <hr className="border-sl-text"></hr>
                <p className="mt-5">By {zine.author}</p>

                {/* Sound Toggle Button */}
                <button
                    onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                    className="absolute top-10 right-0 p-2 text-sl-title hover:text-sl-orange transition-colors"
                    title={isSoundEnabled ? "Mute sound" : "Unmute sound"}
                >
                    {isSoundEnabled ? <FaVolumeUp size={24} /> : <FaVolumeMute size={24} />}
                </button>

                <div className="flex flex-col justify-center justify-items-center items-center mt-5">
                    <HTMLFlipBook
                        className="bg-transparent"
                        flippingTime={500}
                        width={550}
                        height={650}
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
