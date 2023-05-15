import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Card, CardContent, Container, Typography, Button } from '@material-ui/core';
import Logo from '../../components/Logo';
import { authService } from '../../service/authentication/AuthService';
import gtm from '../../lib/gtm';
import toast from 'react-hot-toast';
import Clock from '../../icons/Clock';

const ClearDataSet = () => {

  const [loading, setLoading] = useState(false);
  const [testId, setTestId] = useState("");

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleSubmit = async () => {
    if(testId.length < 24){
        toast.error('Invalid Test ID');
        return;
    }
    setLoading(true);
    try{
        const response = await authService.clearDataset({testId});
        if(response.status == 200)
            toast.success('Dataset Cleared Successfully');
        else
            throw new Error();
    }
    catch(e){
        toast.error('Something went wrong');
    }
    setTestId("");
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>Clear Dataset</title>
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
              mb: 8,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <RouterLink to="/">
              <Logo
                sx={{
                  height: 40,
                  width: 40
                }}
              />
            </RouterLink>
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
                    Clear Dataset
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1
                }}
              >
                <input style={{width: '200px'}} type='text' placeholder='Enter the Test ID' value={testId} onChange={(e)=>setTestId(e.target.value)} />
              </Box>
              <Box sx={{ mt: 5 }}>
                {!loading && <Button
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                >
                    Clear from Database
                </Button>}
                {loading && <Clock fontSize='large' style={{display: 'block', margin: '0 auto'}} />}
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default ClearDataSet;
