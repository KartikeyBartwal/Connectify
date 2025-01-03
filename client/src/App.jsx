
import React from 'react'
import {Routes, Route, BrowserRouter as Router}  from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import StatusPage from './pages/StatusPage'
import CallPage from './pages/CallPage'
import SignUp from './components/custom/SignUp'
import Login from './components/custom/Login'
import Settings from './components/custom/Settings'


const App = () => {
  return (
    <div className='p-0 md:p-0 lg:p-0 sm:p-0 min-h-screen h-fit bg-gray-900 '>
      {/* <Router> */}
      <Routes>
        <Route path='/' element={<ChatPage/>}></Route>
        <Route path='/signup' element={<SignUp/>}></Route>
        <Route path='/status' element = {<StatusPage/>} ></Route>
        <Route path='/calls' element= {<CallPage/>}></Route>
        <Route path='/login' element= {<Login  />}></Route>
        <Route path='/settings' element = {<Settings/>}></Route>

      </Routes>
      {/* </Router> */}
    </div>
  )
}

export default App
