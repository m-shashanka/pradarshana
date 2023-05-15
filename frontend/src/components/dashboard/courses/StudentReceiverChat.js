import React, {useRef, useEffect, useState} from 'react';
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

const StudentReceiverChat = ({queries}) => {
    const classes = useStyles();
    const divRef = useRef();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        setChats(queries);
        const timer = setTimeout(() => {
            divRef.current && divRef.current.scrollIntoView({ behaviour: "smooth" });
        }, 500);
        return () => clearTimeout(timer);
    }, [queries]);

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
                    Queries
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
                    chats.map((chat, i) => (
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
                                    pt: 1,
                                    pb: 2.5,
                                    width: '95%',
                                    fontStyle: 'oblique',
                                    ':hover': {
                                        bgcolor: '#9452A5'
                                    },
                                    position: 'relative'
                                }}>
                                {chat.query}
                                <span style={{
                                    position:'absolute',
                                    right: '6px',
                                    bottom: '4px',
                                    fontSize: '10px',
                                    fontStyle: 'normal'
                                }}>{chat.usn}</span>
                            </Box>
                        </Typography>
                    ))
                }
                <div ref={divRef}></div>
            </Box>
        </Box>
    );
}

export default StudentReceiverChat;