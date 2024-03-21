import React, { useState } from 'react';
import './DiaryEntryForm.css'

function DiaryEntryForm({ addEntry }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addEntry({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className='DiaryEntryForm'>
            <input
                className='title_input'
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
            />
            <textarea
                className='content_input'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용"
            />
            <button type="submit" className='diary_save_btn'>저장</button>
        </form>
    );
}

export default DiaryEntryForm;
