import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Collapse, IconButton } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IoCloseSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../api/axiosConfig';

const Flashcard = ({ flashcard, fetchFlashcards, setLoading }) => {
    const navigate = useNavigate();
    const [showAnswer, setShowAnswer] = useState(false);
    const [savedToken, setsavedToken] = useState("")

    const toggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const handleDelete = async (e) => {
        setLoading(true)
        e.preventDefault();
        const response = await axiosConfig.post('/nivak/flashcard/deletecard/', null , {
            params: {
                token : savedToken,
                cardId: flashcard.cardId
            }
        })
        if(response.data.success){
            toast.success(response.data.message)
            fetchFlashcards();
        }
        else
            toast.error(response.data.message) 

        setLoading(false)
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('tokenExpiry');

        if (savedToken && tokenExpiry && new Date().getTime() < tokenExpiry) {
            setsavedToken(savedToken);
        } else {
            navigate('/')
            toast.warning("Login to access")
        }
      }, [])

    return (
        <Box
            className="flashcard"
            sx={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                p: 2,
                mb: 2,
                width: "80%",
                position: 'relative',
            }}
        >
            <IconButton
                aria-label="delete"
                onClick={handleDelete}
                sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    zIndex: 1,
                }}
            >
                <IoCloseSharp/>
            </IconButton>
            <Typography variant="h5" gutterBottom>
                {flashcard.question}
            </Typography>
            <Collapse in={showAnswer}>
                {flashcard.code ? (
                    
                        <SyntaxHighlighter showLineNumbers={true}  language={flashcard.language} style={oneDark} customStyle={{overflow: 'scroll' , minHeight: "200px" }}>
                            {flashcard.answer}
                        </SyntaxHighlighter>
                ) : (
                    <Typography variant="body1">{flashcard.answer}</Typography>
                )}
            </Collapse>
            <Button onClick={toggleAnswer} variant="contained" sx={{ mt: 2 }}>
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </Button>
        </Box>
    );
};

export default Flashcard;
