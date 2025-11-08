import './index.css';
import { nav } from './Globals';


// rename to collection?
const Browse = () => {
    return (
        <div className="flex flex-col h-screen bg-sl-background">
            {nav}

            {/* Collection page content */}
            <div className="w-7/8 mx-auto">
                <h1 className="pt-5 pb-2 font-serif font-bold text-sl-title text-4xl">Zine Collection</h1>
                <hr className="border-sl-text"></hr>

                {/* dynamic zines fill left -> right, top -> bottom */}
                <div className="flex flex-wrap flex-row gap-10 w-auto my-5 justify-center">
                    {/* test zines bc idk how to do this properly */}
                    <div className="flex-none w-70 h-80 rounded-[2em] bg-red-100"> </div>
                    <div className="flex-none w-70 h-80 rounded-[2em] bg-red-100"> </div>
                    <div className="flex-none w-70 h-80 rounded-[2em] bg-red-100"> </div>
                    <div className="flex-none w-70 h-80 rounded-[2em] bg-red-100"> </div>
                    <div className="flex-none w-70 h-80 rounded-[2em] bg-red-100"> </div>
                    <div className="flex-none w-70 h-80 rounded-[2em] bg-red-100"> </div>
                </div>
            </div>
        </div>
    )
};

export default Browse;
