'use client';

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { useGetMeQuery } from '../../lib/api/authApi';
import { loginSuccess, logout } from '../../lib/redux/slices/authSlice';

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [token, setToken] = useState(null);
  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    setToken(localStorage.getItem('token'));
    setStoredUser(localStorage.getItem('user'));
  }, []);
  
  const { data, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token || isAuthenticated || !mounted,
  });

  useEffect(() => {
    if (!mounted) return;
    
    if (token && storedUser && !isAuthenticated) {
      try {
        const userData = JSON.parse(storedUser);
        dispatch(loginSuccess({ data: userData, token }));
        setIsChecking(false);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
        setIsChecking(false);
      }
    } else if (!token) {
      dispatch(logout());
      setIsChecking(false);
    } else {
      setIsChecking(false);
    }
  }, [token, storedUser, isAuthenticated, dispatch, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    if (data?.success) {
      dispatch(loginSuccess({ data: data.data, token }));
    } else if (error) {
      dispatch(logout());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [data, error, token, dispatch, mounted]);

  useEffect(() => {
    if (mounted && !isChecking && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isChecking, isLoading, router, mounted]);

  if (!mounted || isChecking || isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default PrivateRoute;