import React, { useEffect } from 'react';
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface';
import { useAppStore } from '@/store/useAppStore';
import { dummyChatSessions } from '@/data/dummyData';

export const Chat: React.FC = () => {
  const { currentSession, setCurrentSession, sessions, addSession } = useAppStore();

  useEffect(() => {
    // Initialize with dummy data if no sessions exist
    if (sessions.length === 0) {
      dummyChatSessions.forEach(session => addSession(session));
    }
    
    // Set current session if none selected
    if (!currentSession && sessions.length > 0) {
      setCurrentSession(sessions[0]);
    }
  }, [sessions, currentSession, setCurrentSession, addSession]);

  return (
    <div className="h-full w-full">
      <div className="h-full rounded-lg sm:rounded-2xl border border-slate-200/50 bg-white/50 backdrop-blur-sm shadow-lg sm:shadow-xl dark:border-slate-700/50 dark:bg-slate-900/50 overflow-hidden">
        <EnhancedChatInterface />
      </div>
    </div>
  );
};