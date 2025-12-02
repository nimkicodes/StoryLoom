import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.css';
import { NavBar } from './Globals';

const Create = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [tags, setTags] = useState('');

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleUploadSuccess = () => {
        setTitle('');
        setAuthor('');
        setTags('');
    };

    return (
        <div className="flex flex-col text-sl-title min-h-screen pb-10">
            <NavBar />
            <h1 className="pt-5 pb-2 font-bold text-sl-title text-4xl text-center">Upload A New Zine</h1>

            <div className="w-full md:w-7/8 mx-auto px-4 md:px-0">
                <hr className="border-sl-text"></hr>

                <div className="mt-5 flex flex-col lg:flex-row gap-5 text-sl-text justify-center items-stretch">
                    {/* left box */}
                    <div className="flex flex-col md:flex-row flex-wrap rounded-[1em] w-full lg:w-1/3 p-5 border-solid border-3">
                        <div className="w-full p-2">
                            <span className="inline-block font-bold">Title</span>
                            <input
                                className="rounded-[5px] w-full mt-2 bg-white px-3 py-2 border border-gray-300"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter zine title"
                            />
                        </div>
                        <div className="w-full p-2">
                            <span className="inline-block font-bold">Author</span>
                            <input
                                className="rounded-[5px] w-full mt-2 bg-white px-3 py-2 border border-gray-300"
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Enter author name"
                            />
                        </div>
                        <div className="w-full p-2">
                            <span className="inline-block font-bold">Tags</span>
                            <input
                                className="rounded-[5px] w-full mt-2 bg-white px-3 py-2 border border-gray-300"
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Comma-separated tags"
                            />
                        </div>
                    </div>

                    {/* right box */}
                    <div className="rounded-[1em] w-full lg:w-2/3 min-h-[500px]">
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
