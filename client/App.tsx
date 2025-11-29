import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { moloService } from './services/moloService';
import { AppStatus } from './types';
import { PinFlow } from './components/PinFlow';
import { Dashboard } from './components/Dashboard';
import { LogoIcon } from './components/Icons';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.LOADING);
  const [token, setToken] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Check initialization status on mount
    const checkStatus = async () => {
      try {
        const res = await moloService.checkInitStatus();
        if (res.success && res.data) {
          if (res.data.initialized) {
            setStatus(AppStatus.LOGIN);
          } else {
            setStatus(AppStatus.UNINIT_INTRO);
          }
        } else {
            // Fallback
            setStatus(AppStatus.UNINIT_INTRO);
        }
      } catch (e) {
        console.error("Failed to check init status", e);
        setStatus(AppStatus.UNINIT_INTRO);
      }
    };
    checkStatus();
  }, []);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const antdThemeConfig = {
    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: darkMode ? '#ffffff' : '#000000',
      colorInfo: darkMode ? '#ffffff' : '#000000',
      colorTextBase: darkMode ? '#ffffff' : '#000000',
      colorBgBase: darkMode ? '#000000' : '#ffffff',
      wireframe: true,
      fontFamily: "'Inter', sans-serif",
      borderRadius: 8,
    },
    components: {
      Button: {
        colorPrimary: darkMode ? '#ffffff' : '#000000',
        colorTextLightSolid: darkMode ? '#000000' : '#ffffff', // Invert text color on primary buttons
        algorithm: true, 
      },
      Input: {
        activeBorderColor: darkMode ? '#ffffff' : '#000000',
        hoverBorderColor: darkMode ? '#666666' : '#333333',
        colorBgContainer: darkMode ? '#111827' : '#ffffff',
      },
      DatePicker: {
        colorBgContainer: darkMode ? '#111827' : '#ffffff',
      }
    }
  };

  return (
    <ConfigProvider theme={antdThemeConfig}>
      {status === AppStatus.LOADING ? (
        <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
           <LogoIcon className="w-12 h-12 animate-pulse text-gray-300 dark:text-gray-600" />
        </div>
      ) : status === AppStatus.DASHBOARD ? (
        <Dashboard darkMode={darkMode} toggleTheme={toggleTheme} />
      ) : (
        <PinFlow 
          status={status} 
          setStatus={setStatus} 
          onLoginSuccess={handleLoginSuccess}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
      )}
    </ConfigProvider>
  );
}

export default App;