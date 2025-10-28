import React, { useState } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!API_KEY) {
  console.error('OpenAI API key is not set in environment variables');
}

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello! I'm your AI assistant. How can I help you today?",
      direction: 'incoming',
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      console.log('Starting message processing...');
      console.log('Current messages:', messages);
      console.log('New message:', newMessage);
      const response = await processMessageToChatGPT([...messages, newMessage]);
      console.log('Raw API Response:', response);
      
      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response choices returned from API');
      }
      
      const content = response.choices[0]?.message?.content || "Sorry, I couldn't process that.";
      console.log('Processed content:', content);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: content,
          direction: 'incoming',
          sender: "ChatGPT"
        }
      ]);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage = error.message.includes('API call failed') 
        ? "I'm having trouble connecting to my API. Please check the console for details and make sure the API key is correct."
        : "I apologize, but I encountered an error. Please try again.";
      
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: errorMessage,
          direction: 'incoming',
          sender: "ChatGPT"
        }
      ]);
    }

    setIsTyping(false);
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      return {
        role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
        content: messageObject.message
      };
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { role: "system", content: "I'm an AI assistant for Givify, a platform that connects donors with verified NGOs. I can help users find NGOs, understand their work, and guide them through the donation process. I have knowledge about various NGO categories including Education, Animals, Health, and Environment." },
        ...apiMessages
      ],
      "temperature": 0.7,
      "max_tokens": 150,
      "presence_penalty": 0,
      "frequency_penalty": 0
    };
    
    console.log('Request body:', apiRequestBody);

    try {
      console.log('Making API request with key:', API_KEY.substring(0, 10) + '...');
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });
      
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        let errorMessage = 'An error occurred while processing your request.';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        
        throw new Error(`API call failed: ${errorMessage}`);
      }

      const jsonResponse = await response.json();
      console.log('Successful response:', jsonResponse);
      return jsonResponse;
    } catch (error) {
      console.error('Detailed error in API call:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      throw error;
    }
  }

  const sendTestMessage = () => {
    handleSend("What NGO categories are available?");
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", width: "400px", height: "500px" }}>
      <button 
        onClick={sendTestMessage}
        style={{
          position: "absolute",
          top: "-40px",
          right: "0",
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Test Chat
      </button>
      <MainContainer>
        <ChatContainer>
          <MessageList 
            scrollBehavior="smooth" 
            typingIndicator={isTyping ? <TypingIndicator content="AI is typing" /> : null}
          >
            {messages.map((message, i) => {
              return <Message key={i} model={message} />;
            })}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chatbot;