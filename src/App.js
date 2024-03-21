// 이미지
import LogoImg from './assets/mydiary_logo(bg_x).png'
import LoginImg from './assets/login.png'
import LogoutImg from './assets/logout.png'
import NoticeImg from './assets/notice.png'
import TodoImg from './assets/todos.png'
import DiaryImg from './assets/diary.png'
import CalendarImg from './assets/calendar.png'

import './App.css';
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes, Link, Router, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './components/firebase-config';

import Login from './components/Login'
import Logout from './components/Logout'
import Join from './components/Join'
import Todo from './components/Todo'
import Calendar from './components/Calendar'
import Diary from './components/Diary'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate()
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsLoggedIn(true); // 사용자가 로그인되어 있으면 true로 설정
        } else {
          setIsLoggedIn(false); // 사용자가 로그아웃되어 있으면 false로 설정
        }
      });
  
      // 컴포넌트가 unmount될 때 구독을 정리합니다.
      return () => unsubscribe();
    }, []); // []를 두 번째 인수로 전달하여 한 번만 실행되도록 설정
  

    const handleLoginClick = () => {
      if(isLoggedIn) {
        const confirmed = window.confirm('로그아웃 하시겠습니까?')
        if(confirmed){
          setIsLoggedIn(false)
          signOut(auth)
          .then(() => {
            setIsLoggedIn(false)
            navigate('/')
          })
          .catch((error) => {
            console.error('로그아웃 중 오류 발생:', error)
          })
        }
      } else {
        // 로그인 페이지로 이동
        navigate('/login')
      }
    }
  console.log(isLoggedIn)


  

  return (
    <div className="App">
      <header>
        <h1 className='logo'>
          <Link to='/'><img src={LogoImg} alt='mydiary' className='logo_img' /></Link>
        </h1>

        <nav className='gnb'>
          <Link to='todo'>
            <img src={TodoImg} alt='할 일' className='todo_btn' />
          </Link>
          <Link to='calendar'>
            <img src={CalendarImg} alt='할 일' className='calendar_btn' />
          </Link>
          <Link to='diary'>
            <img src={DiaryImg} alt='할 일' className='diary_btn' />
          </Link>
        </nav>

      <div className='utilmenu'>
        <ul>
          <li>        
            <Link to='login'>
              <img src={isLoggedIn ? LogoutImg : LoginImg } alt={isLoggedIn ? '로그인' : '로그아웃'} className='login_btn' onClick={handleLoginClick} />
            </Link>
            </li>
          <li>
          {/* <button type='button' className='notice_btn'>
            <img src={NoticeImg} alt='알림' className='notice_btn_img' />
          </button> */}
          </li>
        </ul>
      </div>


      </header>
      <main>
      <Routes>
        <Route path='/' element={ <Calendar /> } />
        <Route path='/login' element={ <Login /> } />
        <Route path='/logout' element={ <Logout /> } />
        <Route path='/join' element={ <Join /> } />
        <Route path='/todo' element={ <Todo /> } />
        <Route path='/calendar' element={ <Calendar /> } />
        <Route path='/diary' element={ <Diary /> } />
      </Routes>
      </main>

    </div>
  );
}

export default App;