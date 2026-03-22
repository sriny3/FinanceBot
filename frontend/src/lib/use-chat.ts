import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export function useChat() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load threads from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('finbot_threads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setThreads(parsed);
        if (parsed.length > 0) {
          setCurrentThreadId(parsed[0].id);
        }
      } catch (e) {}
    }
  }, []);

  // Save to local storage when threads change
  useEffect(() => {
    localStorage.setItem('finbot_threads', JSON.stringify(threads));
  }, [threads]);

  const currentThread = threads.find(t => t.id === currentThreadId) || { messages: [] };

  const createNewThread = () => {
    const newThread: Thread = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      updatedAt: Date.now()
    };
    setThreads(prev => [newThread, ...prev]);
    setCurrentThreadId(newThread.id);
  };

  const sendMessage = async (content: string) => {
    if (!currentThreadId && threads.length === 0) {
      createNewThread();
    }
    
    // We need the most recent state
    setIsLoading(true);

    let activeId = currentThreadId;
    setThreads(prev => {
      let updated = [...prev];
      if (updated.length === 0 || (!currentThreadId)) {
        activeId = uuidv4();
        updated = [{ id: activeId, title: content.slice(0, 30) + '...', messages: [], updatedAt: Date.now() }, ...updated];
        setCurrentThreadId(activeId);
      }
      
      return updated.map(t => {
        if (t.id === activeId) {
          return {
            ...t,
            title: t.messages.length === 0 ? content.slice(0, 30) + '...' : t.title,
            messages: [...t.messages, { role: 'user', content }],
            updatedAt: Date.now(),
          };
        }
        return t;
      });
    });

    try {
      // Small timeout to allow state to settle
      await new Promise(r => setTimeout(r, 50));
      
      const requestThreads = JSON.parse(localStorage.getItem('finbot_threads') || '[]');
      const threadToUse = requestThreads.find((t: Thread) => t.id === activeId) || { messages: [] };
      const currentMessages = [...threadToUse.messages, { role: 'user', content }];
      
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages })
      });

      if (response.ok) {
        const data = await response.json();
        setThreads(prev => prev.map(t => {
          if (t.id === activeId) {
            return {
              ...t,
              messages: [...t.messages, { role: 'assistant', content: data.message }],
              updatedAt: Date.now(),
            };
          }
          return t;
        }));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    threads,
    currentThreadId,
    currentThread,
    setCurrentThreadId,
    createNewThread,
    sendMessage,
    isLoading
  };
}
