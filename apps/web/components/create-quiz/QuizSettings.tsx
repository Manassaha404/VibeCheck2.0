"use client";

import React from "react";
import { Lock, Settings, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/store/quizStore";

export default function QuizSettings() {
  const globalSettings = useQuizStore((s) => s.globalSettings);
  const setGlobalSettings = useQuizStore((s) => s.setGlobalSettings);
  const applyGlobalToAllQuestions = useQuizStore(
    (s) => s.applyGlobalToAllQuestions,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Security */}
      <section className="bg-canvas-cream border-4 border-ink-charcoal shadow-hard p-6 md:p-8 flex flex-col gap-6 relative">
        <div className="absolute -top-4 -right-4 bg-electric-sun text-ink-charcoal font-label-md text-label-md uppercase px-4 py-1 border-2 border-ink-charcoal transform rotate-3 flex items-center gap-1">
          <Lock size={16} /> Security
        </div>
        <div className="flex items-center justify-between mt-4 bg-pure-white p-4 border-2 border-ink-charcoal">
          <span className="font-headline-sm text-headline-sm font-bold">
            Password Protect
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              className="sr-only peer neubrutal-toggle"
              id="toggle-password"
              type="checkbox"
              checked={globalSettings.passwordProtect}
              onChange={(e) =>
                setGlobalSettings({ passwordProtect: e.target.checked })
              }
            />
            <div
              className={`w-16 h-8 border-2 border-ink-charcoal peer-focus:outline-none rounded-none shadow-hard-sm relative transition-colors ${globalSettings.passwordProtect ? "bg-leaf-green" : "bg-surface-container-highest"}`}
            >
              <div
                className={`absolute top-[2px] bg-ink-charcoal border-2 border-ink-charcoal h-6 w-7 transition-transform ${globalSettings.passwordProtect ? "translate-x-[26px] left-[2px]" : "left-[2px]"}`}
              />
            </div>
          </label>
        </div>

        <AnimatePresence>
          {globalSettings.passwordProtect && (
            <motion.div
              key="pwd-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 overflow-hidden"
            >
              <label
                className="font-label-md text-label-md uppercase"
                htmlFor="quiz-pwd"
              >
                Set Password
              </label>
              <input
                className="w-full bg-pure-white border-2 border-ink-charcoal p-3 font-body-lg text-body-lg focus:outline-none focus:border-electric-sun shadow-hard-sm"
                id="quiz-pwd"
                placeholder="Enter secret code..."
                type="password"
                value={globalSettings.password}
                onChange={(e) =>
                  setGlobalSettings({ password: e.target.value })
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Global Rules */}
      <section className="bg-canvas-cream border-4 border-ink-charcoal shadow-hard p-6 md:p-8 flex flex-col gap-6 relative">
        <div className="absolute -top-4 -left-4 bg-leaf-green text-ink-charcoal font-label-md text-label-md uppercase px-4 py-1 border-2 border-ink-charcoal transform -rotate-3 flex items-center gap-1">
          <Settings size={16} /> Global Rules
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <label
            className="font-headline-sm text-headline-sm font-bold flex justify-between"
            htmlFor="global-time"
          >
            Time per Question
            <span className="text-on-surface-variant font-body-md font-normal ml-2">
              (Secs)
            </span>
          </label>
          <input
            className="w-full bg-pure-white border-2 border-ink-charcoal p-3 font-headline-md text-headline-md text-center focus:outline-none focus:border-electric-sun shadow-hard-sm"
            id="global-time"
            type="number"
            value={globalSettings.defaultTimeLimit}
            onChange={(e) =>
              setGlobalSettings({ defaultTimeLimit: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex flex-col gap-3">
          <label
            className="font-headline-sm text-headline-sm font-bold flex justify-between"
            htmlFor="global-points"
          >
            Points per Answer
          </label>
          <input
            className="w-full bg-pure-white border-2 border-ink-charcoal p-3 font-headline-md text-headline-md text-center focus:outline-none focus:border-electric-sun shadow-hard-sm"
            id="global-points"
            type="number"
            value={globalSettings.defaultPoints}
            onChange={(e) =>
              setGlobalSettings({ defaultPoints: Number(e.target.value) })
            }
          />
        </div>

        {/* ── Auto-sync toggle ── */}
        <div className="flex items-center justify-between bg-pure-white p-4 border-2 border-ink-charcoal">
          <div className="flex flex-col gap-0.5">
            <span className="font-headline-sm text-headline-sm font-bold">
              Auto-sync All Questions
            </span>
            <span className="text-xs text-outline font-medium">
              Changes here instantly update every card
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              className="sr-only peer"
              id="toggle-sync"
              type="checkbox"
              checked={globalSettings.syncAllQuestions}
              onChange={(e) =>
                setGlobalSettings({ syncAllQuestions: e.target.checked })
              }
            />
            <div
              className={`w-16 h-8 border-2 border-ink-charcoal peer-focus:outline-none rounded-none shadow-hard-sm relative transition-colors ${globalSettings.syncAllQuestions ? "bg-vivid-coral" : "bg-surface-container-highest"}`}
            >
              <div
                className={`absolute top-[2px] bg-ink-charcoal border-2 border-ink-charcoal h-6 w-7 transition-transform ${globalSettings.syncAllQuestions ? "translate-x-[26px] left-[2px]" : "left-[2px]"}`}
              />
            </div>
          </label>
        </div>

        {/* ── Bonus Points toggle ── */}
        <div className="flex items-center justify-between bg-pure-white p-4 border-2 border-ink-charcoal">
          <div className="flex flex-col gap-0.5 pr-4">
            <span className="font-headline-sm text-headline-sm font-bold">
              Enable Speed Bonus
            </span>
            <span className="text-xs text-outline font-medium">
              Faster answers score more points
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              className="sr-only peer"
              id="toggle-bonus"
              type="checkbox"
              checked={globalSettings.isBonusPointsEnabled}
              onChange={(e) =>
                setGlobalSettings({ isBonusPointsEnabled: e.target.checked })
              }
            />
            <div
              className={`w-16 h-8 border-2 border-ink-charcoal peer-focus:outline-none rounded-none shadow-hard-sm relative transition-colors ${globalSettings.isBonusPointsEnabled ? "bg-vivid-coral" : "bg-surface-container-highest"}`}
            >
              <div
                className={`absolute top-[2px] bg-ink-charcoal border-2 border-ink-charcoal h-6 w-7 transition-transform ${globalSettings.isBonusPointsEnabled ? "translate-x-[26px] left-[2px]" : "left-[2px]"}`}
              />
            </div>
          </label>
        </div>

        {/* ── Manual apply-to-all button ── */}
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97, x: 3, y: 3 }}
          onClick={applyGlobalToAllQuestions}
          className="flex items-center justify-center gap-2 w-full py-3 px-5 bg-ink-charcoal text-pure-white
            font-black text-sm uppercase tracking-widest border-2 border-ink-charcoal
            shadow-[4px_4px_0px_0px_#8ED462] hover:shadow-[6px_6px_0px_0px_#8ED462]
            active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
        >
          <Zap size={16} strokeWidth={3} />
          Apply to All Questions
        </motion.button>
      </section>
    </div>
  );
}
