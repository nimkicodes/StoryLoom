import './index.css';

const Home = () => {
    return (
        <div className="flex flex-col text-[#57311a] h-screen">
            {/* Title bar */}
            <div className="bg-white drop-shadow-xs p-2 flex items-center gap-2">
                {/* logo, TEST SMALL SCREENS WHEN DOING THIS */}
                <div className="h-15 w-15 bg-red-300"></div>

                {/* title */}
                <div className="">
                    <span className="font-serif text-5xl font-bold">StoryLoom</span>
                </div>

                {/* navigation */}
                <div className="flex gap-10 justify-end pr-10 w-full font-medium text-xl">
                    {/* TODO: add icons */}
                    <div className="">
                        <a>Home</a>
                    </div>
                    <div className="">
                        <a>Browse</a>
                    </div>
                    <div className="">
                        <a>Create</a>
                    </div>
                    <div className="">
                        <a>Profile</a>
                    </div>
                </div>
            </div>

            {/* Home page content */}
            <div className="h-full flex flex-col justify-center justify-items-center bg-[#f9f4eb]">
                <div className="flex justify-center p-30 pb-10">
                    <p className="max-w-200 text-center font-serif text-7xl font-bold">Weave Your Stories Through Lived Experience</p>
                </div>
                <div className="flex justify-center p-10">
                    <p className="text-[#9b876b] max-w-200 text-center text-2xl font-medium">Create, share and discover beautifully crafted digital zines. A sanctuary for artists, writers and storytellers.</p>
                </div>
                <div className="flex justify-center gap-10 p-10">
                    <button className="rounded-full bg-[#d17a4a] drop-shadow-sm text-[#f9f4eb] pl-6 pr-6 pt-3 pb-3">Create Your Zine</button>
                    <button className="rounded-full bg-[#f9f4eb] drop-shadow-sm text-[#d17a4a] pl-6 pr-6 pt-3 pb-3 border-solid border-2 border-[#d17a4a]">Explore Zines</button>
                </div>
            </div>
        </div>
    )
}

export default Home
