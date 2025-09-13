'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';

import { useUpdateDetailsMutation, useUpdatePasswordMutation } from '../../lib/api/authApi';
import { updateUserSuccess } from '../../lib/redux/slices/authSlice';
import Layout from '../../components/layout/Layout';


const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [updateUserDetails, { isLoading: isUpdatingDetails }] = useUpdateDetailsMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();
  const [detailsError, setDetailsError] = useState(null);
  const [detailsSuccess, setDetailsSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const detailsFormik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const userData = await updateUserDetails(values).unwrap();
        dispatch(updateUserSuccess(userData.data));
        setDetailsSuccess(true);
        setDetailsError(null);
        setTimeout(() => setDetailsSuccess(false), 3000);
      } catch (err) {
        setDetailsError(err.data?.message || 'Failed to update profile. Please try again.');
        setDetailsSuccess(false);
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Required'),
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('Required'),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const { confirmNewPassword, ...passwordData } = values;
        await updatePassword(passwordData).unwrap();
        setPasswordSuccess(true);
        setPasswordError(null);
        passwordFormik.resetForm();
        setTimeout(() => setPasswordSuccess(false), 3000);
      } catch (err) {
        setPasswordError(err.data?.message || 'Failed to update password. Please try again.');
        setPasswordSuccess(false);
      }
    },
  });

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
              <Tab label="Profile Details" />
              <Tab label="Change Password" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Box>
              {detailsError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {detailsError}
                </Alert>
              )}

              {detailsSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Profile updated successfully!
                </Alert>
              )}

              <Box component="form" onSubmit={detailsFormik.handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      autoComplete="name"
                      value={detailsFormik.values.name}
                      onChange={detailsFormik.handleChange}
                      onBlur={detailsFormik.handleBlur}
                      error={detailsFormik.touched.name && Boolean(detailsFormik.errors.name)}
                      helperText={detailsFormik.touched.name && detailsFormik.errors.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={detailsFormik.values.email}
                      onChange={detailsFormik.handleChange}
                      onBlur={detailsFormik.handleBlur}
                      error={detailsFormik.touched.email && Boolean(detailsFormik.errors.email)}
                      helperText={detailsFormik.touched.email && detailsFormik.errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 2 }}
                      disabled={isUpdatingDetails}
                    >
                      {isUpdatingDetails ? <CircularProgress size={24} /> : 'Update Profile'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {passwordError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {passwordError}
                </Alert>
              )}

              {passwordSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Password updated successfully!
                </Alert>
              )}

              <Box component="form" onSubmit={passwordFormik.handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="currentPassword"
                      label="Current Password"
                      type="password"
                      id="currentPassword"
                      value={passwordFormik.values.currentPassword}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      error={
                        passwordFormik.touched.currentPassword &&
                        Boolean(passwordFormik.errors.currentPassword)
                      }
                      helperText={
                        passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="newPassword"
                      label="New Password"
                      type="password"
                      id="newPassword"
                      value={passwordFormik.values.newPassword}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      error={
                        passwordFormik.touched.newPassword &&
                        Boolean(passwordFormik.errors.newPassword)
                      }
                      helperText={
                        passwordFormik.touched.newPassword && passwordFormik.errors.newPassword
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="confirmNewPassword"
                      label="Confirm New Password"
                      type="password"
                      id="confirmNewPassword"
                      value={passwordFormik.values.confirmNewPassword}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      error={
                        passwordFormik.touched.confirmNewPassword &&
                        Boolean(passwordFormik.errors.confirmNewPassword)
                      }
                      helperText={
                        passwordFormik.touched.confirmNewPassword &&
                        passwordFormik.errors.confirmNewPassword
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 2 }}
                      disabled={isUpdatingPassword}
                    >
                      {isUpdatingPassword ? <CircularProgress size={24} /> : 'Update Password'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default Profile;