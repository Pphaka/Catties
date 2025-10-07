import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Homepage from "./pages/Homepage"
import Chat from "./pages/Chat";
import Profile from "./pages/profile";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="profile" element={<Profile/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}
