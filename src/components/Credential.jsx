import React, { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Typography, Tabs, Tab } from '@mui/material';
import axiosConfig from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Credential = ({setnav, setLoading}) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState(0);

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
    setLoading(true)
    e.preventDefault();
    try {
      const response = await axiosConfig.post('/nivak/flashcard/auth/login/', { userName, password });
      if(response.data.success){
        const token = response.data.message;
        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;

        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiry', expiryTime);
        toast.success("Login Successfull");
        navigate("/flashcards")
      }
      
      else
        toast.error(response.data.message);

      setLoading(false)
    } catch (error) {
      toast.error('Login failed');
      setLoading(false)
    }
  };

  const handleRegister = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const response = await axiosConfig.post('/nivak/flashcard/auth/register/', { userName, password });
      if(response.data.success){
        setUserName("")
        setPassword("")
        setTab(0);
        toast.success(response.data.message);
      }
      else{
        toast.error(response.data.message);
      }

      setLoading(false)
    } catch (error) {
      toast.error('Registration failed');
      setLoading(false)
    }
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
              required
              autoComplete="false"
              sx={{ mb: 2 }}
            />
            <Button fullWidth variant="contained" type="submit">
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
            <Button fullWidth variant="contained" type="submit">
              Register
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Credential;
