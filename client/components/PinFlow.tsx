import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, message } from 'antd';
import { moloService } from '../services/moloService';
import { AppStatus } from '../types';
import { LogoIcon, MoonIcon, SunIcon } from './Icons';

interface PinFlowProps {
  status: AppStatus;
  setStatus: (status: AppStatus) => void;
  onLoginSuccess: (token: string) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const PinFlow: React.FC<PinFlowProps> = ({ status, setStatus, onLoginSuccess, darkMode, toggleTheme }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Ref to focus input automatically
  const inputRef = useRef<any>(null);

  useEffect(() => {
    // Focus input when entering input states
    if (status === AppStatus.UNINIT_PIN || status === AppStatus.LOGIN) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [status]);

  // UNINIT_INTRO: Click anywhere to proceed
  useEffect(() => {
    if (status === AppStatus.UNINIT_INTRO) {
      const handleClick = () => {
        setStatus(AppStatus.UNINIT_PIN);
      };
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [status, setStatus]);

  const handleInitSubmit = async () => {
    if (pin.length < 4) return;
    setLoading(true);
    const res = await moloService.initialize(pin);
    if (res.success) {
      setStatus(AppStatus.INIT_SUCCESS);
      setTimeout(() => {
        setStatus(AppStatus.DASHBOARD);
      }, 2000); // Wait 2 seconds to show success message
    } else {
      message.error('Initialization failed.');
    }
    setLoading(false);
  };

  const handleLoginSubmit = async () => {
    if (pin.length < 4) return;
    setLoading(true);
    const res = await moloService.login(pin);
    if (res.success && res.data) {
      onLoginSuccess(res.data.token);
      setStatus(AppStatus.DASHBOARD);
    } else {
      message.error('Login failed.');
      setPin(''); // Clear on fail
    }
    setLoading(false);
  };

  // Render Functions
  if (status === AppStatus.UNINIT_INTRO) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center bg-white dark:bg-black cursor-pointer select-none animate-in fade-in duration-700 transition-colors duration-300">
        <div className="text-3xl font-light text-black dark:text-white tracking-tight mb-2 text-center">
          Looks like you haven't initialized, let's finish it!
        </div>
        <div className="absolute bottom-12 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Click anywhere to start
        </div>
        <div className="absolute top-6 right-6 z-10" onClick={(e) => e.stopPropagation()}>
           <Button 
            type="text" 
            shape="circle" 
            icon={darkMode ? <SunIcon className="w-5 h-5 text-white" /> : <MoonIcon className="w-5 h-5" />} 
            onClick={toggleTheme}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          />
        </div>
      </div>
    );
  }

  if (status === AppStatus.UNINIT_PIN) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center bg-white dark:bg-black animate-in zoom-in-95 duration-500 transition-colors duration-300">
        <div className="absolute top-6 right-6 z-10">
           <Button 
            type="text" 
            shape="circle" 
            icon={darkMode ? <SunIcon className="w-5 h-5 text-white" /> : <MoonIcon className="w-5 h-5" />} 
            onClick={toggleTheme}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          />
        </div>
        <div className="w-full max-w-sm flex flex-col items-center px-6">
          <div className="text-xl font-medium text-black dark:text-white mb-8">
            Please initialize your access PIN.
          </div>
          
          <Input.Password
            ref={inputRef}
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onPressEnter={() => pin.length >= 4 && handleInitSubmit()}
            className="custom-pin-input text-center text-lg font-normal border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white rounded-xl w-full h-12 bg-white dark:bg-gray-900 text-black dark:text-white"
            placeholder="Enter your PIN."
          />

          <Button
            type="primary"
            onClick={handleInitSubmit}
            loading={loading}
            disabled={pin.length < 4}
            className={`
              mt-12 w-full h-12 text-sm font-bold uppercase tracking-widest rounded-full transition-all duration-300
              ${pin.length >= 4 ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg translate-y-0 opacity-100' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 translate-y-2 opacity-50 cursor-not-allowed'}
            `}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (status === AppStatus.INIT_SUCCESS) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center bg-white dark:bg-black animate-in fade-in duration-500 transition-colors duration-300">
        <LogoIcon className="w-16 h-16 mb-6 text-black dark:text-white" />
        <div className="text-2xl font-light text-black dark:text-white">
          Initialization complete, welcome to Molo.
        </div>
      </div>
    );
  }

  if (status === AppStatus.LOGIN) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center bg-white dark:bg-black animate-in zoom-in-95 duration-500 transition-colors duration-300">
        <div className="absolute top-6 right-6 z-10">
           <Button 
            type="text" 
            shape="circle" 
            icon={darkMode ? <SunIcon className="w-5 h-5 text-white" /> : <MoonIcon className="w-5 h-5" />} 
            onClick={toggleTheme}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          />
        </div>
        <div className="w-full max-w-sm flex flex-col items-center px-6">
          <div className="text-xl font-medium text-black dark:text-white mb-8">
            Please enter your access PIN.
          </div>
          
          <Input.Password
            ref={inputRef}
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onPressEnter={() => pin.length >= 4 && handleLoginSubmit()}
            className="custom-pin-input text-center text-lg font-normal border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white rounded-xl w-full h-12 bg-white dark:bg-gray-900 text-black dark:text-white"
            placeholder="Enter your PIN."
          />

          <Button
            type="primary"
            onClick={handleLoginSubmit}
            loading={loading}
            disabled={pin.length < 4}
            className={`
              mt-12 w-full h-12 text-sm font-bold uppercase tracking-widest rounded-full transition-all duration-300
              ${pin.length >= 4 ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg translate-y-0 opacity-100' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 translate-y-2 opacity-50 cursor-not-allowed'}
            `}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return null;
};