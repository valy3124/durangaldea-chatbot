import { useState } from 'react';
import { useImmer } from 'use-immer';
import api from '@/api';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import firstImage from '@/assets/images/firstImage.png';

function Chatbot() {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useImmer([]);
  const [newMessage, setNewMessage] = useState('');

  const isLoading = messages.length && messages[messages.length - 1].loading;

  async function submitNewMessage() {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || isLoading) return;

    setMessages(draft => [...draft,
      { role: 'user', content: trimmedMessage },
      { role: 'assistant', content: '', sources: [], loading: true }
    ]);
    setNewMessage('');

    try {
      if (!chatId) {
        const { id } = await api.createChat();
        setChatId(id);
      }

      const response = await api.sendChatMessage(null, trimmedMessage);
      setMessages(draft => {
        draft[draft.length - 1].content = response.paraphrased_response;
        draft[draft.length - 1].loading = false;
      });

          } catch (err) {
            console.log(err);
            setMessages(draft => {
              draft[draft.length - 1].loading = false;
              draft[draft.length - 1].error = true;
            });
          }
        }

  return (
    <div className='relative grow flex flex-col gap-6 pt-6'>
      {messages.length === 0 && (
        <div className='relative w-full h-screen overflow-hidden'>
          <img 
            src={firstImage} 
            alt='Chatbot Introduction' 
            className='absolute inset-0 w-full h-full object-cover' 
          />
        </div>
      )}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
      />
      <ChatInput
        newMessage={newMessage}
        isLoading={isLoading}
        setNewMessage={setNewMessage}
        submitNewMessage={submitNewMessage}
      />
    </div>
  );
}

export default Chatbot;
