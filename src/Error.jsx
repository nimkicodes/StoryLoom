import './index.css';

// temporary display, redesign this later
const Error = () => {
    return (
        <div className="flex flex-col justify-center h-screen w-screen align-middle text-sl-title text-center">
            <h1 className="font-bold text-8xl font-serif">Page Not Found</h1>
            <a href="./" className="text-6xl underline">Home</a>
        </div>
    )
};

export default Error;
