import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from '../pages/homePage.jsx';
import * as loginHelpers from './helpers/loginHelpers.jsx'
import '../styles/app.css';

const App = () => {
    const checkBackendStatus = async () => {
        const response = await loginHelpers.checkBackend();
        console.log('response',response);
    }

    useEffect(() => {
        checkBackendStatus();
    }, [])

    return (
        <div className="app">
            {/* Navigation would typically go here */}
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <main>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    {/* Add more routes as needed */}
                </Switch>
            </main>
        </div>
    );
};

export default App;