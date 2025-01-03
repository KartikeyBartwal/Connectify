import React, { useEffect, useContext } from "react";
import { ChatContext } from "./../../../context/ChatProvider";
import { faEllipsis, faEllipsisH, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NewGroupChat from './../NewGroupChat';
import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTitle,
    PopoverTrigger,
  } from "./../../ui/popover"
import AddMemberPopUp from "./AddMemberPopUp";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
  } from "./../../ui/menu"
import removeUserFromGroup from "../../../services/GroupChat/removeUserfromGroup";
import { toaster } from "../../ui/toaster";
import deleteChat from "../../../services/deleteChat";

const ChatSettings = ({setShowSettings, showSettings}) => {
    const {setSelectedChat, selectedChat, user, chats, setChats } = useContext(ChatContext);

    useEffect(() => {
        // console.log(user._id );
        console.log("selected chat: ", selectedChat);
        
        
        
    }, [selectedChat, showSettings, chats]); 
    const deleteChat = async()=>{
        try {
            const response = await deleteChat(selectedChat._id);
            const filterChats = chats.filter((chat)=> chat._id !== selectedChat._id);
            setChats(filterChats);
            
        } catch (error) {
            console.log('error occured in deleting chat: ', error.message);
            
        }

    }
    const removeMember = async(userId)=>{
       
        try {
            
            const result = await removeUserFromGroup(selectedChat._id, userId._id);
            setSelectedChat(result.updatedChat);
            if(userId._id == user._id)
            {
                
                deleteChat();
                setSelectedChat("");
            }
            

        } catch (error) {
            console.log(error);
            
        }

    }

    return (
        <div className="relative max-h-screen bg-gray-900 overflow-hidden p-0 m-0">
            <div
                className="z-50 text-white animate-none font-lg absolute top-4 left-4 cursor-pointer"
                onClick={() => setShowSettings(false)}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
    
            <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] via-[#F472B6] to-[#3B82F6] animate-customPulse"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900 to-gray-900/80"></div>
    
            {selectedChat ? (
                <div className="relative" style={{ minHeight: "100vh", overflow: "hidden" }}>
                    <div className="relative h-full w-full overflow-y-auto p-6" style={{ maxHeight: "calc(100vh - 2rem)" }}>
                        {/* Chat Header Section */}
                        <div className="flex items-center space-x-4 mb-6">
                            {/* Chat Image */}
                            <div className="relative">
                                <div
                                    className="rounded-xl"
                                    style={{
                                        width: "5rem",
                                        height: "5rem",
                                        padding: "0.25rem",
                                        background: "linear-gradient(to right, #3B82F6, #F472B6, #3B82F6)",
                                        animation: "wiggle 1.5s infinite",
                                    }}
                                >
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${selectedChat.isGroupChat ? selectedChat.picURL : selectedChat.users[1]._id== user._id?selectedChat.users[0].profilePic: selectedChat.users[1].profilePic}`}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                    {selectedChat.isGroupChat && (
                                        <button
                                            className="absolute bottom-0 right-0 bg-blue w-6 h-6 rounded flex items-center justify-center shadow-lg border-2 border-gray-900 hover:border-blue transition-colors z-30"
                                            style={{ width: "1.5rem", height: "1.5rem" }}
                                        >
                                            <FontAwesomeIcon icon={faPen} className="text-xs" />
                                        </button>
                                    )}
                                </div>
                            </div>
    
                            {/* Chat Name */}
                            <div>
                                <h2
                                    className="text-2xl font-bold bg-gradient-to-r from-gray-100 via-[#F472B6] to-[#F472B6] bg-clip-text text-transparent"
                                    style={{
                                        backgroundSize: "200% 100%",
                                        animation: "background-pan 4s linear infinite",
                                    }}
                                >
                                    {selectedChat.chatName}
                                </h2>
                                {selectedChat.isGroupChat && (
                                    <p className="text-sm text-gray-400">
                                        Created by {selectedChat.groupAdmin.name}
                                    </p>
                                )}
                            </div>
                        </div>
    
                        {/* Info Section */}
                        <div className="space-y-6">
                            {/* Bio Section */}
                            <div className="space-y-4 bg-gray-800/30 p-4 rounded-xl backdrop-blur-sm border-2 border-gray-700/50">
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-semibold text-white">
                                        {selectedChat.isGroupChat ? "Description" : "Bio"}
                                    </div>
                                    { selectedChat.isGroupChat && <button className="text-pink text-sm transition-colors">Edit</button>}
                                </div>
                                <p className="text-gray-400 text-sm">
                                    {selectedChat.isGroupChat ? (
                                        <span>{selectedChat.description}</span>
                                    ) : (
                                        <span>{selectedChat.users[1].bio}</span>
                                    )}
                                </p>
                            </div>
    
                            {/* Group Members Section */}
                            {selectedChat.isGroupChat && (
                                <div className="space-y-4 bg-gray-800/30 p-4 rounded-xl backdrop-blur-sm border-2 border-gray-700/30">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-white">Members</h3>
                                        <PopoverRoot className="w-[100%]">
                                            <PopoverTrigger>
                                                <button
                                                    className="border-1 border-b-blue border-l-pinkNew border-t-pinkNew border-r-blue px-3 py-1 rounded-full text-sm hover:opacity-80 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 right-2 absolute top-3 text-white "
                                                    onClick={() => console.log("Add Member clicked")}
                                                >
                                                    Add Member
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0 m-0">
                                                <PopoverBody>
                                                    <AddMemberPopUp />
                                                </PopoverBody>
                                            </PopoverContent>
                                        </PopoverRoot>
                                    </div>
                                    <div className="space-y-2">
                                        {selectedChat.users.map((member) => (
                                            <div
                                                key={member._id}
                                                className="flex items-center space-x-3 hover:bg-gray-700/50 border-1 border-pink/50 my-2 p-3 rounded-lg"
                                            >
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${member.profilePic}`}
                                                    alt="member"
                                                    className="w-10 h-10 rounded-full transition-opacity duration-300 opacity-100"
                                                    loading="lazy"
                                                />
                                                <div>
                                                    <h4 className="text-lg text-white">{member.name}</h4>
                                                    <p className="text-xs text-pink">
                                                        {member._id === selectedChat.groupAdmin._id && (
                                                            <span>Admin</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="absolute right-10 text-white">
                                                    <MenuRoot>
                                                        <MenuTrigger>
                                                            <FontAwesomeIcon icon={faEllipsis}></FontAwesomeIcon>
                                                        </MenuTrigger>
                                                        <MenuContent>
                                                            <MenuItem>
                                                                <div className="">
                                                                    <button>Message</button>
                                                                </div>
                                                            </MenuItem>
                                                            <MenuItem>
                                                                <div className="">
                                                                    <button>View</button>
                                                                </div>
                                                            </MenuItem>
                                                            {selectedChat.groupAdmin._id == user._id &&
                                                                selectedChat.groupAdmin._id !== member._id && (
                                                                    <MenuItem>
                                                                        <div className="">
                                                                            <button
                                                                                onClick={() => {
                                                                                    removeMember(member);
                                                                                }}
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    </MenuItem>
                                                                )}
                                                        </MenuContent>
                                                    </MenuRoot>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
    
                            {/* Danger Zone */}
                            {selectedChat.isGroupChat && (
                                <div className="space-y-4 bg-gray-800/30 p-4 rounded-xl backdrop-blur-sm">
                                    <div className="text-lg font-semibold text-red">Danger Zone</div>
                                    <div className="flex space-x-3 text-sm">
                                        <button
                                            className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                                            onClick={() => removeMember(user)}
                                        >
                                            Leave Group
                                        </button>
                                        <button className="flex-1 py-3 rounded-xl bg-red/10 text-red hover:bg-red-500/20 transition-colors">
                                            Delete Group
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
    
};

export default ChatSettings;
