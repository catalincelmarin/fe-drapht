"use client";

import { useState } from 'react';
import { Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';  // Assuming you have an input UI component
import { useDispatch, useSelector } from 'react-redux'; // Assuming you want to log in via Redux
import { loginUser } from '@/app/redux/auth/authSlice';
// import { RootState } from '@/app/redux/store';

const LoginPage: React.FC = () => {
  
  const [email, setEmail] = useState("msadmin");
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useDispatch();
//   #const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    dispatch(loginUser({username: email, password: password}) as any);

};

  

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center">
      <div className="bg-[#1e1e1e] p-8 rounded-lg shadow-lg w-full max-w-md text-gray-100">
        <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">Login to Drapht</h2>
        <form onSubmit={handleLogin}>
        <div className="space-y-4">
          
          <div className="flex items-center bg-[#2a2a2a] rounded-md p-2 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 transition-colors">
            <LogIn className="h-5 w-5 text-gray-400 mr-2" />
            <Input
            type="text"
            name="username"
            id="username"
            defaultValue={email}
            
            style={{ opacity: 0, height: 0, width: 0, position: "absolute" }}
          />
            <Input
              type="text"
              name="pseudo_username"
              autoComplete='false'
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none w-full outline-none text-green-400 placeholder-gray-500"
            />
            
          </div>

          {/* Password Input */}
          <div className="relative flex items-center bg-[#2a2a2a] rounded-md p-2 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 transition-colors">
            <Lock className="h-5 w-5 text-gray-400 mr-2" />
            <Input
                type="password"
                name="password"
                defaultValue={password}
                style={{ opacity: 0, height: 0, width: 0, position: "absolute" }}
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              name="whatever_one"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none w-full outline-none text-green-400 placeholder-gray-500"
            />
            
            {/* Toggle Password Visibility */}
            <button
              type="button"
              className="absolute right-2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Login Button */}
          <Button
            className="w-full bg-green-600 hover:bg-green-500 text-[#121212] py-3 rounded-md font-semibold flex items-center justify-center transition-colors"
            
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Lock className="h-5 w-5 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </>
            )}
          </Button>
        </div>
        </form>
      </div>
      
    </div>
  );
};

export default LoginPage;


