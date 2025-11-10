import React from 'react';
import { useParams } from 'react-router-dom';
import './index.css';
import { nav } from './Globals';

const ZineDetail = () => {
    const { id, slug } = useParams();

    return (
        <div className="flex flex-col h-screen bg-sl-background">
            {nav}
            <div className="w-7/8 mx-auto text-center">
                <h1 className="pt-5 pb-2 font-serif font-bold text-sl-title text-4xl">Zine Detail Page</h1>
                <hr className="border-sl-text"></hr>
                <p className="mt-5">Displaying zine with ID: {id}</p>
                <p>Slug: {slug}</p>
                <p className="mt-10">(Full zine content will be displayed here)</p>
            </div>
        </div>
    );
};

export default ZineDetail;
