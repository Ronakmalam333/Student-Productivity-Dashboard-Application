import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { useGetMeQuery } from '../../api/authApi';
import { loginSuccess, logout } from '../../redux/slices/authSlice';

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  const { data, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token || isAuthenticated,
  });

  useEffect(() => {
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
  }, [token, storedUser, isAuthenticated, dispatch]);

  useEffect(() => {
    if (data?.success) {
      dispatch(loginSuccess({ data: data.data, token }));
    } else if (error) {
      dispatch(logout());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [data, error, token, dispatch]);

  if (isChecking || isLoading) {
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

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;