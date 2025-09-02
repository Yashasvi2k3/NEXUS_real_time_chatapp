import React, { useEffect, useState } from 'react';
import Sidebar from './components/SideBar';
import MessageContainer from './components/messagesContainer';

const Home = () => {

  const [selectedUser , setSelectedUser] = useState(null);
  const [isSidebarVisible , setIsSidebarVisible]= useState(true);

  const handelUserSelect=(user)=>{
    setSelectedUser(user);
    setIsSidebarVisible(false);
  }
  const handelShowSidebar=()=>{
    setIsSidebarVisible(true);
    setSelectedUser(null);
  }
  return (

    <div className='flex justify-between min-w-full
     md:min-w-[550px] md:max-w-[65%]
      px-2 h-[95%] md:h-full  
      rounded-xl shadow-lg
       bg-white bg-opacity-20 backdrop-blur-sm'
        >
      <div className={`w-full py-2 md:flex ${isSidebarVisible ? '' : 'hidden'}`}>
      <Sidebar onSelectUser={handelUserSelect}/>
      </div>
      <div className={`divider divider-horizontal px-3 md:flex
         ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div>
      <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'}`}>
      <MessageContainer onBackUser={handelShowSidebar}/>
      </div>
    </div>
  );
};

export default Home;