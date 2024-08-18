import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../api/axiosConfig';
import { hideLoaderToast, showLoaderToast } from '../LoaderToast';
import { toast } from 'react-toastify';
import FlashcardList from './FlashcardList';
import { Box, Grid, Typography, Breadcrumbs, Link } from '@mui/material';
import CategoryFolder from './CategoryFolder';

const FlashcardHome = ({ setnav, setForm }) => {
    const navigate = useNavigate();
    const [userCategory, setUserCategory] = useState([]);
    const [category, setCategory] = useState('');

    const handleCategoryClick = (category) => {
        setCategory(category);
    };

    const handleHomeClick = () => {
        setCategory('');
        fetchUserCategory();
    };


    const fetchUserCategory = async () => {
        const loaderid = showLoaderToast();
        const savedToken = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('tokenExpiry');

        if (savedToken && tokenExpiry && new Date().getTime() < tokenExpiry) {
            const response = await axiosConfig.post('/nivak/flashcard/getusercategory/', null, {
                params: {
                    token: savedToken
                }
            });
            setUserCategory(["All", ...response.data.data]);
        } else {
            navigate('/');
            toast.warning("Login to access");
        }
        hideLoaderToast(loaderid);
    };

    useEffect(() => {
        setnav(true);
        setForm(false);
        fetchUserCategory();

        const handleOnline = () => {
            toast.info("Back online");
            fetchUserCategory();
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
        <div>
            <Box sx={{ px: 2 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link
                        color="inherit"
                        onClick={handleHomeClick}
                        sx={{ cursor: 'pointer' }}
                    >
                        Home
                    </Link>
                    {category && (
                        <Typography color="textPrimary">{category}</Typography>
                    )}
                </Breadcrumbs>
                {category ? (
                    <FlashcardList category={category} />
                ) : (
                    <Grid container spacing={2}>
                        {userCategory.length > 0 ? (
                            userCategory.map((cat, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <CategoryFolder category={cat} onClick={handleCategoryClick} />
                                </Grid>
                            ))
                        ) : (
                            <Typography sx={{ marginTop: 4, width: "100%" }}>No Categories</Typography>
                        )}
                    </Grid>
                )}
            </Box>
        </div>
    );
};

export default FlashcardHome;
