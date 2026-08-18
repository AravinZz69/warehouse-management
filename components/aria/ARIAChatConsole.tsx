'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useARIAStore } from '@/stores/aria.store';
import { Terminal, Send, Sparkles, RefreshCw } from 'lucide-react';
import { runGeminiJSON } from '@/lib/gemini/client';
import { buildQueryPrompt } from '@/lib/gemini/prompts';
import { OperationalQueryOutputSchema } from '@/lib/gemini/schemas';

export const ARIAChatConsole: React.FC = () => {
  const { chatHistory, addChatMessage } = useARIAStore();
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    addChatMessage({ sender: 'user', text });
    setInputQuery('');
    setLoading(true);

    try {
      const prompt = buildQueryPrompt(text, { warehouse: 'Chicago Alpha', active_skus: 5, pending_orders: 3 });
      const res = await runGeminiJSON(prompt, OperationalQueryOutputSchema.parse);

      addChatMessage({
        sender: 'aria',
        text: res.answer,
        sqlHint: res.sql_hint,
        actions: res.recommended_actions,
      });
    } catch (err) {
      console.error('ARIA terminal query error:', err);
      addChatMessage({
        sender: 'aria',
        text: 'Error processing operational query. Telemetry channel active.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl border border-slate-200 dark:border-purple-900/60 bg-white dark:bg-[#080C14] text-slate-900 dark:text-slate-100 shadow-sm dark:shadow-2xl overflow-hidden font-sans">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-900/40 bg-slate-50 dark:bg-[#0D131F] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
            ARIA OPERATIONAL QUERY TERMINAL v5.0
          </span>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          CONNECTED
        </span>
      </div>

      {/* Terminal Output Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-3xl rounded-xl p-3.5 ${
              msg.sender === 'user'
                ? 'ml-auto bg-blue-50 dark:bg-sky-950/80 border border-blue-200 dark:border-sky-800 text-blue-900 dark:text-sky-200 font-medium'
                : 'mr-auto bg-slate-50 dark:bg-[#0D131F] border border-slate-200 dark:border-purple-900/40 text-slate-800 dark:text-slate-200 font-medium'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-semibold">
              <span>{msg.sender === 'user' ? 'OPERATOR' : 'ARIA AI'}</span>
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

            {msg.sqlHint && (
              <div className="mt-2 p-2.5 rounded-lg bg-slate-900 text-blue-400 border border-slate-800 text-[11px] font-mono">
                <span className="text-[9px] text-slate-400 uppercase block mb-0.5">Generated SQL Query:</span>
                <code>{msg.sqlHint}</code>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="mr-auto flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 bg-slate-50 dark:bg-[#0D131F] p-3 rounded-xl border border-slate-200 dark:border-purple-900/40">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Analyzing warehouse telemetry & running query...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 bg-slate-50 dark:bg-[#0D131F] border-t border-slate-100 dark:border-purple-900/30 text-[11px]">
        <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">Sample Queries:</span>
        <button
          type="button"
          onClick={() => handleSend('Which SKUs are at stockout risk?')}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-purple-700 dark:text-purple-300 hover:border-purple-500 transition shrink-0 font-medium"
        >
          Which SKUs are at stockout risk?
        </button>
        <button
          type="button"
          onClick={() => handleSend('Show active wave picking SLA bottlenecks')}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-purple-700 dark:text-purple-300 hover:border-purple-500 transition shrink-0 font-medium"
        >
          SLA Bottlenecks
        </button>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center border-t border-slate-100 dark:border-purple-900/40 bg-white dark:bg-[#0D131F] p-3"
      >
        <span className="text-purple-600 dark:text-purple-400 mr-2 font-bold">&gt;</span>
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask ARIA terminal (e.g. 'Draft restock PO for TechMart', 'Run cycle count check')..."
          className="flex-1 bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none font-medium"
        />
        <button
          type="submit"
          disabled={loading}
          className="ml-2 rounded-xl bg-purple-600 hover:bg-purple-700 p-2.5 text-white transition disabled:opacity-50 shadow-xs"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
