"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, Plus, MessageSquare, Bot, User } from 'lucide-react'
import { useChat } from '@/lib/use-chat'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ChatPage() {
  const { threads, currentThreadId, currentThread, setCurrentThreadId, createNewThread, sendMessage, isLoading } = useChat()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentThread?.messages])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            FinBot
          </h1>
        </div>
        <div className="p-4">
          <Button onClick={createNewThread} className="w-full gap-2 shadow-sm" variant="outline">
            <Plus className="w-4 h-4" /> New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2 space-y-2">
          {threads.map(thread => (
            <button
              key={thread.id}
              onClick={() => setCurrentThreadId(thread.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                currentThreadId === thread.id 
                  ? 'bg-slate-100 dark:bg-slate-800 font-medium shadow-sm' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="truncate">{thread.title}</span>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex items-center px-4 md:hidden">
            <h1 className="font-bold text-lg flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              FinBot
            </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-6 pb-28">
            {!currentThread || currentThread.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full mt-32 text-slate-500 animate-in fade-in zoom-in duration-500">
                <Bot className="w-16 h-16 text-blue-600/50 mb-4" />
                <h2 className="text-2xl font-semibold mb-2 text-slate-700 dark:text-slate-300">Welcome to FinBot</h2>
                <p className="text-center max-w-md">I am an expert equity research analyst. Ask me about stock fundamentals, valuation signals, or market news.</p>
              </div>
            ) : (
              currentThread.messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  {msg.role === 'assistant' && (
                    <Avatar className="w-8 h-8 border border-blue-200 bg-blue-50 mt-1">
                      <AvatarImage src="/bot-avatar.png" />
                      <AvatarFallback><Bot className="w-4 h-4 text-blue-600" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div 
                    className={`rounded-2xl px-5 py-4 max-w-[85%] ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm shadow-md' 
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
                    ) : (
                      <div className="prose prose-slate prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-headings:font-semibold">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <Avatar className="w-8 h-8 border border-slate-200 mt-1">
                      <AvatarFallback><User className="w-4 h-4 text-slate-600" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-4 justify-start animate-in fade-in duration-300">
                <Avatar className="w-8 h-8 border border-blue-200 bg-blue-50 mt-1">
                  <AvatarFallback><Bot className="w-4 h-4 text-blue-600" /></AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-tl-sm px-5 py-4 bg-white dark:bg-slate-800 border border-slate-200 shadow-sm flex items-center">
                  <div className="flex space-x-1.5 items-center justify-center h-4">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-slate-950 dark:via-slate-950 p-4 pt-10">
          <div className="max-w-3xl mx-auto relative flex items-center shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:ring-2 ring-blue-600/50 transition-all">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask FinBot about any stock..."
              className="resize-none border-0 focus-visible:ring-0 shadow-none min-h-[60px] max-h-32 py-4 pl-5 pr-14 bg-transparent text-[15px]"
              rows={1}
            />
            <Button 
              size="icon" 
              className="absolute right-3 bottom-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors h-9 w-9"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
          <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">FinBot can make mistakes. Always verify financial information.</p>
        </div>
      </div>
    </div>
  )
}
