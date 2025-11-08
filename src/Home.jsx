import './index.css';
import { nav } from './Globals';

const Home = () => {
    return (
        <div className="flex flex-col text-sl-title h-screen">
            {nav}

            {/* Home page content */}
            <div className="h-full flex flex-col justify-center justify-items-center bg-sl-background">
                <div className="flex justify-center p-30 pb-10">
                    <p className="max-w-200 text-center font-serif text-7xl font-bold">Weave Your Stories Through Lived Experience</p>
                </div>
                <div className="flex justify-center p-10">
                    <p className="text-sl-text max-w-200 text-center text-2xl font-medium">Create, share and discover beautifully crafted digital zines. A sanctuary for artists, writers and storytellers.</p>
                </div>
                <div className="flex justify-center gap-10 p-10">
                    <button className="rounded-full bg-sl-orange drop-shadow-sm text-sl-background px-6 py-3">Create Your Zine</button>
                    <button className="rounded-full bg-sl-background drop-shadow-sm text-sl-orange px-6 py-3">Explore Zines</button>
                </div>
            </div>
        </div>
    )
}

export default Home
