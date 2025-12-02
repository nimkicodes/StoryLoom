import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { NavBar } from './Globals';
import usePageTitle from './hooks/usePageTitle';

const Browse = () => {
    usePageTitle('Browse');
    const [zines, setZines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchZines = async () => {
            try {
                const response = await fetch('/api/zines');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setZines(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchZines();
    }, []);

    const slugify = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    return (
        <div className="flex flex-col min-h-screen bg-sl-background font-sans">
            <NavBar />

            <div className="flex-grow w-full max-w-6xl mx-auto px-4 py-8">

                {loading && <p className="text-center text-gray-500 py-10">Loading zines...</p>}
                {error && <p className="text-center mt-10 text-red-500">Error: {error}</p>}

                {!loading && !error && (
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
                {!loading && !error && zines.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500 mb-4">No zines available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Browse;