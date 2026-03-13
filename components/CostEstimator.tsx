"use client";

import { X, DollarSign, Zap, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CostEstimatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CostEstimator({ isOpen, onClose }: CostEstimatorProps) {
  const estimates = [
    {
      size: "Small Scan",
      repos: "2-5 Repositories",
      tokens: "~2,000 tokens",
      costMini: "$0.0003",
      costPremium: "$0.006",
      desc: "Fast, high-level appraisal of your most recent work."
    },
    {
      size: "Medium Scan",
      repos: "10 Repositories",
      tokens: "~10,000 tokens",
      costMini: "$0.0015",
      costPremium: "$0.030",
      desc: "Comprehensive logic sweep across your portfolio."
    },
    {
      size: "Deep Scan",
      repos: "20+ Repositories",
      tokens: "~50,000+ tokens",
      costMini: "$0.0075",
      costPremium: "$0.150",
      desc: "Ruthless architectural audit for serious indie hackers."
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">The HiddenMRR Token Saver Guarantee</h3>
                  <p className="text-sm text-emerald-500/60 font-medium">Built to protect your API wallet</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              <div className="p-6 rounded-[2rem] bg-emerald-500/[0.02] border border-emerald-500/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Smart Meta-Filter Active</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  Other tools blindly send gigabytes of raw code to LLMs, costing you dollars per scan. 
                  <span className="text-white"> Our Smart Filter strictly extracts high-signal metadata</span> (README.md, package.json) to keep your costs negligible.
                </p>
              </div>

              {/* Massive Math Example */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600">The Math</h4>
                  <div className="space-y-3 font-mono">
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>10 Repositories</span>
                      <span className="text-zinc-600">+</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>GPT-4o Mini</span>
                      <span className="text-white">~15k Tokens</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-white">Estimated Scan Cost</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 text-center shadow-3xl">
                  <span className="text-6xl font-black text-emerald-400 tracking-tighter drop-shadow-2xl mb-1">
                    {"<$0.01"}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/40">Total per scan</span>
                </div>
              </div>

              {/* Legend Replacement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <p className="text-[11px] text-zinc-300 font-bold">Mini Models</p>
                  <p className="text-[10px] text-zinc-600 leading-relaxed">Perfect for large scans. Virtually free to run.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <p className="text-[11px] text-zinc-300 font-bold">Pro Models</p>
                  <p className="text-[10px] text-zinc-600 leading-relaxed">Deep reasoning for complex logic scans.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
               <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">
                Zero Hidden Fees. 100% BYOK Transparency.
               </p>
               <button 
                onClick={onClose}
                className="w-full md:w-auto px-8 py-4 rounded-xl bg-white text-black text-xs font-black uppercase tracking-[0.1em] hover:bg-zinc-200 transition-colors shadow-2xl"
               >
                Keep Tokens Safe
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
