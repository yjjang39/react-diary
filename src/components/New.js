import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Login from './Login'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './Join.css'

const Join = () => {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState('')
    const navigate = useNavigate();
    // const [user, setUser] = useState(null); // 사용자 상태 추가

    // useEffect( () => {
    //     const unsubscribe = auth.onAuthStateChanged( (user) => {
    //         if (user) {
    //             // 사용자가 로그인한 경우
    //             setUser(user)
    //         } else {
    //             setUser(null)
    //         }
    //     } );

    //     return () => unsubscribe(); // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    // } )

    const register = async () => {
        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
            );
            // console.log(user);
            // setRegistrationSuccess(true) // 회원가입 성공 시 상태 업데이트
            alert('회원가입이 완료되었습니다.')
            navigate('/login') // 로그인 페이지로 이동
        } catch (error) {
            // console.log(error.message);
        }
    };

    return (
        <div>
            <Routes>
                <Route exact path='/' component={Join} />
                <Route path='/login' component={Login} />
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
                    회원가입
                </Typography>
                        {/* <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="이름"
                                autoFocus
                            />
                        </Grid> */}
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"

                                onChange={(e) => {
                                    setRegisterEmail(e.target.value);
                                }}
                            />
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                error={!!passwordError}
                                helperText={passwordError}

                                onChange={(e) => {
                                    setRegisterPassword(e.target.value);
                                    if(e.target.value.length < 6) {
                                        setPasswordError('비밀번호는 6자 이상이어야 합니다.')
                                    } else {
                                        setPasswordError('')
                                    }
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label="마케팅 알림에 수신 동의합니다."
                            />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        
                        onClick={register}
                    >
                    회원가입
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to='/login' variant="body2" className="link">
                                이미 계정이 있으신가요?
                            </Link>
                        </Grid>
                    </Grid>
                    {/* {registrationSuccess && <Typography variant='body1'>회원가입이 완료되었습니다.</Typography>} */}
                </Box>
            </Container>
        </div>
    );
};
export default Join;