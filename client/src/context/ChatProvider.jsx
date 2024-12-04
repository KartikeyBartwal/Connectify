import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getUserInfo from '../services/getUserInfo';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const userInfo = await getUserInfo(token);
        setUser(userInfo);
      } catch (error) {
        console.error('Failed to fetch user info', error);
        navigate('/');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;