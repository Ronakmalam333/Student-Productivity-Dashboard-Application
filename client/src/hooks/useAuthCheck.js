import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '../api/authApi';
import { loginSuccess, logout } from '../redux/slices/authSlice';

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  
  const { data, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data?.success) {
      dispatch(loginSuccess({
        data: data.data,
        token: token
      }));
    } else if (error || !token) {
      dispatch(logout());
    }
  }, [data, error, token, dispatch]);

  return { isLoading: isLoading && !!token };
};