import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreatePost = () => {
    const { pageId } = useParams();
    console.log('CreatePost pageId:', pageId);
    return (
        <div className="create-post">
            <h1>Create a New Post</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" required />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea id="content" name="content" required></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreatePost;