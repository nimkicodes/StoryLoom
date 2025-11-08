import './index.css';

const Home = () => {
    return (
        <div className="flex flex-col text-sl-title h-screen">
            {/* Title bar */}
            <div className="bg-white drop-shadow-xs p-2 flex items-center gap-2">
                {/* logo, TEST SMALL SCREENS WHEN DOING THIS */}
                <div className="h-15 w-15 bg-red-300"></div>

                {/* title */}
                <div className="">
                    <span className="font-serif text-5xl font-bold">StoryLoom</span>
                </div>

                {/* navigation */}
                <div className="flex gap-10 justify-end pr-10 w-full font-medium text-xl text-sl-text">
                    {/* TODO: add icons */}
                    <div className="">
                        <a href="./">Home</a>
                    </div>
                    <div className="">
                        <a href="./Browse">Browse</a>
                    </div>
                    <div className="">
                        <a href="./Create">Create</a>
                    </div>
                    <div className="">
                        <a href="./Profile">Profile</a>
                    </div>
                </div>
            </div>

            {/* Home page content */}
            <div className="h-full flex flex-col justify-center justify-items-center bg-sl-bgr">
                <div className="flex justify-center p-30 pb-10">
                    <p className="max-w-200 text-center font-serif text-7xl font-bold">Weave Your Stories Through Lived Experience</p>
                </div>
                <div className="flex justify-center p-10">
                    <p className="text-sl-text max-w-200 text-center text-2xl font-medium">Create, share and discover beautifully crafted digital zines. A sanctuary for artists, writers and storytellers.</p>
                </div>
                <div className="flex justify-center gap-10 p-10">
                    <button className="rounded-full bg-sl-orange drop-shadow-sm text-sl-background pl-6 pr-6 pt-3 pb-3">Create Your Zine</button>
                    <button className="rounded-full bg-sl-background drop-shadow-sm text-sl-orange pl-6 pr-6 pt-3 pb-3 border-solid border-2 border-sl-orange">Explore Zines</button>
                </div>
            </div>
        </div>
    )
}

export default Home
