import './App.css'
import Nav from './components/header/navbar/nav.jsx'
import { Routes, Route } from 'react-router-dom'
import Home from './components/layout/Home/home.jsx'
import Menu from './components/pages/menu/menu.jsx'

function App() {
    return (
    <>
      <Nav/>  
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<h1>Birthday</h1>} />
        <Route path="/menu" element={<Menu/>} />
        <Route path="/contact" element={<h1>Happy Meal</h1>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  )
}

export default App
