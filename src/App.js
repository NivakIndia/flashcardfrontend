// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlashcardList from './components/FlashcardList';
import FlashcardForm from './components/FlashcardForm';
import Credential from './components/Credential';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Loader from './Loader';

const App = () => {
    const [nav, setnav] = useState(false)
    const [form, setForm] = useState(false)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handleOnline = () => {
            toast.info("Back online");
        };

        const handleOffline = () => {
            toast.error("You are offline. Please check your network connection.",{
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
            });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [])
    

    return (
        <Router>
            {loading && <Loader/>}
            <ToastContainer position='top-center' theme='colored' autoClose={2000}/>
            { nav && <Navbar form = {form} />}
            <div className="App" style={nav ? { marginTop: "80px" } : {}}>
                <header>
                    <h1>Flashcard App</h1>
                </header>
                <main>

                    <Routes>
                        <Route path="/" element={<Credential setnav = {setnav} setLoading = {setLoading}/>} />
                        <Route path="/flashcards" element={<FlashcardList setnav = {setnav} setForm = {setForm} setLoading = {setLoading}/>} />
                        <Route path='/flashcards/new' element={<FlashcardForm setnav = {setnav} setForm={setForm} setLoading = {setLoading}/>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
