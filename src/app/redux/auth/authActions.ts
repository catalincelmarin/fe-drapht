import { Action } from 'redux';
import {LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT} from "./authActionTypes";

export interface LoginRequestAction extends Action {
  type: typeof LOGIN_REQUEST;
}

export interface LoginSuccessAction extends Action {
  type: typeof LOGIN_SUCCESS;
  payload: string; // Assuming payload is the JWT token
}

export interface LoginFailureAction extends Action {
  type: typeof LOGIN_FAILURE;
  payload: string; // Assuming payload is the error message
}

export interface LogoutAction extends Action {
  type: typeof LOGOUT;
}


export const loginRequest = (): LoginRequestAction => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (token: string): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
  payload: token,
});

export const loginFailure = (error: string): LoginFailureAction => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = (): LogoutAction => ({
  type: LOGOUT,
});
