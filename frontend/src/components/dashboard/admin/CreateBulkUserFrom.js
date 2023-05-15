//import * as Yup from 'yup';
//import { Formik } from 'formik';
import {
  Box,
  Button,
  //FormHelperText,
  //TextField,
  //Typography,
  //Chip,
  //Autocomplete
} from '@material-ui/core';
//import {useRef} from 'react';

//import { ROLES } from '../../../constants';
import { authService } from '../../../service/authentication/AuthService';
import toast from 'react-hot-toast';
import readXlsxFile from 'read-excel-file'

const CreateBulkUserForm = (props) => {

  
	const handleSubmit = async (e) => {
    try{
      e.preventDefault(); 
      const formData = [];
  
      const input = document.getElementById('input');
      await readXlsxFile(input.files[0]).then((rows) => {
        let cnt = 0;
        for(let row of rows ){
          if(cnt == 0){
              cnt++;
              continue;
          } 
          const val = {
               email: row[0],
               name: row[1],
               usn: row[2],
               password: row[3],
               roles: row[4].split(','),
               confirmPassword: row[5]
          };
          formData.push(val);
          cnt++;
        }
      });
      console.log("formdata", formData)
      await authService.bulkAddUser({"users" : formData})
      toast.success('Users Added');
    }
    catch(err){
      toast.error('Something went wrong');
    }
	}


 	return (
 		<form
        noValidate
        onSubmit={handleSubmit}
        {...props}
      >
      <input type="file" id="input" />
      
        <Box sx={{ mt: 2 }}>
          <Button
            color="primary"
            onClick={handleSubmit}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Bulk Register
          </Button>
        </Box>
      </form>
 	)
};

export default CreateBulkUserForm;
