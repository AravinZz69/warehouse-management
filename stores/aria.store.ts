import { create } from 'zustand';
import { ARIADecision, ARIASummary } from '@/types/aria.types';
import { INITIAL_ARIA_DECISIONS, INITIAL_ARIA_SUMMARIES } from '@/lib/supabase/mock-db';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'aria';
  text: string;
  timestamp: string;
  sqlHint?: string;
  actions?: string[];
}

interface ARIAState {
  decisions: ARIADecision[];
  summaries: ARIASummary[];
  chatHistory: ChatMessage[];
  isAnalyzing: boolean;
  pulseScore: number;
  addDecision: (decision: ARIADecision) => void;
  updateDecisionStatus: (id: string, status: ARIADecision['execution_status']) => void;
  addSummary: (summary: ARIASummary) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setAnalyzing: (loading: boolean) => void;
  setPulseScore: (score: number) => void;
}

export const useARIAStore = create<ARIAState>((set) => ({
  decisions: INITIAL_ARIA_DECISIONS,
  summaries: INITIAL_ARIA_SUMMARIES,
  chatHistory: [
    {
      id: 'chat-01',
      sender: 'aria',
      text: 'ARIA Terminal v5.0 online. Telemetry sync active. Enter query or trigger autonomous audit.',
      timestamp: new Date().toISOString(),
    },
  ],
  isAnalyzing: false,
  pulseScore: 92,
  addDecision: (decision) =>
    set((state) => ({ decisions: [decision, ...state.decisions] })),
  updateDecisionStatus: (id, status) =>
    set((state) => ({
      decisions: state.decisions.map((d) =>
        d.id === id ? { ...d, execution_status: status, executed_at: new Date().toISOString() } : d
      ),
    })),
  addSummary: (summary) =>
    set((state) => ({ summaries: [summary, ...state.summaries] })),
  addChatMessage: (msg) =>
    set((state) => ({
      chatHistory: [
        ...state.chatHistory,
        {
          ...msg,
          id: `msg-${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
      ],
    })),
  setAnalyzing: (loading) => set({ isAnalyzing: loading }),
  setPulseScore: (score) => set({ pulseScore: score }),
}));
