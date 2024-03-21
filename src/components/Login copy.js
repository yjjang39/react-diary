import React, { useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged, // 코드 추가
    signInWithEmailAndPassword, // 코드 추가
    signOut, // 코드추가
} from "firebase/auth";
import { auth } from "./firebase-config";
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
// import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Join from './Join'
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Calendar from "./Calendar";


const Login = ({ isLoggedIn, setIsLoggedIn }) => {
    const [loginEmail, setLoginEmail] = useState(""); // 코드 추가
    const [loginPassword, setLoginPassword] = useState(""); // 코드 추가
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);



    //로그인
    const login = async () => {
        try {
            await signInWithEmailAndPassword(
                auth,
                loginEmail,
                loginPassword
            );
            // console.log(user);            
            setLoginSuccess(true) // 로그인 성공 시 상태 업데이트
            setIsLoggedIn(true) // 로그인 성공 시 isLoggedIn 상태 업데이트 
            alert('로그인 되었습니다.')
            navigate('/')
        } catch (error) {
            // console.log(error.message);
            alert('로그인에 실패하였습니다.')
        }
    };

    //로그아웃
    const logout = async () => {
        await signOut(auth);
        setIsLoggedIn(false) // 로그아웃 시 isLoggedIn 상태 업데이트
    };

    return (
    <div>

    
        <Routes>
            <Route exact path='/' component={Login} />
            <Route path='/join' component={Join} />
            <Route path='/calendar' component={Calendar} />
        </Routes>



        <Container component="main" maxWidth="md">        
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    로그인
                </Typography>
                <TextField 
                    margin='normal'
                    label="Email Address" 
                    required 
                    fullWidth 
                    name='email'
                    autoComplete="email"
                    // autoFocus

                    onChange={(e) => {
                        setLoginEmail(e.target.value);
                    }}
                />
                <TextField 
                    margin='normal'
                    label="Password" 
                    type='password' 
                    required 
                    fullWidth 
                    name='password' 
                    autoComplete="current-password"

                    onChange={(e) => {
                        setLoginPassword(e.target.value);
                    }}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />} 
                    label='비밀번호 기억하기'
                />
                

                <Button 
                    type='submit' 
                    fullWidth 
                    variant='contained'
                    sx={{mt:3, mb:2}}

                    onClick={isLoggedIn ? logout : login}
                >
                    {isLoggedIn ? '로그아웃' : '로그인'}
                </Button>

                <Grid container>
                    <Grid item xs>
                        <Link variant='body2' sx={{ cursor: 'pointer' }} className="link">비밀번호를 잊으셨나요?</Link>
                    </Grid>
                    <Grid item>
                        <Link to='/join' variant='body2' sx={{ cursor: 'pointer' }} className="link">회원가입</Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
        </div>
    );
};
export default Login;