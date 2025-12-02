import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import { NavBar } from './Globals';
import usePageTitle from './hooks/usePageTitle';

const Browse = () => {
    usePageTitle('Browse');
    const [zines, setZines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const observer = React.useRef();
    const suggestionsListRef = React.useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [allTags, setAllTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

    // Initialize state from URL to avoid double fetch
    const params = new URLSearchParams(location.search);
    const initialTag = params.get('tag') || '';

    const [searchTerm, setSearchTerm] = useState(initialTag);
    const [searchQuery, setSearchQuery] = useState(initialTag);

    // Sync state with URL changes (e.g. back button)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tagParam = params.get('tag') || '';
        setSearchTerm(tagParam);
        setSearchQuery(tagParam);
    }, [location.search]);

    // Update filtered tags when searchTerm or allTags changes
    useEffect(() => {
        if (searchTerm && allTags.length > 0) {
            const filtered = allTags.filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredTags(filtered);
        } else {
            setFilteredTags([]);
        }
    }, [searchTerm, allTags]);

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

    // Scroll active suggestion into view
    useEffect(() => {
        if (activeSuggestionIndex >= 0 && suggestionsListRef.current) {
            const list = suggestionsListRef.current;
            const element = list.children[activeSuggestionIndex];
            if (element) {
                const listTop = list.scrollTop;
                const listBottom = listTop + list.clientHeight;
                const elementTop = element.offsetTop;
                const elementBottom = elementTop + element.offsetHeight;

                if (elementBottom > listBottom) {
                    list.scrollTop = elementBottom - list.clientHeight;
                } else if (elementTop < listTop) {
                    list.scrollTop = elementTop;
                }
            }
        }
    }, [activeSuggestionIndex]);

    const lastZineElementRef = React.useCallback(node => {
        if (loading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchZines(true);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, isFetchingMore, hasMore]);

    const fetchZines = async (loadMore = false) => {
        if (loadMore) {
            setIsFetchingMore(true);
        } else {
            setLoading(true);
        }

        try {
            let url = '/api/zines?limit=12';
            if (searchQuery) {
                url += `&tag=${encodeURIComponent(searchQuery)}`;
            }

            if (loadMore && zines.length > 0) {
                const lastZine = zines[zines.length - 1];
                url += `&lastCreatedAt=${lastZine.createdAt}&lastId=${lastZine._id}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            if (data.length < 12) {
                setHasMore(false);
            }

            if (loadMore) {
                setZines(prev => [...prev, ...data]);
            } else {
                setZines(data);
                setHasMore(data.length === 12);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        fetchZines(false);
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setActiveSuggestionIndex(-1); // Reset active index on input change
        if (value) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            navigate('/browse'); // Clear search when empty
        }
    };

    const handleTagSelect = (tag) => {
        setSearchTerm(tag);
        setShowSuggestions(false);
        navigate(`?tag=${encodeURIComponent(tag)}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredTags.length) {
                handleTagSelect(filteredTags[activeSuggestionIndex]);
            } else {
                setShowSuggestions(false);
                if (searchTerm.trim()) {
                    navigate(`?tag=${encodeURIComponent(searchTerm.trim())}`);
                } else {
                    navigate('/browse');
                }
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault(); // Prevent cursor moving
            if (showSuggestions && filteredTags.length > 0) {
                setActiveSuggestionIndex(prev =>
                    prev < filteredTags.length - 1 ? prev + 1 : prev
                );
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (showSuggestions && filteredTags.length > 0) {
                setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
            }
        } else if (e.key === 'Escape') {
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
                        <ul
                            ref={suggestionsListRef}
                            className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
                        >
                            {filteredTags.map((tag, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleTagSelect(tag)}
                                    className={`px-4 py-2 cursor-pointer text-left ${index === activeSuggestionIndex ? 'bg-gray-200' : 'hover:bg-gray-100'
                                        }`}
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
                        {zines.map((zine, index) => {
                            if (zines.length === index + 1) {
                                return (
                                    <div ref={lastZineElementRef} key={zine._id}>
                                        <Link
                                            to={`/zine/${zine._id}/${slugify(zine.title)}`}
                                            className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full"
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
                                    </div>
                                );
                            } else {
                                return (
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
                                );
                            }
                        })}
                    </div>
                )}
                {isFetchingMore && (
                    <p className="text-center text-gray-500 py-4">Loading more...</p>
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