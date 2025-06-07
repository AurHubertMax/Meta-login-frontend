import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../styles/createPost.css';
import ImageUploader from '../components/imageUploader';

const CreatePost = () => {
    const { pageId } = useParams();
    console.log('CreatePost pageId:', pageId);

    const [imageResetKey, setImageResetKey] = useState(0);
    const [activeTab, setActiveTab] = useState('image');
    const [image, setImage] = useState(null);
    const [linkUrl, setLinkUrl] = useState('');
    const [error, setError] = useState(null);

    const handleGoBack = () => {
        window.history.back();
    }

    const handleFileSelect = (file) => {
        console.log('Selected file:', file);
        setImage(file);
        setError(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const title = formData.get('title');
        const content = formData.get('content');
        
        console.log('Form submitted:', { 
            title, 
            content, 
            type: activeTab,
            image: activeTab === 'image' ? image : null,
            link: activeTab === 'link' ? linkUrl : null
        });

        if (activeTab === 'image' && !image) {
            setError('Please select an image before submitting.');
            return;
        }
        
        if (activeTab === 'link' && !linkUrl) {
            setError('Please enter a valid URL before submitting.');
            return;
        }

        try {
            toast.success('Post created successfully!');
            setImageResetKey(prevKey => prevKey + 1);
            setImage(null);
            setLinkUrl('');

            e.target.reset();
        } catch (err) {
            console.error('Error creating post:', err);
            toast.error('Failed to create post. Please try again.');
        }
    }

    return (
        <div className="create-post-container">
            <div className="header-row">
                <button 
                    className="back-button" 
                    onClick={handleGoBack}
                    type="button"
                >
                    ← Back
                </button>
                <h1>Create a New Post</h1>
                <div className="spacer"></div>
            </div>
            <div className="tab-container">
                <button 
                    type="button"
                    className={`tab-button ${activeTab === 'image' ? 'active' : ''}`}
                    onClick={() => setActiveTab('image')}
                >
                    Image
                </button>
                <button 
                    type="button"
                    className={`tab-button ${activeTab === 'link' ? 'active' : ''}`}
                    onClick={() => setActiveTab('link')}
                >
                    Link
                </button>
            </div>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    {activeTab === 'image' ? (
                        <>
                            <ImageUploader 
                                onImageSelect={handleFileSelect} 
                                resetKey={imageResetKey} 
                            />
                            {image && <p className="selected-file">Selected Image: {image.name}</p>}
                        </>
                    ) : (
                        <>
                            <label htmlFor="linkUrl">URL:</label>
                            <input 
                                type="url" 
                                id="linkUrl" 
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com/your-link"
                            />
                        </>
                    )}
                    
                    {error && <p className="error">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" required />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea id="content" name="content" required></textarea>
                </div>
                <button type="submit">
                    Submit
                </button>
            </form>
            
        </div>
    );
}

export default CreatePost;