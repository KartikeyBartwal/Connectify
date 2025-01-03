import React, { useContext, useEffect } from 'react';
import { ChatContext } from '../../context/ChatProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faMessage, faPhoneVolume, faPodcast } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import SearchContact from './SearchContact';
import { PopoverRoot , PopoverTrigger} from '../ui/popover';

const Sidebar = () => {
  const { user } = useContext(ChatContext);

  useEffect(() => {
    console.log("user: ",user);
    // console.log("url: ", `${import.meta.env.VITE_API_URL}${user?.profilePic}`);
    
  }, []);

  const SidebarItems = [
    { icon: faMessage, content: 'Messages', color: 'blue', to: '/' },
    { icon: faPhoneVolume, content: 'Calls', color: 'purple', to: '/calls' },
    { icon: faPodcast, content: 'Status', color: 'pink', to: '/status' },
  ];

  return (
    <div className="h-screen max-w-[16rem] lg:w-[16rem] flex flex-col border-r border-gray-800/70 bg-gradient-to-b from-gray-950/10 via-gray-800/10 to-purpleDark/5 overflow-y-auto">
      {/* User Header */}
      <div className="p-4 flex flex-col items-center justify-center border-b border-gray-800/50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue via-pink to-blue p-1 shadow-lg shadow-blue/20">
          <img
            src={`${import.meta.env.VITE_API_URL}${user?.profilePic}`}
            alt="Profile"
            className="rounded-full w-full h-full object-cover"
          />
        </div>
        <div className="text-center mt-3">
          <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue via-pinkNew to-pinkNew">
            {user?.name}
          </h3>
          <p className="text-sm text-gray-400">{user?.bio}</p>
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="flex-1 py-4 flex flex-col items-center">
        <ul className="w-full space-y-3">
          {SidebarItems.map((item, index) => (
            <li key={index} className="w-full">
              <Link
                to={item.to}
                className="flex items-center justify-center lg:justify-start lg:space-x-3 w-4/5 mx-auto py-2 px-4 rounded-xl bg-gradient-to-r from-blue/10 via-pinkNew/5 to-purpleLight/10 hover:from-blue/20 hover:via-pinkNew/10 hover:to-purpleLight/20 transition-all group backdrop-blur-sm shadow-lg shadow-blue/10 no-underline"
              >
                <FontAwesomeIcon icon={item.icon} style={{ color: item.color }} />
                <span className="hidden lg:block lg:ml-3">{item.content}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Buttons */}
        <div className="flex flex-col items-center w-full mt-10 space-y-5">
          <PopoverRoot className="w-full" >
            <PopoverTrigger className = "w-full">
              <button className="w-4/5 py-2 px-4 rounded-xl bg-gradient-to-r from-blue via-pinkNew to-purpleDark hover:from-blue hover:via-pink hover:to-purpleLight transition-all shadow-lg shadow-blue/20 text-white ">
               New Chat
              </button>
            </PopoverTrigger>
            <SearchContact/>
          </PopoverRoot>
          
          <button className="w-4/5 py-2 px-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/60 transition-all backdrop-blur-sm flex text-white items-center justify-center">
            <FontAwesomeIcon icon={faGear} />
            <Link className='no-underline' to={'/settings'}>
              <span className="hidden lg:block text-gray-300 ml-2">Settings</span>
            </Link>
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
