import Login from "./login/login.jsx"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route ,Routes } from "react-router-dom";
import Register from "./register/register.jsx";
import Home from "./home/home.jsx";
import Profile from "./profile/Profile.jsx";
import { VerifyUser } from "./utils/VerifyUser.jsx";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";

function App() {
  
  return (
    <AuthContextProvider>
      <SocketContextProvider>
        <div className="p-2 w-screen h-screen flex items-center justify-center bg-transparent">
          <div className="fixed top-2 left-3 z-50 text-black font-extrabold tracking-widest text-4xl md:text-4xl select-none">
            NEXUS
          </div>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route element={<VerifyUser/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/profile/:id" element={<Profile/>}/>
            </Route>
          </Routes>
          <ToastContainer/>
        </div>
      </SocketContextProvider>
    </AuthContextProvider>
  )
}

export default App