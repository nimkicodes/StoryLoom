import './index.css';
import { NavBar } from './Globals';
import { Link } from 'react-router-dom';
import usePageTitle from './hooks/usePageTitle';

const Home = () => {
    usePageTitle();
    return (
        <div className="flex flex-col text-sl-title h-screen">
            <NavBar />

            {/* Home page content */}
            <div className="h-full flex flex-col justify-center justify-items-center bg-sl-background px-4">
                <div className="flex justify-center pt-20 pb-10 md:p-30 md:pb-10">
                    <p className="max-w-full md:max-w-200 text-center font-serif text-4xl md:text-7xl font-bold">Weave Your Stories Through Lived Experience</p>
                </div>
                <div className="flex justify-center p-4 md:p-10">
                    <p className="text-sl-text max-w-full md:max-w-200 text-center text-lg md:text-2xl font-medium">Create, share and discover beautifully crafted digital zines. A sanctuary for artists, writers and storytellers.</p>
                </div>
                <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-10 p-4 md:p-10 items-center">
                    <Link to="/create" className="w-full md:w-auto text-center rounded-full bg-sl-orange drop-shadow-sm text-sl-background px-6 py-3">Create Your Zine</Link>
                    <Link to="/browse" className="w-full md:w-auto text-center rounded-full bg-sl-background drop-shadow-sm text-sl-orange px-6 py-3">Explore Zines</Link>
                </div>
            </div>
        </div>
    )
}

export default Home
