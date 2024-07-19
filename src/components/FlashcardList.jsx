
import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import axiosConfig from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Typography } from '@mui/material';

const FlashcardList = ({setnav, setForm, setLoading}) => {
    const navigate = useNavigate();
    const [flashcards, setFlashcards] = useState([]);

    const fetchFlashcards = async () => {
        setLoading(true)
        const savedToken = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('tokenExpiry');

        if (savedToken && tokenExpiry && new Date().getTime() < tokenExpiry) {
            const response = await axiosConfig.post('/nivak/flashcard/getflashcards/',null, { 
                params: {
                    token : savedToken
                }
             })

             setFlashcards(response.data.data);
        } else {
            navigate('/')
            toast.warning("Login to access")
        }

        setLoading(false)
    }

    useEffect(() => {
        setnav(true)
        setForm(false)
        fetchFlashcards();
    }, []);

    return (
        <div className="flashcard-list">
            {flashcards.length > 0 ? (
                flashcards.map((flashcard) => (
                    <Flashcard key={flashcard.cardId} flashcard={flashcard} fetchFlashcards={fetchFlashcards} setLoading={setLoading}/>
                ))
            ) : (
                <Typography>No Cards</Typography>
            )}
        </div>

    );
};

export default FlashcardList;
