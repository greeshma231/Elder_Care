import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  MessageCircle,
  Loader2,
  Plus,
  Clock,
  Smile,
  Meh,
  Frown,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mitra';
  timestamp: Date;
  hasAudio?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  lastUpdated: Date;
  mood: 'happy' | 'neutral' | 'sad';
  messages: Message[];
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const ChatAssistant: React.FC = () => {
  const [currentSessionId, setCurrentSessionId] = useState<string>('1');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Mitra',
      lastUpdated: new Date(),
      mood: 'happy',
      messages: [
        {
          id: '1',
          text: "Hi, I'm Mitra, your AI companion. I'm here to support you with reminders, wellness, or just a friendly chat. How can I help you today?",
          sender: 'mitra',
          timestamp: new Date(),
          hasAudio: true
        }
      ]
    },
    {
      id: '2',
      title: 'Mitra – June 20, 2025',
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
      mood: 'neutral',
      messages: [
        {
          id: '1',
          text: "Hi, I'm Mitra, your AI companion. I'm here to support you with reminders, wellness, or just a friendly chat. How can I help you today?",
          sender: 'mitra',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          hasAudio: true
        },
        {
          id: '2',
          text: "How are my medications today?",
          sender: 'user',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
        },
        {
          id: '3',
          text: "Let me check your medication schedule for today. You have three medications scheduled: Amlodipine at 8 AM (completed), Metformin at 12 PM (upcoming), and Lisinopril at 6 PM (scheduled). You're doing great staying on track!",
          sender: 'mitra',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 6 * 60 * 1000),
          hasAudio: true
        }
      ]
    },
    {
      id: '3',
      title: 'Mitra – June 19, 2025',
      lastUpdated: new Date(Date.now() - 48 * 60 * 60 * 1000),
      mood: 'sad',
      messages: [
        {
          id: '1',
          text: "Hi, I'm Mitra, your AI companion. I'm here to support you with reminders, wellness, or just a friendly chat. How can I help you today?",
          sender: 'mitra',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
          hasAudio: true
        },
        {
          id: '2',
          text: "I'm feeling a bit lonely today",
          sender: 'user',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000 + 10 * 60 * 1000),
        },
        {
          id: '3',
          text: "I'm sorry to hear you're feeling lonely. That's completely understandable, and I'm here with you. Would you like to talk about what's on your mind, or perhaps I could suggest some activities that might help you feel more connected?",
          sender: 'mitra',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000 + 11 * 60 * 1000),
          hasAudio: true
        }
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get current session
  const currentSession = chatSessions.find(session => session.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //Ensure recognitionRef is set when component mounts
  useEffect(() => {
  if (!SpeechRecognition) {
    console.warn("Speech Recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Indian English tone
    recognition.interimResults = true; // results as you speak
    recognition.continuous = true;     // along with smart silence detection
  

    recognitionRef.current = recognition;
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    // Update current session with new message
    setChatSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? { 
            ...session, 
            messages: [...session.messages, userMessage],
            lastUpdated: new Date()
          }
        : session
    ));

    setInputText('');
    setIsTyping(true);
    setApiError(null);

    try {
      console.log('🤖 Sending message to chat API...');
      
      // Send message to our backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Received response from chat API');

      const mitraResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message || "I'm here to help you. How can I assist you today?",
        sender: 'mitra',
        timestamp: new Date(),
        hasAudio: true
      };

      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, mitraResponse],
              lastUpdated: new Date()
            }
          : session
      ));

    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      
      // Set error message for user
      setApiError(error.message || 'Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. If the problem persists, please contact your caregiver for assistance.",
        sender: 'mitra',
        timestamp: new Date(),
        hasAudio: true
      };

      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, errorMessage],
              lastUpdated: new Date()
            }
          : session
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setTranscription('');
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      return;
    }

    setIsListening(true);
    setTranscription('Listening...');

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');

      setTranscription(transcript);
      setInputText(transcript);

      // 🔁 Reset silence timer on every speech result
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
        setIsListening(false);
        setTranscription('');
        console.log('Stopped due to silence');
      }, 3000); // ⏱️ 3s silence threshold (adjust if needed)
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setTranscription('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleTextToSpeech = (text: string) => {
  const voices = speechSynthesis.getVoices();
  
  // Primary: Try Heera
  const heeraVoice = voices.find(v => v.name.includes("Heera"));
  
  // Fallback: If Heera not found, try Samantha or Alex (Mac)
  const fallbackVoice = voices.find(v => v.name.includes("Samantha") || v.name.includes("Alex"));

  let selectedVoice: SpeechSynthesisVoice | null = null;

  if (heeraVoice) {
    selectedVoice = heeraVoice;
  } else if (fallbackVoice) {
    console.warn("Heera voice not found, using fallback voice:", fallbackVoice.name);
    selectedVoice = fallbackVoice;
  } else {
    console.warn("No suitable voice found on this system. Using default voice.");
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice || null;
  utterance.pitch = 1.8; // enthusiastic and warm
  utterance.rate = 0.9;  // reassuring pace

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};



  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const startNewChat = () => {
    // Check if current chat has unsaved messages
    const currentMessages = currentSession?.messages || [];
    if (currentMessages.length > 1) {
      setShowSaveModal(true);
    } else {
      createNewChat();
    }
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Mitra – ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      lastUpdated: new Date(),
      mood: 'neutral',
      messages: [
        {
          id: '1',
          text: "Hi, I'm Mitra, your AI companion. I'm here to support you with reminders, wellness, or just a friendly chat. How can I help you today?",
          sender: 'mitra',
          timestamp: new Date(),
          hasAudio: true
        }
      ]
    };

    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setShowSaveModal(false);
    setApiError(null);
  };

  const switchToSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setApiError(null);
  };

  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    setShowDeleteModal(null);
    
    // If we deleted the current session, switch to the first available one
    if (sessionId === currentSessionId) {
      const remainingSessions = chatSessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <Smile size={16} className="text-green-600" aria-hidden="true" />;
      case 'sad':
        return <Frown size={16} className="text-red-600" aria-hidden="true" />;
      default:
        return <Meh size={16} className="text-gray-600" aria-hidden="true" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy':
        return 'border-l-green-400';
      case 'sad':
        return 'border-l-red-400';
      default:
        return 'border-l-gray-400';
    }
  };

  return (
    <main className="flex-1 ml-70 bg-eldercare-background flex" role="main" aria-label="Chat with Mitra">
      {/* Chat History Sidebar */}
      <aside 
        className={`bg-white border-r border-eldercare-primary/20 transition-all duration-300 flex-shrink-0 shadow-lg ${
          sidebarOpen ? 'w-80' : 'w-0'
        } overflow-hidden ${sidebarOpen ? 'relative' : 'absolute'} z-10 h-full`}
        role="complementary"
        aria-label="Chat history"
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-eldercare-primary/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-nunito font-bold text-eldercare-secondary">
                Past Conversations
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-eldercare-primary/10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary lg:hidden"
                aria-label="Close chat history"
              >
                <X size={20} className="text-eldercare-text" />
              </button>
            </div>
            
            {/* New Chat Button */}
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-xl font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
              aria-label="Start new conversation"
            >
              <Plus size={20} aria-hidden="true" />
              <span>Start New Chat</span>
            </button>
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-xl border-2 border-l-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                  session.id === currentSessionId
                    ? 'bg-eldercare-primary/10 border-eldercare-primary shadow-md'
                    : 'bg-eldercare-background/50 border-eldercare-primary/20 hover:border-eldercare-primary/40'
                } ${getMoodColor(session.mood)}`}
                onClick={() => switchToSession(session.id)}
                role="button"
                tabIndex={0}
                aria-label={`Switch to conversation from ${formatDate(session.lastUpdated)}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    switchToSession(session.id);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-opensans font-semibold text-eldercare-secondary text-sm truncate flex-1">
                    {session.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(session.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2"
                    aria-label={`Delete conversation from ${formatDate(session.lastUpdated)}`}
                    title="Delete conversation"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock size={12} className="text-eldercare-text-light" aria-hidden="true" />
                    <span className="text-xs font-opensans text-eldercare-text-light">
                      {formatDate(session.lastUpdated)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1" title={`Mood: ${session.mood}`}>
                    {getMoodIcon(session.mood)}
                  </div>
                </div>
                
                {/* Preview of last message */}
                {session.messages.length > 1 && (
                  <div className="mt-2 pt-2 border-t border-eldercare-primary/10">
                    <p className="text-xs font-opensans text-eldercare-text-light truncate">
                      {session.messages[session.messages.length - 1].text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header - Fixed and Compact */}
        <header className="flex-shrink-0 p-4 bg-eldercare-background border-b border-eldercare-primary/10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-eldercare-primary/10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary"
                aria-label={sidebarOpen ? "Close chat history" : "Open chat history"}
                title={sidebarOpen ? "Hide past conversations" : "Show past conversations"}
              >
                <Clock size={20} className="text-eldercare-primary" />
              </button>
              
              <div className="p-2 bg-eldercare-primary/10 rounded-full">
                <MessageCircle size={24} className="text-eldercare-primary" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-nunito font-bold text-eldercare-secondary">
                  {currentSession?.title || 'Mitra – Your AI Companion'}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                  <span className="text-base font-opensans text-eldercare-text">
                    Online & Ready to Help
                  </span>
                </div>
              </div>
            </div>
            
            {/* API Error Display */}
            {apiError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm font-opensans text-red-700">
                    <strong>Connection Issue:</strong> {apiError}
                  </p>
                  <button
                    onClick={() => setApiError(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Chat Container - Flexible */}
        <div className="flex-1 flex flex-col min-h-0 p-8">
          <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
            {/* Chat Window - Takes remaining space */}
            <div className="flex-1 bg-white rounded-xl shadow-md border border-eldercare-primary/10 flex flex-col overflow-hidden min-h-[600px]">
              {/* Messages Area - Scrollable */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-8 space-y-6" 
                role="log" 
                aria-live="polite" 
                aria-label="Chat messages"
                tabIndex={0}
                style={{ scrollBehavior: 'smooth' }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-lg px-6 py-4 rounded-2xl shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-orange-100 text-eldercare-secondary ml-6'
                          : 'bg-eldercare-sidebar text-eldercare-secondary mr-6'
                      }`}
                      role="article"
                      aria-label={`Message from ${message.sender === 'user' ? 'you' : 'Mitra'}`}
                    >
                      <p className="text-lg lg:text-xl font-opensans leading-relaxed mb-3 break-words">
                        {message.text}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-opensans text-eldercare-text-light">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.sender === 'mitra' && message.hasAudio && (
                          <button
                            onClick={() => handleTextToSpeech(message.text)}
                            className="ml-2 p-1 rounded-md hover:bg-eldercare-primary/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                            aria-label="Listen to this message"
                            title="Listen to this message"
                          >
                            <Volume2 size={14} className="text-eldercare-primary" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-eldercare-sidebar text-eldercare-secondary mr-6 px-6 py-4 rounded-2xl shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 size={16} className="animate-spin text-eldercare-primary" />
                        <span className="text-lg font-opensans">Mitra is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Voice Transcription Display */}
              {(isListening || transcription) && (
                <div className="px-8 py-4 bg-blue-50 border-t border-blue-100">
                  <div className="flex items-center space-x-2">
                    {isListening && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
                    )}
                    <span className="text-base font-opensans text-blue-700">
                      {isListening ? 'Listening...' : `Heard: "${transcription}"`}
                    </span>
                  </div>
                </div>
              )}

              {/* Input Area - Fixed at bottom */}
              <div className="flex-shrink-0 p-8 border-t border-eldercare-primary/10 bg-eldercare-background/30">
                <div className="flex items-end space-x-4">
                  {/* Text Input */}
                  <div className="flex-1">
                    <label htmlFor="message-input" className="sr-only">
                      Type your message
                    </label>
                    <input
                      ref={inputRef}
                      id="message-input"
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="w-full px-6 py-4 text-lg font-opensans border-2 border-eldercare-primary/20 rounded-xl focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 bg-white"
                      disabled={isListening || isTyping}
                    />
                  </div>

                  {/* Voice Input Button */}
                  <button
                    onClick={handleVoiceInput}
                    disabled={isTyping}
                    className={`min-w-[52px] min-h-[52px] p-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isListening
                        ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500 animate-pulse'
                        : 'bg-eldercare-primary hover:bg-eldercare-primary-dark focus:ring-eldercare-primary'
                    }`}
                    aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                    title={isListening ? 'Click to stop listening' : 'Click to use voice input'}
                  >
                    {isListening ? (
                      <MicOff size={24} className="text-white" aria-hidden="true" />
                    ) : (
                      <Mic size={24} className="text-white" aria-hidden="true" />
                    )}
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={() => handleSendMessage(inputText)}
                    disabled={!inputText.trim() || isListening || isTyping}
                    className="min-w-[52px] min-h-[52px] p-4 bg-eldercare-primary hover:bg-eldercare-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                    aria-label="Send message"
                    title="Send message"
                  >
                    <Send size={24} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Current Chat Modal */}
      {showSaveModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-modal-title"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Save size={24} className="text-eldercare-primary" aria-hidden="true" />
              <h3 id="save-modal-title" className="text-xl font-nunito font-bold text-eldercare-secondary">
                Start New Chat?
              </h3>
            </div>
            <p className="text-base font-opensans text-eldercare-text mb-6">
              You have an ongoing conversation. Your current chat will be automatically saved in your chat history.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-6 py-3 border-2 border-eldercare-primary text-eldercare-primary rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:bg-eldercare-primary/5"
              >
                Cancel
              </button>
              <button
                onClick={createNewChat}
                className="flex-1 px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
              >
                Start New Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 
              id="delete-modal-title"
              className="text-xl font-nunito font-bold text-eldercare-secondary mb-4"
            >
              Delete Conversation
            </h3>
            <p className="text-base font-opensans text-eldercare-text mb-6">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-eldercare-secondary rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-gray-300 focus:ring-offset-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSession(showDeleteModal)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};