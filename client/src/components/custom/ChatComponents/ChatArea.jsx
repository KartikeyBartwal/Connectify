import React, { useEffect, useContext, useState } from 'react';
import { ChatContext } from './../../../context/ChatProvider';
import { Box, Text, Input, IconButton } from '@chakra-ui/react';
import { faGear, faPaperclip, faFile } from '@fortawesome/free-solid-svg-icons'; // File icon added
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControl } from '@mui/material';
import sendMessage from '../../../services/sendMessage';
import fetchMessages from '../../../services/fetchMessages';
import ScrollableChat from '../ScrollableChat';
import io from 'socket.io-client';
const ENDPOINT = import.meta.env.VITE_API_URL;
import { useRef } from 'react';

const ChatArea = ({ refreshContact, setRefreshContact, setShowSettings }) => {
  useEffect(() => {
    if(selectedChat)
    {
      console.log(selectedChat);

      console.log(selectedChat.picURL);

    console.log(`${import.meta.env.VITE_API_URL}${(selectedChat.isGroupChat === true) ? selectedChat.picURL : selectedChat.users[1]._id== user._id?selectedChat.users[0].profilePic: selectedChat.users[1].profilePic}`); 

    }
  },)
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      // Show preview for images
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null); // No preview for non-image files
      }
    }
  };

  useEffect(() => {
    const socket = io(ENDPOINT);
    socketRef.current = socket;
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (selectedChat) {
        try {
          setLoading(true);
          const result = await fetchMessages(selectedChat._id);
          setMessages(result);
          setLoading(false);
          socketRef.current.emit('join room', selectedChat._id);
        } catch (error) {
          console.error("Error fetching messages:", error.message);
          setLoading(false);
        }
      }
    };

    fetchChatMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('message recieved', (newMessageRecieved) => {
        if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
          // Give notification
        } else {
          setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
        }
      });
    }

    return () => {
      socketRef.current?.off('message recieved');
    };
  }, [selectedChat]);

  const sendMessageHandler = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && (newMessage || selectedFile)) {
      try {
        const response = await sendMessage(newMessage, selectedChat._id, selectedFile);
        setNewMessage("");  // Clear text input
        setSelectedFile(null); // Clear selected file
        setMessages((prevMessages) => [...prevMessages, response]);
        socketRef.current.emit("new message", response);
      } catch (error) {
        console.error("Failed to send the message", error.message);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <Box w="100%" m={0} display="flex" flexDirection="column" className='h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950'>
      <div className="relative inset-0 z-0">
      <div className="absolute top-20 right-80 w-72 h-72 bg-blue/20 rounded-full filter blur-3xl"></div>
      <div className="absolute top-80 right-20 w-72 h-72 bg-pinkNew/20 rounded-full filter blur-3xl"></div>
    </div>
      {!selectedChat ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          className="text-white bg-gray-900"
        >
          <Text fontSize="xl" pb={3} fontFamily="Work sans">
            Welcome to Connectify! Click on a user to start chatting...
          </Text>
        </Box>
      ) : (
        <>
          {/* Header Section */}
          <Box
            fontSize={{ base: '28px', md: '30px' }}
            px={4}
            py={3}
            className='bg-gray-900 border-1 border-b-blue border-l-pinkNew border-t-pinkNew border-r-blue'
            color="white"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            boxShadow="lg"
            zIndex={10}
            h="10%" 
          >
            <div className="flex gap-4 items-center text-sm">
              <img
                src={`${import.meta.env.VITE_API_URL}${selectedChat.isGroupChat ? selectedChat.picURL : selectedChat.users[1]._id== user._id?selectedChat.users[0].profilePic: selectedChat.users[1].profilePic}`}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <Text>{selectedChat?.isGroupChat ? selectedChat.chatName : selectedChat.users[0]._id !== user._id ? selectedChat.users[0].name : selectedChat.users[1].name}</Text>
            </div>
            <FontAwesomeIcon
              icon={faGear}
              onClick={() => setShowSettings(true)}
              className="cursor-pointer text-white text-lg"
            />
          </Box>

          {/* Chat Body */}
          <Box flex="1" h="50%" className='relative'>
            <div className="messages" style={{ maxHeight: 'calc(100vh - 180px)' }}>
              {loading ? (
                <>Loading Chat! Calm your horses...</>
              ) : (
                <ScrollableChat messages={messages} />
              )}
            </div>
          </Box>
          <Box h="15%" w={'100%'} className="p-2 pl-10 flex flex-col" style={{ position: 'relative', bottom: 0, left: 0, right: 0 }}>
            {/* File Preview Section */}
            {selectedFile && (
              <Box
                h="120px"
                w="100%"
                bg="white"
                p={2}
                mb={2}
                borderRadius="8px"
                boxShadow="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text isTruncated>{selectedFile.name}</Text>
              </Box>
            )}
            </Box>
          {/* Input Section */}
          <Box h="5%" w={'100%'} className="p-2 pl-10  ">
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" className=''>
                
               
                <Input
                  
                  placeholder="Type a message..."
                  onChange={typingHandler}
                  onKeyDown={sendMessageHandler}
                  value={newMessage}
                  className="w-full absolute bottom-3 bg-gray-800 border-1 border-b-blue border-r-blue border-t-pinkNew border-l-pinkNew text-white"
                  
                />
                  <FontAwesomeIcon
                  icon={faPaperclip}
                  onClick={() => document.getElementById('fileInput').click()} // Handle file input click
                  
                  aria-label="Attach file"
                  mr={2}
                  className='z-10 text-white'/>

                
                
              </Box>
            </FormControl>

            <Input
              type="file"
              id="fileInput"
              onChange={handleFileChange} // Handle file input change
              className="hidden"
              size="sm"
            />

            
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatArea;
