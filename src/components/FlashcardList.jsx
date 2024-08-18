
import React, { useEffect, useState } from 'react';
import Flashcard from './Flashcard';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { hideLoaderToast, showLoaderToast } from '../LoaderToast';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../api/axiosConfig';

const FlashcardList = ({category}) => {
    const navigate = useNavigate();
    const [question, setQuestionInput] = useState('');
    const [flashcards, setFlashcards] = useState([]);

    const handleQuestionInput = (e) => {
        setQuestionInput(e.target.value);
    };

    const fetchFlashcards = async () => {
        const loaderid = showLoaderToast();
        const savedToken = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('tokenExpiry');

        if (savedToken && tokenExpiry && new Date().getTime() < tokenExpiry) {
            const response = await axiosConfig.post('/nivak/flashcard/getflashcards/', null, {
                params: {
                    token: savedToken
                }
            });
            setFlashcards(response.data.data);
            hideLoaderToast(loaderid);
        } else {
            navigate('/');
            hideLoaderToast(loaderid);
            toast.warning("Login to access");
        }
    };

    const flashcardsCategory = category
        ? flashcards.filter(flashcard => flashcard.category.toLowerCase().includes(category === "All" ? "" : category.toLowerCase()))
        : flashcards;

    const filteredFlashcards = question
        ? flashcardsCategory.filter(flashcard => flashcard.question.toLowerCase().includes(question.toLowerCase()))
        : flashcardsCategory;


    useEffect(() => {
        fetchFlashcards();

        const handleOnline = () => {
            toast.info("Back online");
            fetchFlashcards();
        };

        const handleOffline = () => {
            toast.error("You are offline. Please check your network connection.", {
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
    }, []);

    return (
        <div className="flashcard-list">
            <Box sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <TextField
                    label="Search by Question"
                    variant="outlined"
                    value={question}
                    onChange={handleQuestionInput}
                    sx={{ minWidth: 200 }}
                    InputProps={{
                        style: {
                            height: '50px',
                            padding: '0 12px',
                        }
                    }}
                    InputLabelProps={{
                        style: {
                            lineHeight: '1.1em',
                        }
                    }}
                />
            </Box>
            <Grid container spacing={2} sx={{ px: 2 }}>
                {filteredFlashcards.length > 0 ? (
                    filteredFlashcards.map((flashcard) => (
                        <Grid item xs={12} sm={6} key={flashcard.cardId}>
                            <Flashcard flashcard={flashcard} fetchFlashcards={fetchFlashcards} />
                        </Grid>
                    ))
                ) : (
                    <Typography sx={{marginTop: 4,width: "100%"}}>No Cards</Typography>
                )}
            </Grid>
        </div>

    );
};

export default FlashcardList;
