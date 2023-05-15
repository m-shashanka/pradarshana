import React, { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import {makeStyles} from '@material-ui/core';

import useAuth from '../../hooks/useAuth';
import io from "socket.io-client";
import { apiConfig } from '../../config';
import TeacherReceiverChat from './TeacherReceiverChat';
import StudentSenderChat from './StudentSenderChat';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(() => ({
    paper: { minWidth: "900px", minHeight: "550px" },
}));

const StudentChatModal = ({open, closeChat, testId}) => {
    const { user } = useAuth();
    const classes = useStyles();
    const socket = useRef();

    const [resolutionChat, setResolutionChat] = useState([]);

    const addQuery = (query) => {
        if(socket.current)
            socket.current.emit('askQuery', {query, usn : user.usn});
    }

    useEffect(() => {
        if(open){
            socket.current = io(apiConfig.baseUrl);
            socket.current.emit('join', {user, testId});
            socket.current.on('initResolution', ({resolutions}) => {
                setResolutionChat(resolutions);
            });
            socket.current.on('newResolution', ({resolution}) => {
                setResolutionChat(prev => [...prev, resolution]);
            });
        }
        else
            socket.current && socket.current.disconnect();

        return () => {
            socket.current && socket.current.disconnect();
        }
    },[open]);

    const handleClose = () => {
        //close socket connections
        closeChat();
    }

    return (
        <Dialog
          disablePortal
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          classes={{ paper: classes.paper}}
        >
          <DialogTitle style={{textAlign: 'center', fontSize: '24px'}}>{"Query Resolution"}</DialogTitle>
          <DialogContent>
            <DialogContentText style={{textAlign: 'center'}} id="alert-dialog-slide-description">
            This communication channel is between you and your professor for query resolution and live test updates.
            </DialogContentText>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    m: 1,
                    height: 480
                }}
            >
                <TeacherReceiverChat resolutionChat={resolutionChat} />
                <StudentSenderChat addQuery={addQuery} />
            </Box>
          </DialogContent>
        </Dialog>
    );
}

export default StudentChatModal;