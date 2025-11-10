import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { nav } from './Globals';

const Browse = () => {
    const [zines, setZines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchZines = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/zines');
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
        <div className="flex flex-col h-screen bg-sl-background">
            {nav}

            <div className="w-7/8 mx-auto">
                <h1 className="pt-5 pb-2 font-serif font-bold text-sl-title text-4xl">Zine Collection</h1>
                <hr className="border-sl-text"></hr>

                {loading && <p className="text-center mt-10">Loading zines...</p>}
                {error && <p className="text-center mt-10 text-red-500">Error: {error}</p>}

                {!loading && !error && (
                    <div className="flex flex-wrap flex-row gap-10 w-auto my-5 justify-center">
                        {zines.map((zine) => (
                            <Link
                                key={zine._id}
                                to={`/zine/${zine._id}/${slugify(zine.title)}`}
                                className="flex-none w-70 h-80 rounded-[2em] bg-gray-200 overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
                            >
                                <img
                                    src={zine.pages[0]}
                                    alt={`Cover of ${zine.title}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
                                    <h3 className="font-bold">{zine.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Browse;