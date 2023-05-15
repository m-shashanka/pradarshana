import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Card, CardContent, Container, Divider, Link, Typography } from '@material-ui/core';
import { LoginJWT } from '../../components/authentication/login';
import Logo from '../../components/Logo';
import useAuth from '../../hooks/useAuth';
import gtm from '../../lib/gtm';
import SnackBarAlert from '../../components/SnackBarAlert';
import {useTheme} from '@material-ui/core';

const platformIcons = {
  Amplify: '/static/icons/amplify.svg',
  Auth0: '/static/icons/auth0.svg',
  Firebase: '/static/icons/firebase.svg',
  JWT: '/static/icons/jwt.svg'
};

const Login = () => {
  const { platform } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const isDarkTheme = useTheme().palette.mode === 'dark';

  useEffect(() => {
    if (state) {
      setOpenSnackBar(!!state.showSnackBar);
      navigate('/authentication/login-unguarded', {});
    }
  }, [state]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Container
          maxWidth="sm"
          sx={{ py: '80px' }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              left: "10px",
              mb: 8
            }}
          >
            <RouterLink to="/">
              <Logo
                dark={isDarkTheme}
                sx={{
                  height: 60,
                  width: 80
                }}
              />
            </RouterLink>
          </Box>

          <Box sx={{
              mb: 4,
              display:"flex",
              justifyContent: "center"
            }}
          >

            <Typography
              color="textPrimary"
              variant="h6"
              sx={{textTransform: "uppercase"}}
            >
              Department Of Computer Science And Enginnering
            </Typography>

          </Box>

          <Box sx={{
              mb: 1,
              display:"flex",
              justifyContent: "center",
              fontWeignt: "bolder"
            }}
          >

            <Typography
              color="textPrimary"
            >
              <i>
              Online Assessment Tool
              </i>
            </Typography>
          </Box>

          
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 4
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <div>
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="h4"
                  >
                    Log in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Log in to access the assessment tool
                  </Typography>
                </div>
                <Box
                  sx={{
                    height: 32,
                    '& > img': {
                      maxHeight: '100%',
                      width: 'auto'
                    }
                  }}
                >
                  <img
                    alt="Auth platform"
                    src={platformIcons[platform]}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3
                }}
              >
                <LoginJWT />
              </Box>
              <Divider sx={{ my: 3 }} />
              <Link
                color="textSecondary"
                component={RouterLink}
                to="/authentication/register"
                variant="body2"
              >
                Create new account
              </Link>
            </CardContent>
          </Card>
        </Container>
        <SnackBarAlert
          open={openSnackBar}
          variant="success"
          horizontal="center"
          message="Registered successfully, you will be notified once your account is enabled"
          vertical="top"
        />
      </Box>
    </>
  );
};

export default Login;
