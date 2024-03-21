import React, { useState } from 'react';


function DiaryEntryList({ entries, deleteEntry, editEntry }) {
    const [editMode, setEditMode] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [expandedEntryId, setExpandedEntryId] = useState(null);
    

    const handleEditClick = (entryId) => {
        setEditMode(entryId === editMode ? null : entryId);
        if (entryId !== editMode) {
            const entryToEdit = entries.find(entry => entry.id === entryId);
            setEditedTitle(entryToEdit.title);
            setEditedContent(entryToEdit.content);
        }
    };

    const handleSaveClick = (entry) => {
        const updatedEntry = { ...entry, title: editedTitle, content: editedContent }; // 수정된 entry 객체를 생성합니다.
        editEntry(updatedEntry); // 수정된 항목 저장
        setEditMode(null); // 수정 모드 종료
    };

    const handleDeleteClick = (entry) => {
        const confirmation = window.confirm('삭제하시겠습니까?')
        if (confirmation) {
            deleteEntry(entry)
        }
    }

    const handleExpandClick = (entryId) => {
        setExpandedEntryId(entryId === expandedEntryId ? null : entryId);
        if (editMode !== entryId) setEditMode(null)
    };


    return (
        <div className='DiaryEntryList'>
            {entries.map((entry) => (
                <div key={entry.id}>
                    <div>
                        <h3
                            className='entry_title'
                            onClick={() => handleExpandClick(entry.id)}
                        >
                            {entry.title}
                        </h3>
                    </div>
                    {expandedEntryId === entry.id && (
                        <div className='entry_content'>
                            {editMode === entry.id ? (
                                <div>
                                    <input
                                        className='title_input'
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                    />
                                    <textarea
                                        className='content_input'
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                    />
                                    <button onClick={() => handleSaveClick(entry)}>저장</button>
                                </div>
                            ) : (
                                <p className='entry_content'>{entry.content}</p>
                            )}
                            {expandedEntryId === entry.id && (
                                <div className='diary_edit_delete_btn_wrap'>
                                    <button onClick={() => handleEditClick(entry.id)} className='diary_edit_btn'>수정</button>
                                    <button onClick={() => handleDeleteClick(entry)} className='diary_delete_btn'>삭제</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default DiaryEntryList;
