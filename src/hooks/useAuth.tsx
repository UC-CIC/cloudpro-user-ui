import Amplify from '@aws-amplify/core';
import { Auth } from 'aws-amplify';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AwsConfigAuth } from '../config/auth';

Amplify.configure({ Auth: AwsConfigAuth });

interface UseAuth {
  isLoading: boolean;
  isAuthenticated: boolean;
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
  const [username, setUsername] = useState('');
  const [sub, setSub] = useState('');
  const [session, setSession] = useState();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((result) => {
        console.log('in use effect then');
        setUsername(result.username);
        setSub(result.attributes.sub);
        setIsAuthenticated(true);
        setIsLoading(false);
      })
      .catch(() => {
        console.log('in use effect catch');
        setUsername('');
        setSub('');
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  const getAccessToken = async () => {
    return (await Auth.currentSession()).getAccessToken().getJwtToken();
  };

  const currentUserInfo = async () => {
    return (await Auth.currentUserInfo());
  };

  const getChallenge = async (username: string) => {
    console.log('USER', username);
    try {
      const result = await Auth.signIn(username);
      console.log(result);
      setSession(result);
      setUsername(result.username);
      //setUsername(username);
      //setIsAuthenticated(true);
      return {
        success: true,
        message: '',
      };
    } catch (error) {
      return {
        success: false,
        message: 'LOGIN FAIL',
      };
    }
  };

  const signIn = async (code: string) => {
    console.log('<SIGNIN>');
    console.log(session);
    const user = session;
    try {
      const result = await Auth.sendCustomChallengeAnswer(user, code);
      console.log('RESULT:', result);
      //setUsername(result.username);
      //setSession(result);
      setSub(result.attributes.sub);
      setIsAuthenticated(true);
      return { success: true, message: '' };
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        message: 'OTP FAIL',
      };
    }
  };

  const verify = async (username: string, code: string) => {
    try {
      const result = await Auth.confirmSignUp(username, code);
      console.log('RESULT:', result);
      return { success: true, message: '' };
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        message: 'OTP FAIL',
      };
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

    //console.log("Generated PW: ", password);

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
      return {
        success: false,
        message: 'LOGOUT FAIL',
      };
    }
  };

  return {
    isLoading,
    isAuthenticated,
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
