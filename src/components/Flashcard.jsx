import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Collapse, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IoCloseSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../api/axiosConfig';
import { Editor } from '@monaco-editor/react';
import { hideLoaderToast, showLoaderToast } from '../LoaderToast';
import ReactQuill from 'react-quill';

const Flashcard = ({ flashcard, fetchFlashcards }) => {
    const navigate = useNavigate();
    const [showAnswer, setShowAnswer] = useState(false);
    const [upgradeOpen, setUpgradeOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [savedToken, setsavedToken] = useState("");
    const [showFullQuestion, setShowFullQuestion] = useState(false);
    
    const [disableUpdate, setDisableUpdate] = useState(false);
    const [disableDelete, setDisableDelete] = useState(false);

    const ref = useRef(null);
    const [question, setQuestion] = useState(flashcard.question);
    const [answer, setAnswer] = useState(flashcard.answer);
    const [category, setCategory] = useState(flashcard.category);
    const [newCategory, setNewCategory] = useState(false);
    const [code, setIsCode] = useState(flashcard.code);
    const [language, setLanguage] = useState(flashcard.language);
    const [availableCategories, setAvailableCategories] = useState([]);

    const fetchUserCategory = async () => {
        const savedToken = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('tokenExpiry');

        if (savedToken && tokenExpiry && new Date().getTime() < tokenExpiry) {
            const response = await axiosConfig.post('/nivak/flashcard/getusercategory/', null, {
                params: {
                    token: savedToken
                }
            });
            setAvailableCategories(response.data.data);
        } else {
            navigate('/');
            toast.warning("Login to access");
        }
    };

    const toggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const handleDeleteClick = (e) => {
        e.preventDefault();
        handleConfirmDeleteOpen();
    };

    const handleDelete = async () => {
        setDisableDelete(true);
        const loaderid = showLoaderToast();
        try {
            const response = await axiosConfig.post('/nivak/flashcard/deletecard/', null, {
                params: {
                    token: savedToken,
                    cardId: flashcard.cardId
                }
            });
            if (response.data.success) {
                fetchFlashcards();
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while deleting.");
        } finally {
            hideLoaderToast(loaderid);
            handleConfirmDeleteClose();
        }
        setDisableDelete(false)
    };

    const handleConfirmDeleteOpen = () => {
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDeleteClose = () => {
        setConfirmDeleteOpen(false);
    };

    const handleUpgradeOpen = () => {
        setUpgradeOpen(true);
    };

    const handleUpgradeClose = () => {
        setUpgradeOpen(false);
        setQuestion(flashcard.question);
        setAnswer(flashcard.answer);
        setCategory(flashcard.category);
        setIsCode(flashcard.code);
        setLanguage(flashcard.language);
    };

    const handleUpgradeSubmit = async () => {
        setDisableUpdate(true)
        const loaderid = showLoaderToast();
        try {
            const response = await axiosConfig.post('/nivak/flashcard/updatecard/', { cardId: flashcard.cardId, question, answer, category, code, language }, {
                params: { token: savedToken }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchFlashcards();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating.");
        } finally {
            hideLoaderToast(loaderid);
            setUpgradeOpen(false);
        }
        setDisableUpdate(false)
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('tokenExpiry');

        if (savedToken && tokenExpiry && new Date().getTime() < tokenExpiry) {
            setsavedToken(savedToken);
            fetchUserCategory();
        } else {
            navigate('/');
            toast.warning("Login to access");
        }
    }, [navigate]);

    const toggleFullQuestion = () => {
        setShowFullQuestion(!showFullQuestion);
    };

    return (
        <Box
            className="flashcard"
            sx={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                p: 2,
                mb: 2,
                width: "auto",
                position: 'relative',
            }}
        >
            <IconButton
                aria-label="delete"
                onClick={handleDeleteClick}
                sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    zIndex: 1,
                }}
            >
                <IoCloseSharp />
            </IconButton>
            <Box sx={{ textAlign: 'left' }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ whiteSpace: 'pre-wrap' }} // Preserve whitespace and line breaks
                >
                    {showFullQuestion ? question : (question.length > 35 ? `${question.substring(0, 35)}...` : question)}
                    {!showFullQuestion && question.length > 35 && (
                        <Button onClick={toggleFullQuestion} color="primary" size="small">
                            View more
                        </Button>
                    )}
                </Typography>
            </Box>
            <Collapse in={showAnswer}>
                {flashcard.code ? (
                    <SyntaxHighlighter showLineNumbers={true} language={flashcard.language} style={oneDark} customStyle={{ overflow: 'scroll', minHeight: "200px" }}>
                        {flashcard.answer}
                    </SyntaxHighlighter>
                ) : (
                    <Box sx={{ marginBottom: 2, width: '100%' }}>
                        <ReactQuill
                            readOnly
                            ref={ref}
                            theme="bubble"
                            value={flashcard.answer}
                        />
                    </Box>
                )}
            </Collapse>
            <Button onClick={toggleAnswer} variant="contained" sx={{ mt: 2 }}>
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </Button>
            <Button onClick={handleUpgradeOpen} variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }}>
                Upgrade
            </Button>

            <Dialog open={upgradeOpen} onClose={handleUpgradeClose}>
                <DialogTitle>Upgrade Flashcard</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Question"
                        variant="outlined"
                        value={question}
                        disabled
                        sx={{ mb: 2, width: '100%' }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={code}
                                onChange={e => {setIsCode(e.target.checked); setAnswer("")}}
                            />
                        }
                        label="Is Code?"
                        sx={{ mb: 2 }}
                    />
                    {code ? (
                        <Box
                            sx={{
                                width: 'auto',
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
                                <Editor height={300} theme='vs-dark' defaultLanguage={language} language={language} value={answer} onChange={(value) => setAnswer(value)} />
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpgradeClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpgradeSubmit} color="primary" disabled={disableUpdate}>
                        Upgrade
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this flashcard?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDeleteClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" disabled={disableDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Flashcard;
