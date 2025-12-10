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
import { SnackbarProvider } from './contexts/SnackbarContext';
import Snackbar from './components/ui/Snackbar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PrivateRoute from './PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <SnackbarProvider>
                <DndProvider backend={HTML5Backend}>
                    <BrowserRouter>
                        <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route exact path="/browse" element={<Browse />} />
                            <Route element={<PrivateRoute />}>
                                <Route exact path="/create" element={<Create />} />
                                <Route exact path="/profile" element={<Profile />} />
                            </Route>
                            <Route exact path="/profile/:userId" element={<Profile />} />
                            <Route exact path="/reader" element={<Reader />} />
                            <Route exact path="/login" element={<Login />} />
                            <Route exact path="/signup" element={<Signup />} />
                            <Route path="/zine/:id" element={<ZineDetail />} />
                            <Route path="/zine/:id/:slug" element={<ZineDetail />} />
                            <Route path="*" element={<Error />} />
                        </Routes>
                        <Snackbar />
                    </BrowserRouter>
                </DndProvider>
            </SnackbarProvider>
        </AuthProvider>
    </React.StrictMode>
);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
