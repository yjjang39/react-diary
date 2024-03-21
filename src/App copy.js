// 이미지
// import LogoImg from './assets/logo.png'
import LoginImg from './assets/login.png'
import LogoutImg from './assets/logout.png'
import NoticeImg from './assets/notice.png'
import TodoImg from './assets/todos.png'
import DiaryImg from './assets/diary.png'
import CalendarImg from './assets/calendar.png'


import './App.css';
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes, Link, Router, useNavigate } from 'react-router-dom';
import Login from './components/Login'
import Logout from './components/Logout'
import Join from './components/Join'
import Todo from './components/Todo'
import Calendar from './components/Calendar'
import Diary from './components/Diary'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/firebase-config';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate()
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        // user 객체가 있을 경우, 즉 로그인이 되어있을 때만 isLoggedIn 상태를 true로 설정합니다.
        // 이렇게 하면 회원가입 직후 자동 로그인 상태에서도 isLoggedIn 상태를 즉시 true로 변경하지 않습니다.
        // setIsLoggedIn(!!user); 
        if(user) {
          navigate('/');
        }
      });
  
      // 컴포넌트가 unmount될 때 구독을 정리합니다.
      return () => unsubscribe();
    }, [navigate]); // []를 두 번째 인수로 전달하여 한 번만 실행되도록 설정
  
    const handleLoginClick = () => {
      if(isLoggedIn) {
        alert('이미 로그인되어 있습니다.');
        setIsLoggedIn(false)
        navigate('/logout')
      } else {
        // 로그인 페이지로 이동
        navigate('/login')
      }
    }
  console.log(isLoggedIn)

  return (
    <div className="App">
      <header>
        <h1 className='logo_img'>
          <Link to='/'>logo</Link>
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
              <img src={isLoggedIn ? LogoutImg : LoginImg } alt={isLoggedIn ? '로그아웃' : '로그인'} className='login_btn' onClick={handleLoginClick} />
            </Link>
            </li>
          <li>
          <button type='button' className='notice_btn'>
            <img src={NoticeImg} alt='알림' className='notice_btn_img' />
          </button>
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