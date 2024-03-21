import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, enableIndexedDbPersistence, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase-config'

import { MdAdd } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

import './Todo.css'


function Todo() {
    const [user, setUser] = useState(null);
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState([]);
    const [editTodoId, setEditTodoId] = useState(null);
    const [editedTodoText, setEditedTodoText] = useState('');

    useEffect(() => {
        // const db = getFirestore(); // Firestore 데이터베이스 초기화        

        // Firestore 초기화 및 오프라인 지원 활성화
        if (db) {
            const enablePersistence = async () => {
                try {
                    await enableIndexedDbPersistence(db);
                } catch (err) {
                    if (err.code === 'failed-precondition') {
                        console.log('여러 개의 탭이 열려 있습니다. 오프라인 동기화는 한 번에 하나의 탭에서만 사용할 수 있습니다.');
                    } else if (err.code === 'unimplemented') {
                        console.log('현재 브라우저에서 오프라인 동기화를 지원하지 않습니다.');
                    }
                }
            };

            enablePersistence();

            // 사용자의 인증 상태를 확인합니다.
            const unsubscribe = auth.onAuthStateChanged((user) => {
                setUser(user);
                if (user) {
                    // 로그인한 사용자의 할 일 목록을 가져옵니다.
                    fetchTodos(user);
                } else {
                    setTodos([]);
                }
            });

            return () => unsubscribe();
        }
    }, []); 

    // const collectionRef = collection(db, 'todo');

    // 할 일 목록 가져오기 함수 수정
    const fetchTodos = async (user) => {
        // 사용자가 로그인한 경우에만 할 일 목록을 가져옵니다.
        if (user) {
            const collectionRef = collection(db, `todo/${user.uid}/todos`);
            const todosSnapshot = await getDocs(query(collectionRef, orderBy('createdAt')));
            const todosData = todosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTodos(todosData);
        } else {
            // 사용자가 로그인하지 않은 경우에는 빈 할 일 목록을 설정합니다.
            setTodos([]);
        }
    };



    // 할 일 추가 함수 수정
    const addTodo = async () => {
        if (!todo.trim()) return;

        try {
            // 사용자가 로그인한 경우에만 할 일을 추가합니다.
            if (user) {
                await addDoc(collection(db, `todo/${user.uid}/todos`), {
                    text: todo,
                    createdAt: serverTimestamp() // 서버 시간을 기준으로 생성일자 추가
                });
                setTodo('');
                // 할 일 추가 후 목록을 다시 가져옵니다.
                fetchTodos(user);
            }
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };


    // 할 일 삭제 함수
    const deleteTodo = async (id) => {
        try {
            if (user) {
                const confirmed = window.confirm('삭제하시겠습니까?');
                if (confirmed) {
                    await deleteDoc(doc(db, `todo/${user.uid}/todos`, id));
                    fetchTodos(user);
                }
            }
        } catch (error) {
            console.error('Error deleting document: ', error);
        }
    };


    // 할 일 수정 함수
    const updateTodo = async (id, newText) => {
        try {
            if (user) {
                await updateDoc(doc(db, `todo/${user.uid}/todos`, id), { text: newText });
                fetchTodos(user);
            }
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };


    // 할 일 수정 후 저장
    const saveEditedTodo = async () => {
        if (!editedTodoText.trim() || !editTodoId) return;

        try {
            await updateTodo(editTodoId, editedTodoText);
            setEditTodoId(null);
            setEditedTodoText('');
        } catch (error) {
            console.error('Error saving edited todo: ', error);
        }
    };


    const toggleTodoComplete = async (id, isCompleted) => {
        try {
            await updateDoc(doc(db, `todo/${user.uid}/todos`, id), { completed: !isCompleted });
            fetchTodos(user);
        } catch (error) {
            console.error('Error toggling todo complete status: ', error);
        }
    };




    

    // 날짜
    const date = new Date()
    const now_date = (date.getMonth()+1) + "월" + " " + date.getDate() + "일"

    return (
        <div>
        {user ? (
            <div className='Todo'>
            <h2 className='date_txt'>{now_date}</h2>
            <h3 className='today_todo'>오늘의 할 일</h3>
            <div className='txt_add_wrap'>
                <input className='todo_input' type="text" value={todo} onChange={(e) => setTodo(e.target.value)} />
                <button className='add_btn' onClick={addTodo}><MdAdd /></button>
            </div>
            <ul>
                {todos.map((todoItem) => (
                <li key={todoItem.id} className={todoItem.completed ? 'completed' : ""}>
                    {todoItem.id === editTodoId ? (
                        <div className='edit_wrap'>
                            <input
                                className='edit_txt'
                                type='text'
                                value={editedTodoText}
                                onChange={(e) => 
                                    setEditedTodoText(e.target.value)
                                }
                            />
                            <button
                                className='save_btn'
                                onClick={() => saveEditedTodo()}
                            >
                            <FaCheck />
                            </button>
                        </div>
                    ) : (
                        <div className='content_wrap'>
                            <div className='content'>
                                <span 
                                    className='todo_txt' 
                                    onClick={() => {toggleTodoComplete(todoItem.id, todoItem.completed)}}
                                    style={{ textDecoration: todoItem.completed ? 'line-through' : 'none' }}
                                >
                                    {todoItem.text}
                                </span>
                                <button 
                                    className='edit_btn'
                                    onClick={() => {
                                        setEditTodoId(todoItem.id);
                                        setEditedTodoText(todoItem.text);
                                    }}
                                >
                                <MdEdit />
                                </button>
                                <button className='delete_btn' onClick={() => deleteTodo(todoItem.id)}>
                                <FaXmark />
                                </button>
                            </div>
                        </div>
                    )}
                </li>
                ))}
            </ul>
            </div>
        ) : (
            <div>
                <h2 className='login_txt'>로그인 후 이용 가능한 서비스입니다.</h2>
            </div>
        )}
        </div>
    );
}

export default Todo;
