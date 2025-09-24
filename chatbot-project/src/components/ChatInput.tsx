import { useState, type ChangeEvent, type KeyboardEvent, type JSX } from 'react';
import { Chatbot } from 'supersimpledev';
import dayjs from 'dayjs';
import LoadingSpinnerImage from '../assets/loading-spinner.gif';
import './ChatInput.css';

export type ChatMessage = {
  id: string;
  message: string | JSX.Element;
  sender: 'user' | 'robot';
  time?: number;
};

type ChatInputProps = {
  chatMessages: ChatMessage[];
  setChatMessages: (chatMessages: ChatMessage[]) => void;
};

export function ChatInput({ chatMessages, setChatMessages }: ChatInputProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function saveInputText(event: ChangeEvent<HTMLInputElement>) {
    setInputText(event.target.value);
  }

  async function sendMessage() {
    if (isLoading || inputText.trim() === '') return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      message: inputText,
      sender: 'user',
      id: crypto.randomUUID(),
      time: dayjs().valueOf(),
    };

    const newChatMessages = [...chatMessages, userMessage];
    setChatMessages(newChatMessages);

    // Show loading spinner
    const loadingMessage: ChatMessage = {
      message: (
        <img
          src={LoadingSpinnerImage}
          className="loading-spinner"
        />
      ),
      sender: 'robot',
      id: crypto.randomUUID(),
    };

    setChatMessages([...newChatMessages, loadingMessage]);
    setInputText('');

    // Get chatbot response
    const response = await Chatbot.getResponseAsync(inputText);
    const botMessage: ChatMessage = {
      message: response,
      sender: 'robot',
      id: crypto.randomUUID(),
      time: dayjs().valueOf(),
    };

    setChatMessages([...newChatMessages, botMessage]);
    setIsLoading(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      sendMessage();
    } else if (event.key === 'Escape') {
      setInputText('');
    }
  }

  function clearMessages() {
    setChatMessages([]);
  }

  return (
    <div className="chat-input-container">
      <input
        placeholder="Send a message to Chatbot"
        size={30}
        onChange={saveInputText}
        onKeyDown={handleKeyDown}
        value={inputText}
        className="chat-input"
      />
      <button className="send-button" onClick={sendMessage}>
        Send
      </button>
      <button className="clear-button" onClick={clearMessages}>
        Clear
      </button>
    </div>
  );
}
