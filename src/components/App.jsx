import React from 'react';
import * as loginHelpers from './helpers/loginHelpers.jsx'

const App = () => {
    const handleButtonClick = async () => {
        console.log('Button clicked!');
        const response = await loginHelpers.checkBackend();
        console.log('response',response);
    }

    return (
        <div>
            <h1>Welcome to My React App</h1>
            <p>This is a simple React application.</p>
            <button onClick={handleButtonClick}>Click Me</button>
        </div>
    );
};

export default App;