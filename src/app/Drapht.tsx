"use client";


import App from '@/app/App';
import LoginPage from '@/app/components/LoginPage'; // Assuming you have the login page created

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { useEffect } from 'react';
import { loadTokenFromStorage } from './redux/auth/authSlice';

const Drapht: React.FC = () => {
  // Select authentication state from Redux
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(loadTokenFromStorage());
  },[dispatch])
  return (
      isAuthenticated ? <App /> : <LoginPage />  
  );
};

export default Drapht;
