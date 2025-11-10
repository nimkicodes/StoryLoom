import Home from './Home';
import Browse from './Browse';
import Create from './Create';
import Profile from './Profile';
import Error from './Error';
import ZineDetail from './ZineDetail';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import React from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/browse" element={<Browse />} />
            <Route exact path="/create" element={<Create />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route path="/zine/:id/:slug" element={<ZineDetail />} />
            <Route path="*" element={<Error />} />
        </Routes>
    </BrowserRouter>
);
