"use client";

import React, { useRef } from "react";
import {
  Circle,
  Clock,
  Star,
  Trash2,
  X,
  Edit3,
  Plus,
  CheckCircle2,
  GripVertical,
  ImagePlus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  XCircle,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  Reorder,
  useDragControls,
} from "framer-motion";
import {
  useQuizStore,
  type QuizOption,
  type QuestionType,
  type Question,
} from "@/store/quizStore";
import { useCloudinaryUpload } from "@/hook/uploads/useCloudinaryUpload";

interface QuestionCardProps {
  questionId: string;
  number: number;
}

/* Accent colours cycling per card number */
const BADGE_ACCENTS = [
  {
    bg: "bg-electric-sun",
    border: "border-ink-charcoal",
    text: "text-ink-charcoal",
  },
  {
    bg: "bg-vivid-coral",
    border: "border-ink-charcoal",
    text: "text-pure-white",
  },
  {
    bg: "bg-leaf-green",
    border: "border-ink-charcoal",
    text: "text-ink-charcoal",
  },
  {
    bg: "bg-sky-blue",
    border: "border-ink-charcoal",
    text: "text-ink-charcoal",
  },
  {
    bg: "bg-lavender",
    border: "border-ink-charcoal",
    text: "text-ink-charcoal",
  },
];

const OPTION_COLORS = [
  { idle: "bg-electric-sun/20", active: "bg-electric-sun", tag: "A" },
  { idle: "bg-vivid-coral/20", active: "bg-vivid-coral", tag: "B" },
  { idle: "bg-leaf-green/20", active: "bg-leaf-green", tag: "C" },
  { idle: "bg-sky-blue/20", active: "bg-sky-blue", tag: "D" },
  { idle: "bg-lavender/20", active: "bg-lavender", tag: "E" },
  { idle: "bg-mint/20", active: "bg-mint", tag: "F" },
];

export default function QuestionCard({
  questionId,
  number,
}: QuestionCardProps) {
  const question = useQuizStore((s) =>
    s.questions.find((q) => q.id === questionId),
  );
  const updateQuestion = useQuizStore((s) => s.updateQuestion);
  const removeQuestion = useQuizStore((s) => s.removeQuestion);
  const addOption = useQuizStore((s) => s.addOption);
  const removeOption = useQuizStore((s) => s.removeOption);
  const updateOption = useQuizStore((s) => s.updateOption);
  const toggleCorrectOption = useQuizStore((s) => s.toggleCorrectOption);
  const reorderOptions = useQuizStore((s) => s.reorderOptions);

  const {
    upload,
    status: uploadStatus,
    progress,
    error: uploadError,
    reset: resetUpload,
  } = useCloudinaryUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await upload(file, "quiz_media");
    if (result) {
      updateQuestion(questionId, { mediaUrl: result.secureUrl });
    }
    // Reset the input so the same file can be re-selected
    e.target.value = "";
  };

  const [focused, setFocused] = React.useState(false);
  const articleRef = useRef<HTMLElement>(null);

  // Guard: question may have been removed
  if (!question) return null;

  const badge =
    BADGE_ACCENTS[(number - 1) % BADGE_ACCENTS.length] ?? BADGE_ACCENTS[0]!;

  const handleTypeChange = (t: QuestionType) => {
    if (t === "text_entry") {
      updateQuestion(questionId, {
        type: t,
        points: 0,
        allowMultipleCorrect: false,
      });
    } else {
      updateQuestion(questionId, { type: t, allowMultipleCorrect: true });
    }
  };
  const handleCollapse = () =>
    updateQuestion(questionId, { collapsed: !question.collapsed });
  const handleDelete = () => removeQuestion(questionId);

  return (
    <motion.article
      ref={articleRef as React.Ref<HTMLElement>}
      layout
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className={`relative bg-pure-white border-4 border-ink-charcoal transition-all duration-300
        ${
          focused
            ? "shadow-[8px_8px_0px_0px_#2C2E2A]"
            : "shadow-hard hover:shadow-[8px_8px_0px_0px_#2C2E2A] hover:-translate-y-0.5"
        }`}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setFocused(false);
      }}
    >
      {/* ── Animated top accent stripe ── */}
      <motion.div
        className="h-1.5 w-full"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(90deg, #8ED462, #F5E211, #FF6B6B, #4FC3F7, #C084FC, #8ED462)",
          backgroundSize: "300% 100%",
        }}
      />

      {/* ── Number badge ── */}
      <motion.div
        whileHover={{ rotate: 15, scale: 1.18 }}
        transition={{ type: "spring", stiffness: 350, damping: 12 }}
        className={`absolute -left-5 -top-5 w-14 h-14 ${badge.bg} ${badge.border} border-4 rounded-full
          flex items-center justify-center text-xl font-black shadow-hard-sm z-20 -rotate-6 select-none cursor-default`}
      >
        <span className={badge.text}>{number}</span>
      </motion.div>

      {/* ── Header ── */}
      <div className="border-b-4 border-ink-charcoal bg-surface-container-low px-5 py-3 flex flex-wrap gap-3 items-center justify-between">
        {/* Type pill toggle */}
        <div className="flex border-2 border-ink-charcoal bg-canvas-cream shadow-hard-sm overflow-hidden relative">
          {(["multiple_choice", "text_entry"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              className={`relative px-4 py-2 text-xs font-black uppercase tracking-widest flex items-center gap-2 z-10 transition-colors duration-150
                ${question.type === t ? "text-pure-white" : "text-ink-charcoal hover:bg-canvas-cream"}`}
            >
              {question.type === t && (
                <motion.div
                  layoutId={`pill-bg-${questionId}`}
                  className="absolute inset-0 bg-ink-charcoal"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {t === "multiple_choice" ? (
                  <Circle
                    size={14}
                    className={question.type === t ? "fill-white" : ""}
                  />
                ) : (
                  <Edit3 size={14} />
                )}
                {t === "multiple_choice" ? "Multiple Choice" : "Text Entry"}
              </span>
            </button>
          ))}
        </div>

        {/* Right: time / points / multi-correct / collapse / delete */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time */}
          <div className="group flex items-center gap-1.5 border-2 border-ink-charcoal px-3 py-1.5 bg-pure-white shadow-hard-sm focus-within:border-electric-sun transition-colors">
            <Clock size={15} className="text-outline shrink-0" />
            <input
              type="number"
              value={question.timeLimit}
              onChange={(e) =>
                updateQuestion(questionId, {
                  timeLimit: Number(e.target.value),
                })
              }
              className="w-9 bg-transparent text-center font-black text-sm focus:outline-none"
            />
            <span className="text-xs text-outline font-semibold">s</span>
          </div>

          {/* Points (Only for Multiple Choice and Single Choice) */}
          {question.type === "multiple_choice" && (
            <>
              <div className="group flex items-center gap-1.5 border-2 border-ink-charcoal px-3 py-1.5 bg-pure-white shadow-hard-sm focus-within:border-electric-sun transition-colors">
                <Star size={15} className="text-outline shrink-0" />
                <input
                  type="number"
                  value={question.points}
                  onChange={(e) =>
                    updateQuestion(questionId, {
                      points: Number(e.target.value),
                    })
                  }
                  className="w-9 bg-transparent text-center font-black text-sm focus:outline-none"
                />
                <span className="text-xs text-outline font-semibold">pts</span>
              </div>

              {/* Multi/Single Toggle */}
              <button
                onClick={() =>
                  updateQuestion(questionId, {
                    allowMultipleCorrect: !question.allowMultipleCorrect,
                  })
                }
                className={`group flex items-center gap-1.5 border-2 border-ink-charcoal px-3 py-1.5 shadow-hard-sm transition-colors text-xs font-black uppercase tracking-widest
                  ${question.allowMultipleCorrect ? "bg-vivid-coral text-pure-white" : "bg-pure-white text-ink-charcoal hover:bg-canvas-cream"}`}
                title={
                  question.allowMultipleCorrect
                    ? "Multiple correct answers allowed"
                    : "Only one correct answer allowed"
                }
              >
                <CheckCircle2 size={15} className="shrink-0" />
                {question.allowMultipleCorrect ? "Multi" : "Single"}
              </button>
            </>
          )}

          {/* Collapse */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleCollapse}
            className="border-2 border-ink-charcoal p-1.5 bg-pure-white shadow-hard-sm hover:bg-canvas-cream transition-colors"
            title={question.collapsed ? "Expand" : "Collapse"}
          >
            {question.collapsed ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronUp size={18} />
            )}
          </motion.button>

          {/* Delete */}
          <motion.button
            whileHover={{ rotate: -8, scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            onClick={handleDelete}
            className="border-2 border-transparent hover:border-ink-charcoal p-1.5 text-error hover:bg-vivid-coral hover:text-pure-white hover:shadow-hard-sm transition-all"
            title="Delete question"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>

      {/* ── Body ── */}
      <AnimatePresence initial={false}>
        {!question.collapsed && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 38 }}
            className="overflow-hidden"
          >
            <div className="p-6 md:p-8 flex flex-col gap-7">
              {/* Question textarea */}
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-full bg-ink-charcoal group-focus-within:animate-color-shift transition-all" />
                <textarea
                  rows={2}
                  placeholder="Type your question here…"
                  className="w-full pl-5 pr-4 py-4 bg-surface-container-low border-2 border-ink-charcoal font-black text-xl text-ink-charcoal
                    placeholder:text-outline/50 placeholder:font-normal resize-none focus:outline-none focus:bg-canvas-cream
                    focus:border-electric-sun transition-all rounded-sm shadow-hard-sm"
                  value={question.text}
                  onChange={(e) =>
                    updateQuestion(questionId, { text: e.target.value })
                  }
                />
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-3 right-3 text-outline/30"
                >
                  <Sparkles size={20} />
                </motion.span>
              </div>

              {/* ── Media attach / preview ── */}
              <div className="flex flex-col gap-2">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Uploaded image preview */}
                <AnimatePresence>
                  {question.mediaUrl && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="relative group rounded-sm overflow-hidden border-2 border-ink-charcoal shadow-hard-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={question.mediaUrl}
                        alt="Question media"
                        className="w-full max-h-56 object-contain bg-surface-container-low"
                      />
                      {/* Remove button overlay */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          updateQuestion(questionId, { mediaUrl: undefined });
                          resetUpload();
                        }}
                        className="absolute top-2 right-2 bg-ink-charcoal text-pure-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-hard-sm"
                        title="Remove media"
                      >
                        <XCircle size={18} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Upload progress bar */}
                <AnimatePresence>
                  {(uploadStatus === "signing" ||
                    uploadStatus === "uploading") && (
                    <motion.div
                      key="progress"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col gap-1.5 overflow-hidden"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-outline uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Loader2 size={13} className="animate-spin" />
                          {uploadStatus === "signing"
                            ? "Preparing…"
                            : `Uploading ${progress}%`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-high border border-ink-charcoal rounded-none overflow-hidden">
                        <motion.div
                          className="h-full bg-ink-charcoal"
                          animate={{
                            width: `${uploadStatus === "signing" ? 5 : progress}%`,
                          }}
                          transition={{ ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error banner */}
                <AnimatePresence>
                  {uploadStatus === "error" && uploadError && (
                    <motion.div
                      key="err"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-xs font-semibold text-error border border-error/30 bg-error/5 px-3 py-2 rounded-sm"
                    >
                      <XCircle size={14} /> {uploadError}
                      <button
                        onClick={resetUpload}
                        className="ml-auto underline text-error"
                      >
                        Dismiss
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Trigger button — only shown if no media yet and not uploading */}
                {!question.mediaUrl &&
                  uploadStatus !== "uploading" &&
                  uploadStatus !== "signing" && (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-3 w-full border-2 border-dashed border-ink-charcoal/40 py-3 px-4
                      text-outline font-semibold text-sm uppercase tracking-wider hover:border-ink-charcoal
                      hover:bg-canvas-cream hover:text-ink-charcoal transition-all rounded-sm"
                    >
                      <ImagePlus size={18} />
                      Attach image or media (optional)
                    </motion.button>
                  )}
              </div>

              {/* ── Multiple Choice / Single Choice ── */}
              <AnimatePresence mode="wait">
                {question.type === "multiple_choice" ? (
                  <motion.div
                    key="mc"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col gap-3"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-outline flex items-center gap-2">
                      <CheckCircle2 size={13} />
                      {question.type === "multiple_choice" &&
                      question.allowMultipleCorrect
                        ? "Select all correct answers"
                        : "Select the correct answer"}
                    </p>

                    <Reorder.Group
                      axis="y"
                      values={question.options}
                      onReorder={(opts) => reorderOptions(questionId, opts)}
                      className="flex flex-col gap-3"
                    >
                      <AnimatePresence>
                        {question.options.map((option, index) => (
                          <OptionItem
                            key={option.id}
                            option={option}
                            index={index}
                            questionId={questionId}
                            question={question}
                            updateOption={updateOption}
                            removeOption={removeOption}
                            toggleCorrectOption={toggleCorrectOption}
                          />
                        ))}
                      </AnimatePresence>
                    </Reorder.Group>

                    {question.options.length < 6 && (
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => addOption(questionId)}
                        className="self-start flex items-center gap-2 px-5 py-2.5 border-2 border-ink-charcoal bg-electric-sun
                          font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#2C2E2A]
                          hover:bg-leaf-green active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
                      >
                        <Plus size={16} strokeWidth={3} /> Add option
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  /* ── Text Entry ── */
                  <motion.div
                    key="te"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col gap-5"
                  >
                    {/* Preview box */}
                    <div className="relative border-4 border-dashed border-ink-charcoal bg-canvas-cream p-8 flex flex-col items-center justify-center gap-3 rounded-sm overflow-hidden">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 22,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute -right-5 -bottom-5 opacity-[0.06]"
                      >
                        <Edit3 size={96} strokeWidth={1.5} />
                      </motion.div>
                      <span className="font-black text-outline/60 text-sm uppercase tracking-widest">
                        Text input preview
                      </span>
                      <div className="w-full max-w-sm h-11 border-2 border-outline/30 bg-pure-white rounded-sm shadow-hard-sm flex items-center px-4 text-outline/40 text-sm font-medium">
                        Participant types here…
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function OptionItem({
  option,
  index,
  questionId,
  question,
  updateOption,
  removeOption,
  toggleCorrectOption,
}: {
  option: QuizOption;
  index: number;
  questionId: string;
  question: Question;
  updateOption: (qId: string, oId: string, p: Partial<QuizOption>) => void;
  removeOption: (qId: string, oId: string) => void;
  toggleCorrectOption: (qId: string, oId: string) => void;
}) {
  const controls = useDragControls();
  const col = OPTION_COLORS[index % OPTION_COLORS.length] ?? OPTION_COLORS[0]!;

  return (
    <Reorder.Item value={option} dragListener={false} dragControls={controls}>
      <motion.div
        layout
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className="flex items-stretch gap-3 group"
      >
        {/* Drag grip */}
        <div
          onPointerDown={(e) => controls.start(e)}
          style={{ touchAction: "none" }}
          className="flex items-center px-1 cursor-grab active:cursor-grabbing text-outline/40 hover:text-outline transition-colors"
        >
          <GripVertical size={18} />
        </div>

        {/* Radio / Checkbox */}
        <button
          onClick={() => toggleCorrectOption(questionId, option.id)}
          title={option.isCorrect ? "Unmark as correct" : "Mark as correct"}
          className={`flex-shrink-0 w-9 h-9 self-center ${
            question.allowMultipleCorrect ? "rounded-sm" : "rounded-full"
          } border-3 border-ink-charcoal transition-all duration-200 flex items-center justify-center
            ${
              option.isCorrect
                ? "bg-leaf-green shadow-hard-sm"
                : "bg-pure-white hover:bg-canvas-cream shadow-hard-sm"
            }`}
        >
          <AnimatePresence mode="wait">
            {option.isCorrect && (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 600, damping: 20 }}
              >
                <CheckCircle2
                  size={18}
                  className="text-ink-charcoal fill-ink-charcoal/10"
                  strokeWidth={3}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Input */}
        <div
          className={`flex-grow flex items-stretch border-3 border-ink-charcoal overflow-hidden
          transition-all duration-200 rounded-sm
          ${
            option.isCorrect
              ? "shadow-[4px_4px_0px_0px_#2C2E2A] ring-2 ring-leaf-green/60"
              : "shadow-hard-sm focus-within:ring-2 focus-within:ring-electric-sun/60"
          }`}
        >
          <span
            className={`w-14 shrink-0 flex items-center justify-center font-black text-sm border-r-3 border-ink-charcoal transition-colors
            ${option.isCorrect ? col.active : col.idle}`}
          >
            {col.tag}
          </span>
          <input
            type="text"
            value={option.text}
            onChange={(e) =>
              updateOption(questionId, option.id, { text: e.target.value })
            }
            placeholder="Answer option…"
            className="flex-grow px-4 py-3 bg-transparent font-semibold text-base focus:outline-none placeholder:text-outline/40"
          />
          {option.isCorrect && (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              className="flex items-center gap-1 pr-4 text-xs font-black uppercase tracking-wider text-leaf-green whitespace-nowrap"
            >
              <CheckCircle2 size={13} strokeWidth={3} /> Correct
            </motion.span>
          )}
        </div>

        {/* Remove */}
        {question.options.length > 2 && (
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => removeOption(questionId, option.id)}
            className="self-center opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full text-outline hover:text-error hover:bg-error/10"
          >
            <X size={18} />
          </motion.button>
        )}
      </motion.div>
    </Reorder.Item>
  );
}
