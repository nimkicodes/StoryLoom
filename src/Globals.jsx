import './index.css';
import logoYarn from '../resource/logo_yarn.png'; // Import the image directly

export const nav = (
    <div className="flex items-center gap-2 p-2 w-screen text-sl-title bg-white drop-shadow-xs">
        {/* logo */}
        <div className="h-15 w-20">
            <img src={logoYarn} alt="StoryLoom Logo" className="h-full w-full object-contain" />
        </div>

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
                <a href="./browse">Browse</a>
            </div>
            <div className="">
                <a href="./create">Create</a>
            </div>
            <div className="">
                <a href="./profile">Profile</a>
            </div>
        </div>
    </div>
)
