import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from "react-icons/bi";
import userConversation from '../../Zustans/useConversation';
import { useSocketContext } from '../../context/SocketContext';

const Sidebar = ({ onSelectUser }) => {

    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchuser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSetSelectedUserId] = useState(null);
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const {messages , setMessage, selectedConversation ,  setSelectedConversation} = userConversation();
    const { onlineUser , socket} = useSocketContext();

    // Helper to check whether a specific user is online
    const isUserOnline = (userId) => onlineUser?.includes(userId);

    useEffect(()=>{
        socket?.on("newMessage",(newMessage)=>{
            setNewMessageUsers(newMessage)
        })
        return ()=> socket?.off("newMessage");
    },[socket,messages])

    //show user with u chatted
    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatters = await axios.get(`/api/user/currentchatters`)
                const data = chatters.data;
                if (data.success === false) {
                    setLoading(false)
                    console.log(data.message);
                }
                setLoading(false)
                setChatUser(data)

            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }
        chatUserHandler()
    }, [])
    
    //show user from the search result
    const handelSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (data.success === false) {
                setLoading(false)
                console.log(data.message);
            }
            setLoading(false)
            if (data.length === 0) {
                toast.info("User Not Found")
            } else {
                setSearchuser(data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    //show which user is selected
    const handelUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSetSelectedUserId(user._id);
        setNewMessageUsers('')
    }

    //back from search result
    const handSearchback = () => {
        setSearchuser([]);
        setSearchInput('')
    }

    //logout
    const handelLogOut = async () => {
        if (!authUser || !authUser.username) {
            toast.error("User session not found. Please login again.");
            localStorage.removeItem('chatapp');
            setAuthUser(null);
            navigate('/login');
            return;
        }

        const confirmlogout = window.prompt("type 'UserName' To LOGOUT");
        console.log("Input username:", confirmlogout);
        console.log("Stored username:", authUser.username);
        
        if (confirmlogout && confirmlogout.trim().toLowerCase() === authUser.username.toLowerCase()) {
            setLoading(true)
            try {
                console.log("Attempting logout...");
                const logout = await axios.post('/api/auth/logout', {}, {
                    withCredentials: true
                });
                console.log("Logout response:", logout.data);
                
                const data = logout.data;
                if (data?.success === false) {
                    setLoading(false)
                    console.log("Logout failed:", data?.message);
                    toast.error(data?.message);
                    return;
                }
                
                toast.success(data?.message || "Logged out successfully");
                localStorage.removeItem('chatapp');
                setAuthUser(null);
                setLoading(false);
                console.log("Redirecting to login...");
                navigate('/login');
            } catch (error) {
                setLoading(false);
                console.log("Logout error:", error);
                toast.error("Logout failed. Please try again.");
            }
        } else {
            console.log("Username mismatch or cancelled");
            toast.info("LogOut Cancelled - Username doesn't match");
        }
    }

    return (
        <div className='h-full w-auto px-1'>
            <div className='flex justify-between gap-2'>
                <form onSubmit={handelSearchSubmit} className='w-auto flex items-center justify-between bg-white rounded-full '>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='px-4 w-auto bg-transparent outline-none rounded-full'
                        placeholder='search user'
                    />
                    <button className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
                        <FaSearch />
                    </button>
                </form>
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    alt='profile'
                    className='self-center h-7 w-7 hover:scale-110 cursor-pointer rounded-full' />
            </div>
            <div className='divider px-3'></div>
            {searchUser?.length > 0 ? (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
                        <div className='w-auto'>
                            {searchUser.map((user) => (
                                <div key={user._id}>
                                    <div
                                        onClick={() => handelUserClick(user)}
                                        className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                                ${selectedUserId === user?._id ? 'bg-sky-500' : ''
                                            } `}>
                                        {/*Socket is Online*/}
                                        <div className={`relative ${isUserOnline(user._id) ? 'after:absolute after:top-0 after:right-0 after:w-1.5 after:h-1.5 after:bg-green-500 after:rounded-full after:border-2 after:border-white':''}`}>
                                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                                <img src={user.profilepic} alt='user.img' className="w-8 h-8 rounded-full object-cover" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col flex-1'>
                                            <p className='font-bold text-gray-950'>{user.username}</p>
                                        </div>
                                    </div>
                                    <div className='divider divide-solid px-3 h-[1px]'></div>
                                </div>
                            )
                            )}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handSearchback} className='bg-white rounded-full px-2 py-1 self-center'>
                            <IoArrowBackSharp size={25} />
                        </button>

                    </div>
                </>
            ) : (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
                        <div className='w-auto'>
                            {chatUser.length === 0 ? (
                                <>
                                    <div className='font-bold items-center flex flex-col text-xl text-yellow-500'>
                                    
                                        <h1>Search username to chat</h1>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {chatUser.map((user) => (
                                        <div key={user._id}>
                                            <div
                                                onClick={() => handelUserClick(user)}
                                                className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                                ${selectedUserId === user?._id ? 'bg-sky-500' : ''
                                                    } `}>

                                                {/*Socket is Online*/}
                                                <div className={`relative ${isUserOnline(user._id) ? 'after:absolute after:top-0 after:right-0 after:w-1.5 after:h-1.5 after:bg-green-500 after:rounded-full after:border-2 after:border-white':''}`}>
                                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                                        <img src={user.profilepic} alt='user.img' className="w-8 h-8 rounded-full object-cover" />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col flex-1'>
                                                    <p className='font-bold text-gray-950'>{user.username}</p>
                                                </div>
                                                    <div>
                                                        { newMessageUsers.reciverId === authUser._id && newMessageUsers.senderId === user._id ?
                                                    <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">+1</div>:<></>
                                                        }
                                                    </div>
                                            </div>
                                            <div className='divider divide-solid px-3 h-[1px]'></div>
                                        </div>
                                    )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handelLogOut} className='hover:bg-red-600  w-10 cursor-pointer hover:text-white rounded-lg'>
                            <BiLogOut size={25} />
                        </button>
                        <p className='text-sm py-1'>Logout</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default Sidebar