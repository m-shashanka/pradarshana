import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
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

const TeacherSenderChat = ({resolution, addResolution}) => {
    const classes = useStyles();
    const divRef = useRef();
    const [myCurrentMessage, setMyCurrentMessage] = useState("");
    const [chats, setChats] = useState([]);

    const giveResolution = () => {
        if(myCurrentMessage.length == 0)
            return;
        addResolution(myCurrentMessage);
        setChats([...chats, myCurrentMessage]);
        setMyCurrentMessage("");
        setTimeout(() => {
            divRef.current && divRef.current.scrollIntoView({ behaviour: "smooth" });
        }, 500);
    }

    useEffect(()=>{
        setChats(resolution);
        const timer = setTimeout(() => {
            divRef.current && divRef.current.scrollIntoView({ behaviour: "smooth" });
        }, 500);
        return () => clearTimeout(timer);
    }, [resolution]);

    return (
        <Box
            sx={{
                ml: 0.5,
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
                    You
                </Box>
            </Typography>
            <Box 
                sx={{ 
                    bgcolor: '#451E5D',
                    borderBottomLeftRadius: 7,
                    borderBottomRightRadius: 7,
                    height: '93%',
                    pt: 1
                }}>
                    <Box className={classes.scrollbar} sx={{height: '86%', overflowY: 'auto'}} >
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
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '& .MuiTextField-root': { 
                                m: 1, 
                                width: '86%',
                                '& fieldset': {
                                    borderRadius: '12px',
                                    // background: '#DFA8E4',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#9C27B0',
                                },
                                bgcolor: '#DFA8E4',
                                borderRadius: '12px',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#9C27B0'
                            }
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField 
                            size='small' 
                            variant='outlined'
                            placeholder='Write your announcement here' 
                            value={myCurrentMessage}
                            onChange={e => setMyCurrentMessage(e.target.value)}
                            inputProps={{
                                onKeyDown: (e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        giveResolution();
                                    }
                                },
                            }}
                        />
                        <Fab  
                        disabled={myCurrentMessage.length == 0}
                        onClick={giveResolution}
                        sx={{
                            backgroundColor: '#B428E1',
                            '&:hover': {
                                backgroundColor: '#9C27B0'
                            },
                            mb: 0.38
                        }} size='small'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" id="send">
                                <path fill="none" d="M0 0h24v24H0V0z"></path>
                                <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"></path>
                            </svg>
                        </Fab>
                    </Box>
            </Box>
        </Box>
    );
}

export default TeacherSenderChat;