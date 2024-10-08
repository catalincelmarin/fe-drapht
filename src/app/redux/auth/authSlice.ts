// authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from "@/app/api/authAPI";
import { AxiosError } from "axios";

interface UserData {
    email: string;
    username: string;
    role: string;
    id: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: UserData | null;
    error: string | null;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    error: null,
    token: null
};

// Login payload interface
interface LoginPayload {
    username: string;
    password: string;
}

// Function to decode JWT token and extract user data
function decodeToken(token: string): UserData | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid token');
        const decodedPayload = JSON.parse(atob(parts[1]));
        return decodedPayload.data as UserData;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

// Async thunk for performing login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await login(username, password);
            console.log(response)
            if (response?.data) {  // Validate that a token is received
                const token = response.data;
                const user = decodeToken(token);

                // Store token in localStorage
                localStorage.setItem('token', token);
                
                return {
                    isAuthenticated: true,
                    user,
                    token,
                    error: null
                };
            } else {
                throw new Error('Login failed: No token in response');
            }
        } catch (err: any) {
            const error: AxiosError = err;
            if (!error.response) {
                throw err;
            }
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            state.token = null;

            // Remove token from localStorage
            localStorage.removeItem('token');
        },
        loadTokenFromStorage(state) {
            const token = localStorage.getItem('token');
            
            if (token) {
                const user = decodeToken(token);
                if (user) {
                    state.isAuthenticated = true;
                    state.user = user;
                    state.token = token;
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isAuthenticated = false;
                state.error = null; // Reset error on new login attempt
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.error = null;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload ? action.payload.error : 'Unknown error';
                state.token = null;
            });
    },
});

// Destructure and export the action creators
export const { logout, loadTokenFromStorage } = authSlice.actions;

// Default export the reducer
export default authSlice.reducer;
