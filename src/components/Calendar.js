import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase-config';
import { query, where, onSnapshot } from 'firebase/firestore';


import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'

import moment from 'moment'
import 'moment/locale/ko'
import { renderToString } from 'react-dom/server'
import './Calendar.css'

// fullcalendar '일' 삭제
function DayCellContent({ info }) {
    const number = document.createElement("a");
    number.classList.add("fc-daygrid-day-number");
    number.innerHTML = info.dayNumberText.replace("일", "");

    if (info.view.type === "dayGridMonth") {
        return <div dangerouslySetInnerHTML={{ __html: number.outerHTML }}></div>;
    }
    return { domNodes: [] }
}


function Calendar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [open, setOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventTime, setEventTime] = useState('');

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false);


    useEffect(() => {
        // Firebase의 인증 정보를 사용해 사용자 로그인 상태 확인
        const unsubscribe = auth.onAuthStateChanged(user => {
            setLoggedIn(!!user);
            if (user) {
                fetchEvents(user.uid)
            } else {
                setEvents([])
            }
        })

        return () => unsubscribe();
    }, [])

    const fetchEvents = async (userId) => {
        const q = query(collection(db, 'events'), where("userId", "==", userId));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const eventsData = [];
            querySnapshot.forEach((doc) => {
                eventsData.push({ id: doc.id, ...doc.data() });
            });
            setEvents(eventsData);
        });
        return unsubscribe;
    }

    const handleDateClick = (arg) => {
        setSelectedDate(arg.date);
        setShowForm(true);
        handleOpen();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let timeToSave = eventTime; 
            if (!(eventTime instanceof Date || typeof eventTime === 'string')) {
                timeToSave = new Date(eventTime).toISOString();
            }
    
            const userId = auth.currentUser.uid; // 현재 사용자의 ID 가져오기
            const docRef = await addDoc(collection(db, "events"), {
                userId, // 사용자의 ID 추가
                title: eventTitle,
                time: timeToSave,
                date: selectedDate.toISOString()
            });
            console.log("Document written with ID: ", docRef.id);
            setShowForm(false);
            handleClose();
            const updatedEventsSnapshot = await getDocs(collection(db, 'events'));
            const updatedEventsData = updatedEventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(updatedEventsData);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    

    // 일정 삭제 함수
    const handleDeleteEvent = async (eventId) => {
        try {
            const confirmation = window.confirm('삭제하시겠습니까?')
            if (confirmation) {
                await deleteDoc(doc(db, 'events', eventId));
                console.log("Document successfully deleted!");
                handleClose();
                setSelectedEvent(null);
            }
        } catch (e) {
            console.error("Error removing document: ", e);
        }
    };

    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event);
        handleOpen(); // 모달 열기
    };



    return (
        <div>
            {loggedIn ? (
                <div style={{ maxWidth: '90%', margin: '0 auto' }}>
                    <FullCalendar
                        locale={"ko"}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        dayCellContent={(info) => <DayCellContent info={info} />}
                        dateClick={handleDateClick}
                        events={events}
                        eventClick={handleEventClick}
                    />
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box 
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                p: 2,
                                textAlign: "center",
                                // zIndex: 9999
                            }}
                        > 
                            <h3 id="modal-modal-title">일정 상세</h3>
                            {selectedEvent ? (
                                <>
                                    <h4>{selectedEvent.title}</h4>
                                    {selectedEvent.start && (
                                        <p>날짜: {moment(selectedEvent.start).locale('ko').format('YYYY년 M월 D일 dddd')}</p>
                                    )}
                                    <Button onClick={() => handleDeleteEvent(selectedEvent.id)}>삭제</Button>
                                </>
                            ) : (
                                <>
                                    {showForm && (
                                        <form onSubmit={handleSubmit}>
                                            <TextField
                                                label="일정 제목"
                                                value={eventTitle}
                                                onChange={(e) => setEventTitle(e.target.value)}
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                            />
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['TimePicker']}>
                                                    <TimePicker 
                                                        label="시간"
                                                        value={eventTime}
                                                        onChange={(newValue) => setEventTime(newValue)} 
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                            <Button type='submit' className='event_add'>일정 등록</Button>
                                        </form>
                                    )}
                                </>
                            )}
                            <Box 
                                sx={{ 
                                    position: 'absolute',
                                    top: '10px',
                                    right: '5px'
                                }}
                            >
                                <Button onClick={handleClose}>닫기</Button>
                            </Box>
                        </Box>
                    </Modal>
                </div>
            ): (
                <div>
                    <h2 className='login_txt'>로그인 후 이용 가능한 서비스입니다.</h2>
                </div>
            )}
        </div>
    );
}

export default Calendar;
