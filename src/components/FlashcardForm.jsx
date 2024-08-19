import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Editor } from '@monaco-editor/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axiosConfig from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { hideLoaderToast, showLoaderToast } from '../LoaderToast';

const FlashcardForm = ({ setnav, setForm }) => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [code, setIsCode] = useState(false);
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState(false);
    const [language, setLanguage] = useState('javascript');
    const [savedToken, setsavedToken] = useState('');
    const [availableCategories, setAvailableCategories] = useState([]);
    const [disableAddCard, setDisableAddCard] = useState(false);
    const ref = useRef();

    const fetchUserCategory = async () => {
        const loaderid = showLoaderToast()
        const savedToken = localStorage.getItem('token');
        checkIsAdmin();
        const response = await axiosConfig.post('/nivak/flashcard/getusercategory/', null, {
            params: {
                token: savedToken
            }
        });
        setAvailableCategories(response.data.data);
        hideLoaderToast(loaderid)
    };

    const handleSubmit = async (e) => {
        setDisableAddCard(true);
        e.preventDefault();
        const loaderid = showLoaderToast();
        try {
            const selectedCategory = newCategory ? category : availableCategories.find(cat => cat === category);
            const response = await axiosConfig.post('/nivak/flashcard/addcard/', { question, answer, category: selectedCategory, code, language }, {
                params: { token: savedToken }
            });
            if (response.data.success) {
                setQuestion('');
                setAnswer('');
                setCategory('');
                setIsCode(false);
                setLanguage('javascript');
                hideLoaderToast(loaderid);
                toast.success(response.data.message);
            } else {
                hideLoaderToast(loaderid);
                toast.error(response.data.message);
            }
        } catch (error) {
            hideLoaderToast(loaderid);
            toast.error('An error occurred. Please try again.');
        }
        setDisableAddCard(false);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const checkIsAdmin = async () => {
        const userName = localStorage.getItem('token');
        const password = localStorage.getItem('encryption')
        if(password === null) return;
        try {
            const response = await axiosConfig.post('/nivak/flashcard/auth/isadmin/', null, {
                params: {
                    token: userName,
                    password: password
                }
            });
            
            if(response.data.success){
              setIsAdmin(true)
            }
            
        } catch (error) {
            
        }

    }

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('tokenExpiry');

        if (savedToken && tokenExpiry && new Date().getTime() < tokenExpiry) {
            setsavedToken(savedToken);
            fetchUserCategory();
        } else {
            navigate('/');
            toast.warning('Login to access');
        }
        setnav(true);
        setForm(true);
    }, [navigate, setForm, setnav]);

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 4,
                p: 2,
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                width: '80%',
                maxWidth: '600px',
                margin: '0 auto',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Add New Flashcard
            </Typography>
            <TextField
                label="Question"
                variant="outlined"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                required
                multiline
                minRows={1}
                sx={{ mb: 2, width: '100%' }}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={code}
                        onChange={e => { setIsCode(e.target.checked); setAnswer(''); }}
                    />
                }
                label="Is Code?"
                sx={{ mb: 2 }}
            />
            {code ? (
                <Box
                    sx={{
                        width: '100%',
                        mb: 2,
                        p: 2,
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: '#f4f4f4',
                    }}
                >
                    <FormControl sx={{ mb: 2, width: '100%' }}>
                        <InputLabel id="select-language-label">Select Language</InputLabel>
                        <Select
                            labelId="select-language-label"
                            id="select-language"
                            value={language}
                            onChange={handleLanguageChange}
                            label="Select Language"
                        >
                            <MenuItem value="javascript">JavaScript</MenuItem>
                            <MenuItem value="python">Python</MenuItem>
                            <MenuItem value="java">Java</MenuItem>
                            <MenuItem value="ruby">Ruby</MenuItem>
                            <MenuItem value="html">HTML</MenuItem>
                            <MenuItem value="css">CSS</MenuItem>
                            <MenuItem value="typescript">TypeScript</MenuItem>
                            <MenuItem value="less">Less</MenuItem>
                            <MenuItem value="scss">Scss</MenuItem>
                            <MenuItem value="json">Json</MenuItem>
                            <MenuItem value="xml">XML</MenuItem>
                            <MenuItem value="php">PHP</MenuItem>
                            <MenuItem value="c#">C#</MenuItem>
                            <MenuItem value="c++">C++</MenuItem>
                            <MenuItem value="razor">Razor</MenuItem>
                            <MenuItem value="markdown">Markdown</MenuItem>
                            <MenuItem value="vb">VB</MenuItem>
                            <MenuItem value="coffeescript">CoffeeScript</MenuItem>
                            <MenuItem value="handlebars">Handlebars</MenuItem>
                            <MenuItem value="batch">Batch</MenuItem>
                            <MenuItem value="pub">Pug</MenuItem>
                            <MenuItem value="f#">F#</MenuItem>
                            <MenuItem value="lua">Lua</MenuItem>
                            <MenuItem value="powershell">Powershell</MenuItem>
                            <MenuItem value="sass">SASS</MenuItem>
                            <MenuItem value="r">R</MenuItem>
                            <MenuItem value="objective-c">Objective-C</MenuItem>
                            <MenuItem value="txt">Text</MenuItem>
                        </Select>
                    </FormControl>
                    <Editor
                        height="300px"
                        theme='vs-dark'
                        defaultLanguage=''
                        language={language}
                        value={answer}
                        onChange={(value) => setAnswer(value)}
                    />
                </Box>
            ) : (
                <Box sx={{ marginBottom: 2, width: '100%' }}>
                    <ReactQuill
                        ref={ref}
                        theme="bubble"
                        value={answer}
                        onChange={setAnswer}
                    />
                </Box>
            )}
            <FormControl sx={{ mb: 2, width: '100%' }}>
                <InputLabel id="select-category-label">Category</InputLabel>
                <Select
                    labelId="select-category-label"
                    id="select-category"
                    value={category}
                    onChange={e => {
                        if (e.target.value === 'new') {
                            setNewCategory(true);
                            setCategory('');
                        } else {
                            setNewCategory(false);
                            setCategory(e.target.value);
                        }
                    }}
                    required
                    label="Category"
                >
                    {availableCategories.map((cat, index) => (
                        <MenuItem key={index} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                    <MenuItem value="new">New Category</MenuItem>
                </Select>
            </FormControl>
            {newCategory && (
                <TextField
                    label="New Category"
                    variant="outlined"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                    sx={{ mb: 2, width: '100%' }}
                />
            )}
            { isAdmin && <Button type="submit" variant="contained" color="primary" disabled={disableAddCard}>
                Add Flashcard
            </Button>}
        </Box>
    );
};

export default FlashcardForm;
