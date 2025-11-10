import React, { useState } from 'react';
import ImageUpload from './ImageUpload'; 
import { DndProvider } from 'react-dnd'; 
import { HTML5Backend } from 'react-dnd-html5-backend'; 
import './index.css';
import { nav } from './Globals';

const Create = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [tags, setTags] = useState('');

    const handleUploadSuccess = () => {
        setTitle('');
        setAuthor('');
        setTags('');
    };

    return (
        <div className="flex flex-col h-screen bg-sl-background">
            {nav}
            <h1 className="pt-5 pb-2 font-serif font-bold text-sl-title text-4xl text-center">Upload A New Zine</h1>

            <div className="w-7/8 mx-auto">
                <hr className="border-sl-text"></hr>
                <div className="mt-5 flex gap-5 text-sl-text justify-center">
                    {/* left box */}
                    <div className="flex flex-row flex-wrap rounded-[1em] w-100 h-100 p-5 border-solid border-3">
                        <div className="w-3/4 mx-auto p-5">
                            <span className="inline-block">Title</span>
                            <input
                                className="rounded-[5px] w-full mt-2 bg-white px-3"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter zine title"
                            />
                        </div>
                        <div className="w-3/4 mx-auto p-5">
                            <span className="inline-block">Author</span>
                            <input
                                className="rounded-[5px] w-full mt-2 bg-white px-3"
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Enter author name"
                            />
                        </div>
                        <div className="w-3/4 mx-auto p-5">
                            <span className="inline-block">Tags</span>
                            <input
                                className="rounded-[5px] w-full mt-2 bg-white px-3"
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Comma-separated tags"
                            />
                        </div>
                    </div>

                    {/* right box */}
                    <div className="rounded-[1em] w-200 h-100">
                        <DndProvider backend={HTML5Backend}>
                            <ImageUpload
                                title={title}
                                author={author}
                                tags={tags}
                                onUploadSuccess={handleUploadSuccess}
                            />
                        </DndProvider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;
