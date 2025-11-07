import Home from './Home';
import List from './List';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import React from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/list" element={<List />} />
            <Route path="*" element={<Home />} />
        </Routes>
    </BrowserRouter>
);
