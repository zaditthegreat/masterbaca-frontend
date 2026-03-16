import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import { assessmentService } from '../services/assessmentService';
import { ArrowLeft, Send, Users, Info, ChevronRight, CheckCircle2, Clock, Sparkles, Brain, Trophy, Check } from 'lucide-react';
import AssesmentBriefing from '../components/AssesmentBriefing';

const AssessmentPhase = ({ groupId, bookTitle, onComplete }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(null);
    const scrollRef = useRef();

    useEffect(() => {
        // Start assessment by calling interact with empty conversation
        startAssessment();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const startAssessment = async () => {
        setLoading(true);
        try {
            const data = await assessmentService.interactAssessment(groupId, { conversation: [] });
            if (data.question) {
                setMessages([{ role: 'assistant', content: data.question.text }]);
            }
        } catch (error) {
            console.error("Assessment start failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || loading) return;

        const userMsg = { role: 'user', content: inputText };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInputText('');
        setLoading(true);

        try {
            // Format for API: array of {question: string, answer: string}
            const formattedHistory = [];
            for (let i = 0; i < updatedMessages.length; i += 2) {
                if (updatedMessages[i] && updatedMessages[i + 1]) {
                    formattedHistory.push({
                        question: updatedMessages[i].content,
                        answer: updatedMessages[i + 1].content
                    });
                }
            }

            const data = await assessmentService.interactAssessment(groupId, { conversation: formattedHistory });

            if (data.is_complete) {
                setIsFinished(true);
                setScore(data.score);
            } else if (data.question) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.question.text }]);
            }
        } catch (error) {
            console.error("Assessment interaction failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (isFinished) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-white font-sans">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/10 animate-bounce">
                    <Trophy size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 font-display uppercase tracking-tight">Assessment Complete!</h2>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm font-medium">You've successfully completed the reading assessment for <span className="text-primary font-bold">{bookTitle}</span>.</p>

                <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl w-full max-w-xs mb-10 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Final Score</p>
                    <div className="text-6xl font-black text-slate-900 font-display italic">
                        {score !== null ? <span>{score}<span className="text-primary">/100</span></span> : 'Processing...'}
                    </div>
                </div>

                <button
                    onClick={onComplete}
                    className="w-full max-w-xs bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
                >
                    Back to Groups
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-slate-900 text-white font-sans overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                    <Brain size={28} />
                </div>
                <div>
                    <h3 className="text-lg font-black font-display uppercase tracking-tight leading-none italic">AI Examiner</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Status: Interactive Assessment</p>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-3xl shadow-2xl ${m.role === 'user'
                            ? 'bg-primary text-white rounded-tr-none'
                            : 'bg-white/5 backdrop-blur-md border border-white/10 text-white/90 rounded-tl-none leading-relaxed'
                            }`}>
                            <p className="text-sm font-medium">{m.content}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 p-4 rounded-2xl flex gap-1.5 border border-white/5">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-slate-900 border-t border-white/5">
                <div className="flex gap-3 items-center bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-primary/50 transition-all">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Answer the AI question..."
                        className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none font-medium text-white"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || loading}
                        className={`p-3 rounded-xl transition-all shadow-lg flex items-center justify-center ${!inputText.trim() || loading
                            ? 'bg-white/5 text-white/20'
                            : 'bg-primary text-white hover:bg-primary/90 active:scale-90'
                            }`}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ChatRoom = ({ groupId, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [groupDetail, setGroupDetail] = useState(null);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Assessment related states
    const [groupStatus, setGroupStatus] = useState('waiting'); // waiting, starting, assessment, finished
    const [isFinished, setIsFinished] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [activeMembers, setActiveMembers] = useState([]);
    const [isBriefingOpen, setIsBriefingOpen] = useState(false);
    const [finishedCount, setFinishedCount] = useState(0);
    const [totalMembers, setTotalMembers] = useState(0);

    const scrollRef = useRef();
    const pollingRef = useRef();

    useEffect(() => {
        fetchInitialData();
        startPolling();
        return () => stopPolling();
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchInitialData = async () => {
        try {
            const detail = await chatService.getGroupDetail(groupId);
            setGroupDetail(detail);
        } catch (error) {
            console.error("Failed to fetch group detail:", error);
        }
    };

    const startPolling = () => {
        pollMessages();
        pollingRef.current = setInterval(pollMessages, 15000);
    };

    const stopPolling = () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
    };

    const pollMessages = async () => {
        try {
            const data = await chatService.getMessages(groupId);

            // Handle the detailed sync structure from the API
            if (data.sync) {
                const { group, isEveryoneReady } = data.sync;
                const members = group.ReadingGroupMembers || [];

                setMessages(data.messages || []);
                setGroupStatus(group.assessmentStatus || 'waiting');

                // Update active/online members for the UI
                setActiveMembers(members);

                // Calculate readiness progress
                const finished = members.filter(m => m.isFinished).length;
                setFinishedCount(finished);
                setTotalMembers(members.length);

                // Auto-sync local state with server state for the current user
                const authUser = JSON.parse(localStorage.getItem('user'));
                const me = members.find(m => m.id === authUser?.id);
                if (me?.isFinished) {
                    setIsFinished(true);
                } else {
                    setIsFinished(false);
                }

                // Handle countdown for starting phase
                if (group.assessmentStatus === 'starting') {
                    // Determine countdown from server data if available
                    setCountdown(data.countdown || 5);
                } else {
                    setCountdown(null);
                }
            } else if (Array.isArray(data)) {
                setMessages(data);
            } else {
                setMessages(data.messages || []);
                setGroupStatus(data.assessmentStatus || 'waiting');
                if (data.isFinished) setIsFinished(true);
            }
        } catch (error) {
            console.error("Polling failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || sending) return;
        setSending(true);
        try {
            await chatService.sendMessage(groupId, inputText);
            setInputText('');
            pollMessages();
        } catch (error) {
            console.error("Send failed:", error);
        } finally {
            setSending(false);
        }
    };

    const handleFinish = () => {
        setIsBriefingOpen(true);
    };

    const handleConfirmFinish = async () => {
        setIsBriefingOpen(false);
        try {
            await assessmentService.finishReading(groupId);
            setIsFinished(true);
            pollMessages();
        } catch (error) {
            console.error("Finish failed:", error);
        }
    };

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    if (loading && !groupDetail) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If assessment stage is active, render the exam UI
    if (groupStatus === 'assessment') {
        return (
            <AssessmentPhase
                groupId={groupId}
                bookTitle={groupDetail?.book?.title}
                onComplete={onBack}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                            <img
                                src={groupDetail?.book?.cover_url || 'https://via.placeholder.com/50'}
                                alt="Book"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-900 leading-tight text-sm uppercase tracking-tight font-display">{groupDetail?.book?.title || 'Book Discussion'}</h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`flex h-1.5 w-1.5 rounded-full ${activeMembers.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeMembers.length} Members Active</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <Info size={20} />
                </button>
            </header>

            {/* Assessment Starting Notification */}
            {countdown !== null && (
                <div className="bg-slate-900 text-white p-3 flex items-center justify-center gap-3 shadow-lg z-30">
                    <Sparkles size={18} className="text-primary animate-spin" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] italic">
                        Assessment loading in <span className="text-primary">{countdown}s</span>... Ready up!
                    </span>
                </div>
            )}

            {/* Chat Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-white"
            >
                <div className="text-center py-6">
                    <span className="bg-slate-50 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border border-slate-100">
                        Group created on {new Date(groupDetail?.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {messages.map((msg, idx) => {
                    const authUser = JSON.parse(localStorage.getItem('user'));
                    const isMe = msg.senderId === authUser?.id;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group mb-2`}>
                            <div className={`max-w-[75%] flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                {!isMe && (
                                    <div className="w-8 h-8 rounded-lg bg-slate-200 overflow-hidden shrink-0 mt-1 shadow-sm">
                                        {msg.User?.avatar_url ? (
                                            <img src={msg.User.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-[10px] font-bold">
                                                {msg.User?.name?.[0] || 'U'}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    {!isMe && <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">{msg.User?.name}</span>}
                                    <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    <div className={`text-[9px] text-slate-300 font-medium ${isMe ? 'text-right mr-1' : 'text-left ml-1'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Assessment State UI bottom panel */}
            <div className="p-4 bg-white border-t border-slate-100 sticky bottom-0 z-20 shadow-[0_-10px_20px_-3px_rgba(0,0,0,0.03)]">
                {groupStatus === 'waiting' && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-primary" />
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Discussion Phase</span>
                            </div>
                            <div className="flex -space-x-2">
                                {activeMembers.slice(0, 3).map((m, i) => (
                                    <div key={i} className={`w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm`}>
                                        {m.avatar_url ? <img src={m.avatar_url} className="w-full h-full object-cover" /> : <span className="text-[8px] font-bold">{m.name?.[0]}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {!isFinished ? (
                            <button
                                onClick={handleFinish}
                                className="w-full bg-slate-900 hover:bg-black text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                            >
                                <span>I'm Ready to Test</span>
                                <ChevronRight size={16} />
                            </button>
                        ) : (
                            <div className="w-full bg-emerald-50 text-emerald-600 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-emerald-100">
                                <CheckCircle2 size={16} />
                                <span>Waiting for Others ({finishedCount}/{totalMembers})</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-200/50 focus-within:border-primary/30 transition-all">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={groupStatus !== 'waiting'}
                        placeholder={groupStatus === 'waiting' ? "Discuss with your group..." : "Chat locked for exam"}
                        className="flex-1 bg-transparent px-4 py-2.5 text-sm focus:outline-none font-medium text-slate-700 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || sending || groupStatus !== 'waiting'}
                        className={`p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center ${!inputText.trim() || sending || groupStatus !== 'waiting'
                            ? 'bg-slate-200 text-white shadow-none'
                            : 'bg-primary text-white hover:bg-primary/90 active:scale-90 scale-100'
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            <AssesmentBriefing
                isOpen={isBriefingOpen}
                onClose={() => setIsBriefingOpen(false)}
                onConfirm={handleConfirmFinish}
                groupTitle={groupDetail?.book?.title}
            />
        </div>
    );
};

export default ChatRoom;
