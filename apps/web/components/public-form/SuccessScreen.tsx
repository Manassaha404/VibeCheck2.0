import React, { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";

export function SuccessScreen({
  formTitle,
  onReset,
}: {
  formTitle: string;
  onReset?: () => void;
}) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[var(--color-electric-sun)] border-[3px] border-[var(--color-ink-charcoal)] shadow-hard-lg w-full p-6 sm:p-10 md:p-16 text-center relative z-10 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[500px] animate-pop-in overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => {
            const colors = [
              "bg-[var(--color-leaf-green)]",
              "bg-[var(--color-ink-charcoal)]",
              "bg-white",
              "bg-[var(--color-electric-sun)]",
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const style = {
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animation: `float-down ${1 + Math.random() * 2}s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            };
            return (
              <div
                key={i}
                className={`absolute w-3 h-3 border-[2px] border-[var(--color-ink-charcoal)] ${color}`}
                style={style as any}
              />
            );
          })}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes float-down {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
            }
          `,
            }}
          />
        </div>
      )}

      <div className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-white rounded-full border-[3px] border-[var(--color-ink-charcoal)] shadow-hard mb-4 sm:mb-6 md:mb-8 flex items-center justify-center relative overflow-hidden z-10">
        <img
          alt="Success Character"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuANPyV4wpwOZUvSFL2zgjivHmETl20S4kuhw7yukjLrYHNBMEokQqoXwtSJgFY5UJdE0XimXaz5mlpjRm6u9jrjX69nxfELRd9KEK_YH1T9xP3MYSqagQs13urVBN3Fwf4RkqG3Ar-8HetvwVKQ_fwaLrmnyl0E5b4K3RaUJ3iSnx3mWd8LBK-XDRybxLsomA4JeLPUFBiYF5AkJPqgJiI_etgrERlBd_vHxMc0ZNb7jMz_xZaf5rnNriWdXcvfTkd7tD79Tw0FU94"
        />
      </div>

      <h2 className="font-display-lg text-[var(--color-ink-charcoal)] mb-3 sm:mb-4" style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}>
        You Rock!
      </h2>

      <p className="font-headline-sm text-[var(--color-ink-charcoal)] max-w-md mx-auto mb-6 sm:mb-10 opacity-90 leading-relaxed text-sm sm:text-base">
        Your response to <strong>"{formTitle}"</strong> has been successfully
        submitted. Thanks for helping out!
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="w-full sm:w-auto bg-white text-[var(--color-ink-charcoal)] font-headline-sm text-sm sm:text-headline-sm py-3 sm:py-4 px-6 sm:px-8 border-[3px] border-[var(--color-ink-charcoal)] shadow-hard hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-none transition-all flex items-center justify-center gap-2 sm:gap-3 z-10"
        >
          <RefreshCcw size={20} strokeWidth={3} />
          Submit Another
        </button>
      )}
    </div>
  );
}
