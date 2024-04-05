import { useEffect } from 'react'
// import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

import Room from './pages/Room.tsx'

function Redirect({ to }: { to: string }) {
  const nav = useNavigate()
  useEffect(() => {
    nav(to)
  })
  return <div>redirect to {to}</div>
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Redirect to="/live" />} />
          <Route path="/live/:roomId?" element={<Room />} index />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
