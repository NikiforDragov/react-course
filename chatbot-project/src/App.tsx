import { useEffect, useState } from 'react';
import { ChatInput } from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import { Chatbot } from 'supersimpledev';
import RobotProfileImage from './assets/robot.png';
import './App.css';

function App() {
    const [chatMessages, setChatMessages] = useState(
        JSON.parse(localStorage.getItem('messages')!) || []
    );
    // const [chatMessages, setChatMessages] = array;
    // const chatMessages = array[0];
    // const setChatMessages = array[1];
    useEffect(() => {
        Chatbot.addResponses({
            goodbye: 'Goodbye. Have a great day!',
            'give me a unique id': function () {
                return `Sure! Here's a unique ID: ${crypto.randomUUID()}`;
            },
        });

        // [] tells useEffect to only run once. We only want to run
        // this setup code once because we only want to add these
        // extra responses once.
    }, []);

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(chatMessages));
    }, [chatMessages]);

    const title = `${chatMessages.length} Messages`;

    return (
        <>
            <title>{title}</title>
            <link rel='icon' type='image/svg+xml' href={RobotProfileImage} />
            <div className='app-container'>
                {chatMessages.length === 0 && (
                    <p className='welcome-message'>
                        Welcome to the chatbot project! Send a message using the
                        textbox below.
                    </p>
                )}
                <ChatMessages chatMessages={chatMessages} />
                <ChatInput
                    chatMessages={chatMessages}
                    setChatMessages={setChatMessages}
                />
            </div>
        </>
    );
}

export default App;
