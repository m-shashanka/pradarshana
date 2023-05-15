import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Card, CardContent, Container, Typography, Button } from '@material-ui/core';
import Logo from '../../components/Logo';
import { authService } from '../../service/authentication/AuthService';
import gtm from '../../lib/gtm';
import toast from 'react-hot-toast';
import Clock from '../../icons/Clock';

const UploadDataSet = () => {

  const ref = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testId, setTestId] = useState("");

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleChange = (e) => {
    const labeledData = {};
    const renamedFiles = [];
    const files = e.target.files;
    for(let i = 0; i < files.length; i++)
    {
        const usn = files[i].webkitRelativePath.split('/')[1];
        if(!labeledData[usn])
          labeledData[usn] = 0;
        labeledData[usn]++;
        renamedFiles.push(new File([files[i]], usn + '$' + labeledData[usn] + '.' + files[i].name.split('.')[1]));
    }
    setData(renamedFiles);
  }

  const handleSubmit = async () => {
    if(!data){
        toast.error('No files uploaded');
        return;
    }
    if(testId.length < 24){
      toast.error('Invalid Test ID');
      return;
    }
    setLoading(true);
    try{
      const formData = new FormData();
      formData.append('testId', testId);
      for(let file of data)
        formData.append('files', file);
      const response = await authService.uploadDataset(formData);
      if(response.status == 200)
        toast.success('Dataset Uploaded Successfully');
      else
        throw new Error();
    }
    catch(e){
        toast.error('Something went wrong');
    }
    setLoading(false);
    if(ref && ref.current)
        ref.current.value = "";
    setTestId("");
    setData(null);
  }

  return (
    <>
      <Helmet>
        <title>Upload Dataset</title>
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
                    Upload Dataset
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1
                }}
              >
                <input style={{width: '200px'}} type='text' placeholder='Enter the Test ID' value={testId} onChange={(e)=>setTestId(e.target.value)} />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                <input ref={ref} onChange={handleChange} type="file" webkitdirectory="" directory=""></input>
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
                    Save In Database
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

export default UploadDataSet;
