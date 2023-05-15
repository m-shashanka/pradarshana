import React, { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import {makeStyles} from '@material-ui/core';

import useAuth from '../../../hooks/useAuth';
import io from "socket.io-client";
import { apiConfig } from '../../../config';
import TeacherSenderChat from './TeacherSenderChat';
import StudentReceiverChat from './StudentReceiverChat';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(() => ({
    paper: { minWidth: "900px", minHeight: "550px" },
}));

const ProfessorChatModal = ({open, closeChat, testId}) => {
    const { user } = useAuth();
    const classes = useStyles();
    const socket = useRef();

    const [queries, setQueries] = useState([]);
    const [resolution, setResolution] = useState([]);

    const addResolution = (announcement) => {
      if(socket.current)
        socket.current.emit('giveResolution', {resolution: announcement});
    }

    useEffect(() => {
      if(open){
          socket.current = io(apiConfig.baseUrl);
          socket.current.emit('join', {user, testId});
          socket.current.on('initQueries&Resolution', ({queries, resolutions}) => {
            setQueries(queries);
            setResolution(resolutions);
          });
          socket.current.on('newQuery', (query) => {
            setQueries(prev => [...prev, query]);
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
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          classes={{ paper: classes.paper}}
        >
          <DialogTitle style={{textAlign: 'center', fontSize: '24px'}}>{"Query Resolution"}</DialogTitle>
          <DialogContent>
            <DialogContentText style={{textAlign: 'center'}} id="alert-dialog-slide-description">
              This communication channel is between you and your students for query resolution and live test updates.
            </DialogContentText>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    m: 1,
                    height: 480
                }}
            >
                <StudentReceiverChat queries={queries} />
                <TeacherSenderChat resolution={resolution} addResolution={addResolution} />
            </Box>
          </DialogContent>
        </Dialog>
    );
}

export default ProfessorChatModal;