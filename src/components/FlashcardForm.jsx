import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Editor } from '@monaco-editor/react'
import axiosConfig from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FlashcardForm = ({setnav, setForm, setLoading}) => {
    const navigate = useNavigate()

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [code, setIsCode] = useState(false);
    const [language, setLanguage] = useState('javascript'); // Default language
    const [savedToken, setsavedToken] = useState("")

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        const response = await axiosConfig.post('/nivak/flashcard/addcard/', { question, answer, code, language }, {
            params: {
                token : savedToken
            }
        })
        if(response.data.success){
            toast.success(response.data.message)
            setQuestion("")
            setAnswer("")
            setIsCode(false)
            setLanguage("javascript")
        }
        else
            toast.error(response.data.message)

        setLoading(false)
            
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
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
        setnav(true);
        setForm(true);
      }, [])

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
                sx={{ mb: 2, width: '100%' }}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={code}
                        onChange={e => setIsCode(e.target.checked)}
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
                        </Select>
                    </FormControl>
                    <Editor height="300px" theme='vs-dark' defaultLanguage='javascript' language={language} defaultValue='// some comment' value={answer} onChange={(value) => setAnswer(value)}/>
                </Box>
            ) : (
                <TextField
                    label="Answer"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    required
                    sx={{ mb: 2, width: '100%' }}
                />
            )}
            <Button type="submit" variant="contained" color="primary">
                Add Flashcard
            </Button>
        </Box>
    );
};

export default FlashcardForm;
