import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography
} from '@material-ui/core';
import CoursesModal from '../../components/dashboard/overview/CoursesModal';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import useAuth from '../../hooks/useAuth';
import {useTheme} from '@material-ui/core';

// import Fab from '@mui/material/Fab';
// import AcademicCap from '../../icons/AcademicCap';
// import StudentChatModal from './StudentChatModal';

// import io from "socket.io-client";
// import { apiConfig } from '../../config';

const Overview = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const dark = useTheme().palette.mode === 'dark';
  // const [open, setOpen] = useState(false);

  // const socket = useRef();
  // const [newMessage, setNewMessage] = useState(false);

  // useEffect(() => {
  //   socket.current = io(apiConfig.baseUrl);
  //   socket.current.on('newResolution', ({resolution}) => {
  //     setNewMessage(true);
  // });
  //   return () => {
  //     socket.current && socket.current.disconnect();
  //   }
  // },[]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  // const openChat = () => {
  //   setOpen(true);
  //   setNewMessage(false);
  // }

  // const closeChat = () => {
  //   setOpen(false);
  // }

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 2.5
        }}
      >
        {/* <Fab 
        sx={{color: newMessage ? 'red': 'white', backgroundColor: newMessage ? 'white': 'primary.main'}} 
        color='primary' size='medium' onClick={openChat}>
          <AcademicCap fontSize='large' />
        </Fab>
        <StudentChatModal open={open} closeChat={closeChat} /> */}
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              alignItems="center"
              container
              justifyContent="space-between"
              spacing={3}
              item
              xs={12}
            >
              <Grid item>
                <Typography
                  color="textSecondary"
                  variant="overline"
                >
                  Overview
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  { `Hi, ${user.name}` }
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Explore your dashboard
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <CoursesModal />
            </Grid>
            <Grid
              container
              mt={2}
              direction='column'
              alignItems='end'
              spacing={2}
            >
              <Grid item width='20%' mr={-3} sx={{
                transition: 'width 0.6s',
                '&:hover': {
                  width: '30%'
                }
              }}>
                <Button 
                  variant='contained'
                  sx={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    width: '100%',
                    '&:hover': {
                      backgroundColor: dark ? 'cyan' : '#191d3d',
                      color: dark ? '#191d3d' : 'cyan'
                    }
                  }}
                  target="_blank" href="http://www.google.com/"
                >LABxRIT</Button>
              </Grid>
              <Grid item width='25%' mr={-3} sx={{
                transition: 'width 0.6s',
                '&:hover': {
                  width: '35%'
                }
              }}>
                <Button 
                  variant='contained'
                  sx={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    width: '100%',
                    '&:hover': {
                      backgroundColor: dark ? 'cyan' : '#191d3d',
                      color: dark ? '#191d3d' : 'cyan'
                    }
                  }}
                  target="_blank" href="http://www.google.com/"
                >DS Algo Visualizer</Button>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Overview;