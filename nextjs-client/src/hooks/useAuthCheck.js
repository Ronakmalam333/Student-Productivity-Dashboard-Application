'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '../lib/api/authApi';
import { loginSuccess, logout } from '../lib/redux/slices/authSlice';

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
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