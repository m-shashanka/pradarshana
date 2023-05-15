import React, {useState, useEffect, useRef} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    scrollbar: { 
        '&::-webkit-scrollbar': {
            width: '5px'
        },
        '&::-webkit-scrollbar-track': {
            '&-webkit-box-shadow': 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
            '&-webkit-border-radius': '5px',
            borderRadius: '5px'
        }, 
        '&::-webkit-scrollbar-thumb': {
            '&-webkit-border-radius': '5px',
            borderRadius: '5px',
            background: 'grey',
            '&-webkit-box-shadow': 'inset 0 0 6px rgba(0, 0, 0, 0.5)'
        },
        '&::-webkit-scrollbar-thumb:window-inactive': {
            background: 'transparent'
        }
    },
}));

const TeacherReceiverChat = ({resolutionChat}) => {
    const classes = useStyles();
    const divRef = useRef();
    const [chat, setChat] = useState([]);

    useEffect(() => {
        setChat(resolutionChat);
        const timer = setTimeout(() => {
            divRef.current && divRef.current.scrollIntoView({ behaviour: "smooth" });
        }, 500);
        return () => clearTimeout(timer);
    }, [resolutionChat]);

    return (
        <Box
            sx={{
                mr: 0.5,
                borderRadius: 2,
                height: '100%',
                width: '50%'
            }}
        >
            <Typography component="div">
                <Box 
                    sx={{ 
                        textAlign: 'center', 
                        fontWeight: 'medium', 
                        fontSize: 'large',
                        bgcolor: 'secondary.main',
                        color: 'white',
                        pt: 1,
                        pb: 1,
                        borderTopLeftRadius: 7,
                        borderTopRightRadius: 7
                    }}>
                    Professor
                </Box>
            </Typography>
            <Box 
                className={classes.scrollbar}
                sx={{ 
                    bgcolor: '#451E5D',
                    borderBottomLeftRadius: 7,
                    borderBottomRightRadius: 7,
                    height: '93%',
                    pt: 1,
                    overflowY: 'auto'
                }}>
                {
                    chat.map((chat, i) => (
                        <Typography sx={{ wordBreak: "break-word" }} key={i} component="div">
                            <Box 
                                sx={{ 
                                    textAlign: 'center', 
                                    fontWeight: 'medium', 
                                    fontSize: 'medium',
                                    bgcolor: '#72286F',
                                    color: 'white',
                                    borderRadius: 4,
                                    m: '5px auto 12px auto',
                                    p: 1,
                                    width: '95%',
                                    fontStyle: 'oblique',
                                    ':hover': {
                                        bgcolor: '#9452A5'
                                    }
                                }}>
                                {chat}
                            </Box>
                        </Typography>
                    ))
                }
                <div ref={divRef}></div>
            </Box>
        </Box>
    );
}

export default TeacherReceiverChat;