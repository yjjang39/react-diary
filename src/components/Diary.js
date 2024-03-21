import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import DiaryEntryForm from './DiaryEntryForm';
import DiaryEntryList from './DiaryEntryList';
import { auth, db } from './firebase-config';
import './Diary.css'

import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';


function Diary() {
    const [entries, setEntries] = useState([]);
    const [user, setUser] = useState(null);
    const [isWriting, setIsWriting] = useState(false);
    const [currentEntry, setCurrentEntry] = useState({});


    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                await fetchEntries(user);
            } else {
                setEntries([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchEntries = async (user) => {
        const q = query(collection(db, 'diary'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedEntries = [];
        querySnapshot.forEach((doc) => {
            fetchedEntries.push({ id: doc.id, ...doc.data() });
        });
        setEntries(fetchedEntries);
    };

    const addEntry = async (entry) => {
        try {
            const docRef = await addDoc(collection(db, 'diary'), {
                userId: user.uid,
                title: entry.title,
                content: entry.content,
                createdAt: serverTimestamp()
            });
            const newEntry = { id: docRef.id, ...entry };
            setEntries(prevEntries => [newEntry, ...prevEntries]);
            setIsWriting(false); // 작성 중인 상태 해제
        } catch (error) {
            console.error('Error adding entry: ', error);
        }
    };

    const deleteEntry = async (entryToDelete) => {
        try {
            await deleteDoc(doc(db, 'diary', entryToDelete.id));
            setEntries(entries.filter(entry => entry.id !== entryToDelete.id));
        } catch (error) {
            console.error('Error deleting entry: ', error);
        }
    };

    const editEntry = async (entryToUpdate) => {
        try {
            // Firestore에서 업데이트할 항목을 찾습니다.
            const entryDocRef = doc(db, 'diary', entryToUpdate.id);
    
            // 업데이트할 데이터를 설정합니다.
            const updatedEntryData = {
                title: entryToUpdate.title,
                content: entryToUpdate.content
            };
    
            // Firestore에서 해당 항목을 업데이트합니다.
            await updateDoc(entryDocRef, updatedEntryData);
            
            // 로컬 상태를 업데이트합니다.
            setEntries(entries.map(entry => {
                if (entry.id === entryToUpdate.id) {
                    return { ...entry, title: entryToUpdate.title, content: entryToUpdate.content };
                } else {
                    return entry;
                }
            }));
        } catch (error) {
            console.error('Error updating entry: ', error);
        }
    };
    

    const handleWrite = () => {
        setIsWriting(true);
    };

    const handleSave = async (entry) => {
        try {
            await addEntry(entry); // 새로운 일기 추가
            await fetchEntries(user); // 일기 목록 다시 가져오기
        } catch (error) {
            console.error('Error saving entry: ', error);
        }
        setIsWriting(false);
    };

    // 날짜
    const date = new Date()
    const now_date = (date.getMonth()+1) + "월" + " " + date.getDate() + "일"
    

    return (
        <div className='Diary'>
            {user ? (
                <div className='Diary'>
                    <h2 className='date_txt'>{now_date}</h2>
                    <h3 className='today_diary'>오늘의 일기</h3>
                    {isWriting ? (
                        <DiaryEntryForm addEntry={addEntry} onSave={handleSave} />
                    ) : (
                        <>
                            <Fab color="primary" aria-label="edit" onClick={handleWrite} className='edit_icon'>
                                <EditIcon />
                            </Fab>
                            <DiaryEntryList entries={entries} deleteEntry={deleteEntry} editEntry={editEntry} />
                        </>
                    )}
                </div>
            ) : (
                <div>
                    <h2 className='login_txt'>로그인 후 이용 가능한 서비스입니다.</h2>
                </div>
            )}
        </div>
    );

}

export default Diary;
