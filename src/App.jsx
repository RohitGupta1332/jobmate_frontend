import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from "./components/Auth/Auth"
import Profile from "./components/Profile/Profile"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
