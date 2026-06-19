import React from "react";
import { AlertTriangle, Clock, CheckCircle2, Edit2 } from "lucide-react";
import Link from "next/link";

export type FeedbackState = "expired" | "limit_reached" | "already_responded";

export function FeedbackScreen({
  state,
  allowEdit,
  onEdit,
}: {
  state: FeedbackState;
  allowEdit?: boolean;
  onEdit?: () => void;
}) {
  const config = {
    expired: {
      icon: <Clock size={48} className="text-[var(--color-ink-charcoal)]" />,
      title: "Form Expired",
      message: "This form is no longer accepting responses because it has passed its expiration date.",
      color: "bg-[var(--color-electric-sun)]",
    },
    limit_reached: {
      icon: <AlertTriangle size={48} className="text-[var(--color-ink-charcoal)]" />,
      title: "Limit Reached",
      message: "This form has reached its maximum number of responses and is now closed.",
      color: "bg-[#FF9B9B]",
    },
    already_responded: {
      icon: <CheckCircle2 size={48} className="text-[var(--color-ink-charcoal)]" />,
      title: "Already Responded",
      message: "You have already submitted a response to this form. Thank you!",
      color: "bg-[var(--color-leaf-green)]",
    },
  }[state];

  return (
    <div className="bg-white border-[3px] border-[var(--color-ink-charcoal)] shadow-hard-lg w-[90%] md:w-full max-w-md p-6 md:p-12 text-center relative z-10 flex flex-col items-center justify-center animate-pop-in mx-auto mt-12 md:mt-20">
      <div className={`w-24 h-24 ${config.color} rounded-full border-[3px] border-[var(--color-ink-charcoal)] shadow-hard mb-6 flex items-center justify-center animate-wiggle`}>
        {config.icon}
      </div>

      <h2 className="font-headline-lg text-[var(--color-ink-charcoal)] mb-3">{config.title}</h2>
      <p className="text-body-lg opacity-80 mb-8 leading-relaxed">
        {config.message}
      </p>

      {state === "already_responded" && allowEdit && onEdit && (
        <button
          onClick={onEdit}
          className="w-full bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-bold text-headline-sm py-4 px-8 border-[3px] border-[var(--color-ink-charcoal)] shadow-hard hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-none transition-all flex items-center justify-center gap-3"
        >
          <Edit2 size={24} strokeWidth={2.5} />
          Edit Response
        </button>
      )}
      
      {(!allowEdit || state !== "already_responded") && (
        <Link href="/" className="inline-block mt-4 text-[var(--color-ink-charcoal)] font-bold underline underline-offset-4 hover:text-[var(--color-electric-sun)] transition-colors">
          Return to VibeCheck
        </Link>
      )}
    </div>
  );
}
