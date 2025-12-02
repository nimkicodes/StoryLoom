import Home from './Home';
import Browse from './Browse';
import Create from './Create';
import Profile from './Profile';
import Reader from './Reader';
import Error from './Error';
import ZineDetail from './ZineDetail';
import Login from './Login';
import Signup from './Signup';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';

import PrivateRoute from './PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/browse" element={<Browse />} />
                <Route element={<PrivateRoute />}>
                    <Route exact path="/create" element={<Create />} />
                    <Route exact path="/profile" element={<Profile />} />
                </Route>
                <Route exact path="/reader" element={<Reader />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<Signup />} />
                <Route path="/zine/:id" element={<ZineDetail />} />
                <Route path="/zine/:id/:slug" element={<ZineDetail />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);
