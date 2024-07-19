import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoMenu } from 'react-icons/io5'
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
const Navbar = ({form}) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        navigate('/');
        toast.success("Logged out successfully");
        handleClose();
    };

    const handleNewCard = () => {
        navigate('/flashcards/new');
        handleClose();
    };

    const handleCards = () => {
        navigate("/flashcards")
        handleClose();
    }


    return (
        <Box sx={{ flexGrow: 1, position: 'fixed', zIndex: 999}}>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Flashcard App
                    </Typography>
                    {isMobile ? (
                        <div>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                            >
                                <IoMenu />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                {form ? 
                                    <MenuItem onClick={handleCards}>Cards</MenuItem>
                                    :
                                    <MenuItem onClick={handleNewCard}>New Card</MenuItem>
                                }
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <div>
                            { form ? 
                                <Button color="inherit" onClick={handleCards}>Cards</Button>
                                :
                                <Button color="inherit" onClick={handleNewCard}>New Card</Button>
                            }
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;
