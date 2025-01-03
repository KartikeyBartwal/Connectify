import React from 'react'
import { useEffect, useState } from 'react'
import { Popover, PopoverRoot } from '@chakra-ui/react'
import {
    PopoverBody,
    PopoverContent,
    PopoverTitle,
    PopoverTrigger,
  } from "./../ui/popover"
import { useContext } from 'react'
import { Input, Button } from '@chakra-ui/react'
import { Toaster, toaster } from "../ui/toaster"
import getUsers from '../../services/getUsers'
import { div, title } from 'framer-motion/client'
import { ChatContext } from '../../context/ChatProvider'
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "../ui/skeleton"
import { Stack , HStack, Text} from '@chakra-ui/react'
import UserListItem from './UserAvatar/UserListItem'
import accessChats from '../../services/accessChats'
const SearchContact = () => {
  const [contacts, setContacts] = useState([]);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState("");
  const {user, setSelectedChat, chats, setChats} = useContext(ChatContext);
  

  const handleSearch =async ()=>{
    if(!search)
    {
      toaster.create(
        {
          description: "Please enter something in search.",
          type: "warning",
        }
      );
      return;
    }
    try {
      setLoading(true);
      const contactsData = await getUsers(search);
      setContacts(contactsData);
      
      setLoading(false);
    } catch (error) {
      console.log(`Error incurred in fetching users `, error);
    }
  }
  const accessChat = async (userId) => {
    
    try {
      setLoadingChat(true);
      const chat = await accessChats(userId);
      console.log(chat);
      if(!chats.find((c)=>c._id === chat._id)) setChats([chat, ...chats]);
      setSelectedChat(chat);
      setLoadingChat(false);
    } catch (error) {
      toaster.create({
        title: 'Error fetching the chat',
        description: error.message,
        status: "error",
        isClosable: true
      })
    }
    
    
  }
  return (

    <div>
      <Toaster />
        <PopoverContent className="bg-gray-950 rounded-3xl overflow-hidden shadow-2xl w-144 min-w-2xl animate-scale-in relative z-10 border-1 border-gray-800 z-10" >
            <PopoverBody>
                <PopoverTitle className='flex justify-items-center items-center'>
                  <div className="searchTitle pb-3 text-lg text-pink">
                    Search Contact
                  </div>
                   
                </PopoverTitle>
                <div className="searchContactInput flex pb-4" >
                  <Input 
                  placeholder='Search by name or email.'
                  mr={2}
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                  className='p-2 border-1 border-pink hover:border-blue text-white'
                  />
                  <Button
                  onClick = {handleSearch}
                  className='text-md bg-pink'
                  >
                    Go
                  </Button>
                </div>
                {loading ? (
                  <Stack spacing={4}>
                    <HStack>
                      <Text width="8ch">Loading</Text>
                      <Skeleton height="20px" flex="1" />
                    </HStack>
                  </Stack>
                ) : contacts.length > 0 ? (
                  contacts.map((contact, index) => (
                    <>
                    <UserListItem
                     contact={contact}
                      handleFunction={() => accessChat(contact._id)}
                      
                    />
                    {/* <div>{contact.name}</div> */}
                    </>
                    
                  ))
                ) : (
                  <div className="text-md">No contacts found</div>
                )}

                 </PopoverBody>
        </PopoverContent>
        
    </div>
  )
}

export default SearchContact
