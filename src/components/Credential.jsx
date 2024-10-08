import React, { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Typography, Tabs, Tab } from '@mui/material';
import axiosConfig from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { hideLoaderToast, showLoaderToast } from '../LoaderToast';

const Credential = ({setnav}) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState(0);
  const [disableLogin, setDisableLogin] = useState(false);
  const [disableReg, setDisableReg] = useState(false);

  const [loadingToastId, setLoadingToastId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setUserName("")
    setPassword("")
    setTab(newValue);
  };

  const handleUserName = (event) => {
    const value = event.target.value;
    const lowerCaseValue = value.toLowerCase().replace(/\s/g, '');

    if (value !== lowerCaseValue) {
      toast.error('Username must be in lowercase and without spaces.');
    }

    setUserName(lowerCaseValue);
  };

  const handleLogin = async (e) => {
    if(password === "") handleLoginWithOutAuth(e);
    else handleLoginWithAuth(e);
  };

  const handleLoginWithAuth = async (e) => {
    setDisableLogin(true);
    const loaderid = showLoaderToast()
    e.preventDefault();
    try {
      const response = await axiosConfig.post('/nivak/flashcard/auth/login/', { userName, password });
      if(response.data.success){
        const token = response.data.message;
        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;

        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiry', expiryTime);
        localStorage.setItem('encryption', response.data.data)
        hideLoaderToast(loaderid)
        toast.success("Login Successfull");
        navigate("/flashcards")
      }
      
      else{
        hideLoaderToast(loaderid)
        toast.error(response.data.message);
      }
    } catch (error) {
      hideLoaderToast(loaderid)
      toast.error('Login failed');
    }
    setDisableLogin(false)
  }
  const handleLoginWithOutAuth = async (e) => {
    setDisableLogin(true);
    const loaderid = showLoaderToast()
    e.preventDefault();
    try {
      const response = await axiosConfig.post('/nivak/flashcard/auth/loginnoauth/', { userName, password });
      if(response.data.success){
        const token = response.data.message;
        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;

        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiry', expiryTime);
        localStorage.setItem('encryption', null)
        hideLoaderToast(loaderid)
        toast.success("Login Successfull");
        navigate("/flashcards")
      }
      
      else{
        hideLoaderToast(loaderid)
        toast.error(response.data.message);
      }
    } catch (error) {
      hideLoaderToast(loaderid)
      toast.error('Login failed');
    }
    setDisableLogin(false)
  }

  const handleRegister = async (e) => {
    setDisableReg(true)
    const loaderid = showLoaderToast()
    e.preventDefault();
    try {
      const response = await axiosConfig.post('/nivak/flashcard/auth/register/', { userName, password });
      if(response.data.success){
        setUserName("")
        setPassword("")
        setTab(0);
        hideLoaderToast(loaderid)
        toast.success(response.data.message);
      }
      else{
        hideLoaderToast(loaderid)
        toast.error(response.data.message);
      }
    } catch (error) {
      hideLoaderToast(loaderid)
      toast.error('Registration failed');
    }
    setDisableReg(false)
  };

  useEffect(() => {
    setnav(false);
  }, [])
  

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Authentication
        </Typography>
        <Typography color="#0099ff" align="center" gutterBottom>*May it take some time initially to restart server wait patiently</Typography>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        {tab === 0 && (
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="User Name"
              type="text"
              value={userName}
              onChange={handleUserName}
              required
              autoComplete="false"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="false"
              sx={{ mb: 2 }}
            />
            <Button fullWidth variant="contained" type="submit" disabled={disableLogin}>
              Login
            </Button>
          </Box>
        )}
        {tab === 1 && (
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="User Name"
              type="text"
              value={userName}
              onChange={handleUserName}
              required
              autoComplete="false"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="false"
              sx={{ mb: 2 }}
            />
            <Button fullWidth variant="contained" type="submit" disabled={disableReg}>
              Register
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Credential;
