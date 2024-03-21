import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from './firebase-config';
import FullCalendar from '@fullcalendar/react'; // FullCalendar 라이브러리
import dayGridPlugin from '@fullcalendar/daygrid'; // FullCalendar의 일 그리드 플러그인

const Calendar = () => {
    const [events, setEvents] = useState([]); // 캘린더 이벤트 상태

    useEffect(() => {
        const loadEvents = async () => {
            const db = getFirestore();
            const userUid = auth.currentUser.uid;

            try {
                const docRef = doc(db, 'schedules', userUid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setEvents(docSnap.data().events);
                }
            } catch (error) {
                console.error('Error getting document:', error);
            }
        };

        if (auth.currentUser) {
            loadEvents();
        }
    }, []);

    const handleEventAdd = async (eventInfo) => {
        const db = getFirestore();
        const userUid = auth.currentUser.uid;
        
        const newEvents = [...events, eventInfo.event];

        try {
            const docRef = doc(db, 'schedules', userUid);
            await setDoc(docRef, { events: newEvents });
            setEvents(newEvents);
        } catch (error) {
            console.error('Error adding document:', error);
        }
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventAdd={handleEventAdd} // 일정 추가 시 호출되는 핸들러
            />
        </div>
    );
};

export default Calendar;
