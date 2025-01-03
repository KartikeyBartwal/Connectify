import React from 'react'
import {
  PopoverBody,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "./../ui/popover"
import { Input, Button } from '@chakra-ui/react'
import { useState } from 'react'
import getUsers from './../../services/getUsers'
import {toaster, Toaster} from '../ui/toaster'
import UserListItem from './UserAvatar/UserListItem'
import { faCamera, faXmark, faPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { form } from 'framer-motion/client'
import newGroupChat from '../../services/GroupChat/newGroupChat'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatProvider'


const NewGroupChat = () => {
  const [formData, setFormData] = useState({
    name: "",
    users:[],
    description:"",
    picUrl:""
  });
  const {chats, setChats, setSelectedChat} = useContext(ChatContext);
  const [namesList, setNamesList] = useState([])
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const handleChange = (e) => {
    const { name, value , files} = e.target;
    if (name === "picUrl" && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
     
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
 
  const handleSearch = async (e) => {
    // console.log('function called');
    
    e.preventDefault();
    if (!name) {
      toaster.create({
        title: "No item for search",
        description: "Enter some name for search",
        type: 'error',
      });
      return;
    }
    setLoading(true);
    try {
      const responseNamesList = await getUsers(name);
      setNamesList(responseNamesList);
      console.log(responseNamesList);
      
      setShowSearchResult(true);
    } catch (error) {
      console.log(error);
    } finally {
      setName("");
      setLoading(false);
      

    }
  };
  const removeName = (nameToRemove) => {
    setFormData((prev) => ({
      ...prev,
      users: prev.users.filter((n) => n !== nameToRemove),
    }));
  };
  const addUserToGroup = (user) => {
    setFormData((prev) => ({
      ...prev,
      users: [...prev.users, user],
    }));
    setShowInput(false);
    setShowSearchResult(false);
  };
  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(!formData.name || !formData.users.length >2)
    {
      toaster.create({
        title: "Fill the fields correctly",
        description: "Either name or member list is undefined",
        type: 'error',
      });
      return;

    }
    try {
      
      const response = await newGroupChat(formData);
      console.log(response);
      setChats((chats)=>[...chats, response]);  
      setSelectedChat(response);
      
    } catch (error) {
      console.log(error);
      
    }
    
  }
  
  return (
    <div>
      <PopoverContent className = "bg-gray-950 rounded-3xl overflow-hidden shadow-2xl w-144 min-w-2xl animate-scale-in relative z-10 border-1 border-gray-800   text-gray-200 ">
        <PopoverBody>
        <form onSubmit={handleSubmit} >
          <div className="">
            {/* header */}
            <div className="p-6 border-b border-gray-800/50 relative ">
              <div className="flex items-center justify-between">
                <h2 className='text-2xl font-bold bg-gradient-to-r from-[#F472B6]  via-[#3B82F6] to-indigo-500 bg-clip-text text-transparent animate-background '
                style={{
                  backgroundSize: "200% 100%", 
                }}>
                  New Group Chat
                </h2>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-pink/20  to-blue/10 blur-xl z-[-1]"></div>
            </div>
            
            {/* group-info */}
            <div className="p-6 border-b border-gray-800/20 relative">
                <div className="space-y-6">
                  {/* Image upload here! */}
                  <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-indigo-500 via-pink/50 to-blue p-0.5 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                    <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center backdrop-blur-xl">
                      <input className='' name='picUrl' type='file' onChange={handleChange}>

                      </input>
                      <FontAwesomeIcon icon={faCamera} className=" text-2xl text-gray-400 group-hover:text-pink-400 transition-colors"/>

                    </div>
                  </div>
                  </div>
                  {/* name upload here */}
                    <div className="space-y-2">
                    <label className="text-sm text-gray-400">Group Name</label>
                    <Input value={formData.name} name='name' onChange={handleChange}  type="text" placeholder="Enter group name..." className="w-full bg-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-pink/70 transition-all placeholder-gray-500 border-1 border-gray-800 hover:border-pink/40"/>
                  </div>
                  {/* group description */}
                  <div className="space-y-2">
                      <label className="text-sm text-gray-400">Description (Optional)</label>
                      <textarea placeholder='Enter group description here!' value={formData.description} onChange={handleChange} name="description" id="group-description" className='w-full bg-gray-900/80 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-pink/50 transition-all  placeholder-gray-500 resize-none h-24 border-1 border-gray-800/30 hover:border-pink/30 '></textarea>

                  </div>

                </div>
            </div>
            {/* add members section */}
              <div className="p-4 border-b border-gray-800/50 flex flex-wrap gap-2">
                <div className="flex flex-wrap gap-2">
                {formData.users.length>0?(
                  formData.users.map((name, index)=>(
                    <div key={index} className="bg-gray-900/80 rounded-full px-3 py-1 flex items-center space-x-2 border-1 border-gray-800/30">
                      <img src={name.profilePic} className='w-6 h-6 rounded-full transition-opacity duration-300 opacity-100' loading='lazy' alt="" />
                      <span>{name.name}</span>
                      <FontAwesomeIcon onClick={()=>removeName(name)} icon={faXmark} className="text-gray-400 hover:text-pink-400 transition-colors" />
                    </div>
                  ))
                ):(
                  <div className=""></div>
                )}
                </div>
                <button className='bg-gray-900/80 rounded-full px-3 py-1 flex items-center space-x-2 hover:bg-gray-800/80 transition-all duration-300 border-1 border-gray-800/30 hover:border-pink/30 flex' onClick={(e)=>{
                  e.preventDefault();
                  setShowInput(true);
                  }}>
                  <FontAwesomeIcon  icon={faPlus} className="text-pink text-xs" />
                  <span className="text-sm">Add Members</span>
                </button>
                
                  
              </div>
              <div className="">
                  {showInput?(
                    <div className="flex p-4 border-1  border-gray-800/50">
                      <Input 
                      className='border-1 border-pink text-white'
                      value={name}
                      onChange={(e)=> setName(e.target.value)}
                      >
                      </Input>
                      <Button onClick={(e)=>{ handleSearch(e)}} className='text-md bg-pink mx-2 p-1  h-10'>Go</Button>
                    </div>
                  ):(
                    <div className=""></div>
                  )}
                </div>
            
          </div>
         
          <div className="namesList max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink/20 scollbar-track-gray-900/50 mb-2">
          <div className="relative flex items-center space-x-3"></div>
            {namesList.length > 0 && showSearchResult ?(
              namesList.map((name)=>(
                <div className="">
                    <UserListItem
                      contact={name}
                      handleFunction={() => addUserToGroup(name)}
                    />
                </div>
              ))
            ):loading?(
              <div className="">Searching! hold on a second</div>
            ):(
              <div className="flex justify-center"></div>
            )}
          </div>

          
          <button type='submit' className="w-full bg-gradient-to-r from-[#3B82F6]/70 via-[#F472B6]/70 to-[#3B82F6]/70 text-white py-3 rounded-xl transition-all flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-pink/20" >
          <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>
            <span>Create Group</span>
          </button>
        
          </form>
        </PopoverBody>
      </PopoverContent>
       
    </div>
  )
}

export default NewGroupChat
