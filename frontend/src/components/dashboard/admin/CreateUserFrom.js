import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
  Chip,
  Autocomplete
} from '@material-ui/core';
import { ROLES } from '../../../constants';
import { authService } from '../../../service/authentication/AuthService';
import toast from 'react-hot-toast';

const CreateUserForm = (props) => (
  <Formik
    initialValues={{
      email: '',
      name: '',
      usn: '',
      password: '',
      submit: null,
      roles: [],
      confirmPassword: ''
    }}
    validationSchema={Yup
      .object()
      .shape({
        email: Yup
          .string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        name: Yup
          .string()
          .max(255)
          .required('Name is required'),
        usn: Yup
          .string()
          .max(20),
        password: Yup
          .string()
          .min(7)
          .max(255)
          .required('Password is required'),
        confirmPassword: Yup
          .string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required'),
        roles: Yup
          .array()
          .min(1, 'Role is requires')
      })}
    onSubmit={async (values, { setSubmitting }) => {
      try {
        const { data } = await authService.addUser(values);
        if (data && data.success) {
          toast.success('Created User!');
        }
        setSubmitting(false);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        setSubmitting(false);
      }
    }}
  >
    {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
      <form
        noValidate
        onSubmit={handleSubmit}
        {...props}
      >
        <TextField
          error={Boolean(touched.name && errors.name)}
          fullWidth
          helperText={touched.name && errors.name}
          label="Name"
          margin="normal"
          name="name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.name}
          variant="outlined"
        />
        <TextField
          error={Boolean(touched.email && errors.email)}
          fullWidth
          helperText={touched.email && errors.email}
          label="Email Address"
          margin="normal"
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          type="email"
          value={values.email}
          variant="outlined"
        />
        <TextField
          error={Boolean(touched.usn && errors.usn)}
          fullWidth
          helperText={touched.usn && errors.usn}
          label="Usn"
          margin="normal"
          name="usn"
          onBlur={handleBlur}
          onChange={handleChange}
          type="text"
          value={values.usn}
          variant="outlined"
        />
        <TextField
          error={Boolean(touched.password && errors.password)}
          fullWidth
          helperText={touched.password && errors.password}
          label="Password"
          margin="normal"
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          type="password"
          value={values.password}
          variant="outlined"
        />
        <TextField
          error={Boolean(touched.confirmPassword && errors.confirmPassword)}
          fullWidth
          helperText={touched.confirmPassword && errors.confirmPassword}
          label="Confirm Password"
          margin="normal"
          name="confirmPassword"
          onBlur={handleBlur}
          onChange={handleChange}
          type="password"
          value={values.confirmPassword}
          variant="outlined"
        />
        <Autocomplete
          multiple
          id="tags-standard"
          options={ROLES.map((role) => role.value)}
          name="tags"
          value={values.roles}
          onChange={(e, value) => setFieldValue('roles', value)}
          renderTags={(value, getTagProps) => value.map((option, index) => (
            <Chip
              label={option}
              color="primary"
              {...getTagProps({ index })}
            />
          ))}
          renderInput={(params) => (
            <TextField
              {...params}
              error={Boolean(touched.roles && errors.roles)}
              fullWidth
              helperText={touched.roles && errors.roles}
              rows={2}
              label="Roles"
              placeholder="Enter Role"
              variant="outlined"
              sx={{
                mb: 3
              }}
            />
          )}
        />
        {Boolean(touched.policy && errors.policy) && (
          <FormHelperText error>
            {errors.policy}
          </FormHelperText>
        )}
        {errors.submit && (
          <Box sx={{ mt: 3 }}>
            <FormHelperText error>
              {errors.submit}
            </FormHelperText>
          </Box>
        )}
        <Typography
          color="textSecondary"
          variant="body2"
        >
          <strong>Note:</strong>
          {' '}
          This account will be verified and enabled soon
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            color="primary"
            disabled={isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Register
          </Button>
        </Box>
      </form>
    )}
  </Formik>
);

export default CreateUserForm;
