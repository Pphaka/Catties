import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Homepage from "./pages/Homepage"
import Chat from "./pages/Chat/Chat";
import Endtrip from "./pages/Endtrip"
import ProfilePage from "./pages/Profilepage";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/chat/:groupId" element={<Chat />} />
        <Route path="/endtrip" element={<Endtrip/>} />
        <Route path="/profile" element={<ProfilePage/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}