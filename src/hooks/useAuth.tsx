import Amplify from '@aws-amplify/core';
import { Auth } from 'aws-amplify';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AwsConfigAuth } from '../config/auth';

Amplify.configure({ Auth: AwsConfigAuth });

interface UseAuth {
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmployee: boolean;
  username: string;
  sub: string;
  getChallenge: (username: string) => Promise<Result>;
  signIn: (code: string) => Promise<Result>;
  signUp: (email: string) => Promise<Result>;
  verify: (username: string, code: string) => Promise<Result>;
  getAccessToken: () => Promise<String>;
  currentUserInfo: () => Promise<any>;
  signOut: () => void;
}

interface Result {
  success: boolean;
  message: string;
}

type Props = {
  children?: React.ReactNode;
};

const authContext = createContext({} as UseAuth);

export const ProvideAuth: React.FC<Props> = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

const useProvideAuth = (): UseAuth => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [username, setUsername] = useState('');
  const [sub, setSub] = useState('');
  const [session, setSession] = useState();

  useEffect(() => {
    const getAuthenticatedUser = async () => {
      try {
        const { attributes, username } = await Auth.currentAuthenticatedUser();
        setUsername(username);
        setSub(attributes.sub);
        setIsEmployee(attributes['custom:isEmployee'] === '1');
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setUsername('');
        setSub('');
        setIsEmployee(false);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    getAuthenticatedUser();
  }, []);

  const getAccessToken = async () => {
    return (await Auth.currentSession()).getAccessToken().getJwtToken();
  };

  const currentUserInfo = async () => Auth.currentUserInfo();

  const getChallenge = async (username: string) => {
    try {
      const result = await Auth.signIn(username);
      setSession(result);
      setUsername(result.username);
      //setIsAuthenticated(true);
      return { success: true, message: '' };
    } catch (error) {
      return { success: false, message: 'LOGIN FAIL' };
    }
  };

  const signIn = async (code: string) => {
    console.log('<SIGNIN>');
    console.log(session);
    const user = session;
    try {
      const result = await Auth.sendCustomChallengeAnswer(user, code);
      //setUsername(result.username);
      //setSession(result);
      setSub(result.attributes.sub);
      setIsAuthenticated(true);
      return { success: true, message: '' };
    } catch (error: any) {
      console.error(error);
      return { success: false, message: 'OTP FAIL' };
    }
  };

  const verify = async (username: string, code: string) => {
    try {
      const result = await Auth.confirmSignUp(username, code);
      console.log('RESULT:', result);
      return { success: true, message: '' };
    } catch (error: any) {
      console.error(error);
      return { success: false, message: 'OTP FAIL' };
    }
  };

  const signUp = async (email: string) => {
    //generate a password (secure)
    var generator = require('generate-password-browser');
    var password = generator.generate({
      length: 12,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
    });

    //append a few to make sure we meet pw complexity {uses math random so not secure}
    var upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var lower = 'abcdefghijklmnopqrstuvwxyz';
    var symbol = '~!@#$%^&*()_+`;:{}[]|';
    var anumber = '0123456789';

    var rupper = Math.floor(Math.random() * upper.length);
    var rlower = Math.floor(Math.random() * lower.length);
    var rsymbol = Math.floor(Math.random() * symbol.length);
    var rnumber = Math.floor(Math.random() * anumber.length);

    password += upper.substring(rupper, rupper + 1);
    password += lower.substring(rlower, rlower + 1);
    password += symbol.substring(rsymbol, rsymbol + 1);
    password += anumber.substring(rnumber, rnumber + 1);

    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
      });
      console.log(user);
      return { success: true, message: '' };
    } catch (error) {
      console.log('error signing up:', error);
      return {
        success: false,
        message: 'LOGIN FAIL',
      };
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setSub('');
      setUsername('');
      setIsAuthenticated(false);
      return { success: true, message: '' };
    } catch (error) {
      return { success: false, message: 'LOGOUT FAIL' };
    }
  };

  return {
    isLoading,
    isAuthenticated,
    isEmployee,
    username,
    sub,
    getChallenge,
    signOut,
    signUp,
    signIn,
    getAccessToken,
    verify,
    currentUserInfo,
  };
};
