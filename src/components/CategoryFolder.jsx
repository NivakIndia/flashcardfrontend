import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const CategoryFolder = ({ category, onClick }) => {
    return (
        <Paper
            elevation={3}
            onClick={() => onClick(category)}
            sx={{
                p: 2,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 100,
                textAlign: 'center',
            }}
        >
            <Typography variant="h6">{category}</Typography>
        </Paper>
    );
};

export default CategoryFolder;
