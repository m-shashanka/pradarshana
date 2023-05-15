import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  FormHelperText,
  TextField,
  Typography,
  Link,
  FormControl,
  Select,
  InputLabel,
  MenuItem
} from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import useMounted from '../../../hooks/useMounted';
import { ROLES } from '../../../constants';

const RegisterJWT = (props) => {
  const mounted = useMounted();
  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        email: '',
        name: '',
        usn: '',
        password: '',
        policy: false,
        submit: null,
        role: '',
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
            .max(20)
            .required('USN is required'),
          password: Yup
            .string()
            .min(7)
            .max(255)
            .required('Password is required'),
          confirmPassword: Yup
            .string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
          policy: Yup
            .boolean()
            .oneOf([true], 'This field must be checked'),
          role: Yup
            .string()
            .required('Role is required'),
        })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await register(values.email, values.name, values.password, values.usn, [values.role]);

          if (mounted.current) {
            setStatus({ success: true });
            setSubmitting(false);
            navigate('/authentication/login-unguarded', { state: { showSnackBar: true } });
          }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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
          <FormControl
            fullWidth
            margin="normal"
            error={Boolean(touched.role && errors.role)}
          >
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              name="role"
              labelId="role-select-label"
              value={values.role}
              label="Role"
              onChange={handleChange}
              onBlur={handleBlur}
              variant="outlined"
            >
              {ROLES.map((role) => (<MenuItem value={role.value}>{role.text}</MenuItem>))}
            </Select>
            <FormHelperText>{errors.role}</FormHelperText>
          </FormControl>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              ml: -1,
              mt: 2
            }}
          >
            <Checkbox
              checked={values.policy}
              color="primary"
              name="policy"
              onChange={handleChange}
            />
            <Typography
              color="textSecondary"
              variant="body2"
            >
              I have read the
              {' '}
              <Link
                color="primary"
                component="a"
                href="#"
              >
                Terms and Conditions
              </Link>
            </Typography>
          </Box>
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
            Your account will be verified and enabled soon
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
};

export default RegisterJWT;
