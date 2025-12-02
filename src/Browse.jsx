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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // New state for the actual search trigger
    const [allTags, setAllTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('/api/zines/tags');
                if (response.ok) {
                    const data = await response.json();
                    setAllTags(data);
                }
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchTags();
    }, []);

    useEffect(() => {
        const fetchZines = async () => {
            setLoading(true);
            try {
                let url = '/api/zines';
                if (searchQuery) {
                    url += `?tag=${encodeURIComponent(searchQuery)}`;
                }
                const response = await fetch(url);
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
    }, [searchQuery]); // Depend on searchQuery instead of searchTerm

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            const filtered = allTags.filter(tag => tag.toLowerCase().includes(value.toLowerCase()));
            setFilteredTags(filtered);
            setShowSuggestions(true);
        } else {
            setSearchQuery(''); // Trigger search (reset) when empty
            setShowSuggestions(false);
        }
    };

    const handleTagSelect = (tag) => {
        setSearchTerm(tag);
        setSearchQuery(tag); // Trigger search
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setSearchQuery(searchTerm); // Trigger search on Enter
            setShowSuggestions(false);
        }
    };

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

                {/* Search Bar */}
                <div className="relative max-w-md mx-auto mb-8">
                    <input
                        type="text"
                        placeholder="Search by tag..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => searchTerm && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sl-orange"
                    />
                    {showSuggestions && filteredTags.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                            {filteredTags.map((tag, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleTagSelect(tag)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

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