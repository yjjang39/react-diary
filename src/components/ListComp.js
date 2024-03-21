import React from 'react'

function ListComp( { todo, dispatch, id, isChecked} ) {
    return (
        <p>
            <span
                style={{
                    color: isChecked ? '#999' : '#000',
                    textDecoration: isChecked ? 'line-through' : 'none'
                }}
                onClick={ () => {
                    dispatch(
                        {
                            type: 'markTodo',
                            payload_id: id
                        }
                    )
                } }
            >
                { todo }
            </span>
            <button
                onClick={ () => {
                    dispatch(
                        {
                            type: 'deleteTodo',
                            payload_id:id
                        }
                    )
                } }
            >X</button>
        </p>
    )
}

export default ListComp