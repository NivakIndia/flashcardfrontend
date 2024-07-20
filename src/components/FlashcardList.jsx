
import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import axiosConfig from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Grid, TextField, Typography } from '@mui/material';

const FlashcardList = ({setnav, setForm, setLoading}) => {
    const navigate = useNavigate();
    const [flashcards, setFlashcards] = useState([]);
    const [categoryInput, setCategoryInput] = useState('');

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

    const handleCategoryInputChange = (e) => {
        setCategoryInput(e.target.value);
    };

    const filteredFlashcards = categoryInput
        ? flashcards.filter(flashcard => flashcard.category.toLowerCase().includes(categoryInput.toLowerCase()))
        : flashcards;

    useEffect(() => {
        setnav(true)
        setForm(false)
        fetchFlashcards();
        const handleOnline = () => {
            toast.info("Back online");
            fetchFlashcards();
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
    }, []);

    return (
        <div className="flashcard-list">
            <Box sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <TextField
                    label="Search by Category"
                    variant="outlined"
                    value={categoryInput}
                    onChange={handleCategoryInputChange}
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
                            <Flashcard flashcard={flashcard} fetchFlashcards={fetchFlashcards} setLoading={setLoading} />
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
