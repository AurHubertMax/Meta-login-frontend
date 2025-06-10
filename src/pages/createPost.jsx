import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../styles/createPost.css';
import ImageUploader from '../components/imageUploader';
import ImageUrlUploader from '../components/imageUrlUploader';
const pagesHelper = require('../components/helpers/pagesHelpers');

const CreatePost = () => {
    const { pageId } = useParams();
    console.log('CreatePost pageId:', pageId);

    const [imageResetKey, setImageResetKey] = useState(0);
    const [activeTab, setActiveTab] = useState('image');
    // const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [error, setError] = useState(null);

    const handleGoBack = () => {
        window.history.back();
    }

    // const handleFileSelect = (file) => {
    //     console.log('Selected file:', file);
    //     setImage(file);
    //     setError(null);
    // };

    useEffect(() => {
        console.log('image url:', imageUrl);
    }, [imageUrl]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        
        const formData = new FormData(e.target);
        const message = formData.get('message');
        
        console.log('Form submitted:', { 
            message, 
            type: activeTab,
            // image: activeTab === 'image' ? image : null,
            image: activeTab === 'image' ? imageUrl : null,
            link: activeTab === 'link' ? linkUrl : null
        });

        // if (activeTab === 'image' && !image) {
        //     setError('Please select an image before submitting.');
        //     return;
        // }
        if (activeTab === 'image' && !imageUrl) {
            setError('Please enter a valid image URL before submitting.');
            return;
        }
        
        if (activeTab === 'link' && !linkUrl) {
            setError('Please enter a valid URL before submitting.');
            return;
        }

        let response;
        let body;
        try {
            switch (activeTab) {
                
                case 'link':
                    body = {
                        link: linkUrl,
                        message: message,
                    };
                    response = await pagesHelper.postLinkToFacebookPage(pageId, body);
                    break;
                
                case 'image':
                    body = {
                        message: message,
                        // image: image,
                        imageUrl: imageUrl,
                    }
                    response = await pagesHelper.postImageToFacebookPage(pageId, body); //image);
                    break;

                default:
                    setError('Invalid post type selected.');
                    return;
            }
            console.log('Post response:', response);
            if (response.status === 'error') {
                toast.error(response.message);
                return;
            }
            toast.success('Post created successfully!');
            setImageResetKey(prevKey => prevKey + 1);
            // setImage(null);
            setImageUrl('');
            setLinkUrl('');

            form.reset();
            setActiveTab('image');
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
                            <ImageUrlUploader 
                            onImageSelect={(url) => {
                                setImageUrl(url);
                                setError(null);
                            }}
                            resetKey={imageResetKey}
                            />
                            {/* {error && <p className="error">{error}</p>} */}
                        </>
                        // <>
                        //     <ImageUploader 
                        //         onImageSelect={handleFileSelect} 
                        //         resetKey={imageResetKey} 
                        //     />
                        //     {image && <p className="selected-file">Selected Image: {image.name}</p>}
                        // </>
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
                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" required></textarea>
                </div>
                <button type="submit">
                    Submit
                </button>
            </form>
            
        </div>
    );
}

export default CreatePost;