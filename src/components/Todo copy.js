import React, { useReducer, useState } from 'react'
import ListComp from './ListComp'


function reducer( state, action ) {
    if(action.type === 'addTodo') {
        const newTodo = {
            id: Date.now(),
            todo: action.todo_name.todo,
            isChecked: false
        }
        return {
            count: state.count + 1,
            lists: [ ...state.lists, newTodo ]
        }
    } else if(action.type === 'markTodo') {
        return {
            count: state.count,
            lists: state.lists.map( todo => {
                if(todo.id === action.payload_id){
                    return { ...todo, isChecked: !todo.isChecked }
                }
                return todo
            } )
        }
    } else if(action.type === 'deleteTodo') {
        return {
            count: state.count - 1,
            lists: state.lists.filter( todo => todo.id !== action.payload_id )
        }
    } else {
        return state
    }
}

const initList = {
    count: 0,
    lists: []
}

function Todo() {

    const [ todo, setTodo ] = useState('')
    const [ todoList, dispatchTodoList ] = useReducer( reducer, initList )

    return (
        <div>
            <h2>오늘의 할 일</h2>
            <p className='todo'>해야 할 일 : { todoList.count }</p>
            <p className='finish'>완료 한 일 : { todoList.count }</p>
            <p>
                <input
                    className='todo_input'
                    type="text"
                    placeholder="입력"
                    value={todo}
                    onChange={ e => setTodo( e.target.value ) }
                    onKeyDown={ (e) => {
                        if(e.key === 'Enter') {
                            dispatchTodoList(
                                {
                                    type:'addTodo',
                                    todo_name: { todo }
                                }
                            )
                        setTodo('')            }
                    } }
                />

                <button
                    className='todo_btn'
                    onClick={ () => {
                        dispatchTodoList(
                        {
                            type:'addTodo',
                            todo_name: { todo }
                        }
                        )
                        setTodo('')
                    } }
                >추가</button>
            </p>

            <hr />
            {
                todoList.lists.map( todo_item => {
                    return (
                        <ListComp
                            key={todo_item.id}
                            todo={todo_item.todo}
                            dispatch={dispatchTodoList}
                            id={todo_item.id}
                            isChecked={todo_item.isChecked}
                        />
                    )
                })
            }
        </div>
    )
}

export default Todo