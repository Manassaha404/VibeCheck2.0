"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bot, Sparkles, Cpu, Check, Zap, MessageSquare } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AVATAR_COLORS = [
  "var(--color-leaf-green)",
  "var(--color-sky-blue)",
  "var(--color-tangerine)",
  "var(--color-vivid-coral)",
  "var(--color-lavender)",
  "var(--color-mint)",
];

const aiFeatures = [
  {
    title: "Form Builder Agent",
    description:
      "Describe what you need and watch a complete, production-ready form materialize in seconds. No drag-and-drop required.",
    icon: <Sparkles size={32} />,
    color: "var(--color-electric-sun)",
    id: "ai-form-builder",
    command: "build me a lead-gen form with 5 fields",
    demo: "form" as const,
  },
  {
    title: "Quiz Builder Agent",
    description:
      "Turn any topic, document, or prompt into an engaging, scored quiz or personality test instantly.",
    icon: <Bot size={32} />,
    color: "var(--color-sky-blue)",
    id: "ai-quiz-builder",
    command: "turn this PDF into a 10-question quiz",
    demo: "quiz" as const,
  },
  {
    title: "Form Respondent Agent",
    description:
      "A friendly conversational interviewer that talks naturally with respondents to collect answers one question at a time.",
    icon: <MessageSquare size={32} />,
    color: "var(--color-lavender)",
    id: "ai-respondent",
    command: "interview respondent to collect fields",
    demo: "respondent" as const,
  },
];

export default function AiFeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          full: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const conditions = context.conditions as { reduce: boolean };
          const reduce = conditions.reduce;

          gsap.fromTo(
            ".ai-header-item",
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: reduce ? 0.01 : 0.8,
              stagger: reduce ? 0 : 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
              },
            },
          );

          if (reduce) {
            gsap.set(".ai-terminal, .ai-card, .ai-demo, .ai-terminal-line", {
              opacity: 1,
              y: 0,
              scale: 1,
              clearProps: "transform",
            });
            gsap.set(".ai-demo-fill", { width: "100%" });
            gsap.set(".ai-demo-chat-bubble", { scale: 1, opacity: 1 });
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".ai-terminal",
              start: "top 78%",
              once: true,
            },
          });

          tl.fromTo(
            ".ai-terminal",
            { opacity: 0, y: 40, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
          )
            .fromTo(
              ".ai-terminal-avatar",
              { scale: 0, rotate: -60 },
              { scale: 1, rotate: 0, duration: 0.45, ease: "back.out(3)" },
              "-=0.2",
            )
            .fromTo(
              ".ai-terminal-pulse-ring",
              { scale: 1, opacity: 0.9 },
              {
                scale: 2.6,
                opacity: 0,
                duration: 1,
                repeat: 1,
                ease: "power1.out",
              },
              "-=0.15",
            )
            .to(".ai-typing-dots", { opacity: 1, duration: 0.2 })
            .to(".ai-typing-dots", { opacity: 0, duration: 0.2, delay: 0.45 });

          const lines = gsap.utils.toArray<HTMLElement>(".ai-terminal-line");
          lines.forEach((line, i) => {
            const fullText = line.getAttribute("data-text") || "";
            const chars = fullText.split("");
            line.textContent = "";

            tl.to(line, { opacity: 1, duration: 0.01 });

            const typeState = { count: 0 };
            tl.to(typeState, {
              count: chars.length,
              duration: Math.min(chars.length * 0.026, 1),
              ease: "none",
              onUpdate: () => {
                line.textContent = chars
                  .slice(0, Math.round(typeState.count))
                  .join("");
              },
            });

            tl.fromTo(
              `.ai-card-${i}`,
              {
                y: 100,
                opacity: 0,
                scale: 0.8,
                rotate: i % 2 === 0 ? -5 : 5,
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
                duration: 0.7,
                ease: "back.out(1.8)",
              },
              "-=0.05",
            )
              .fromTo(
                `.ai-card-${i} .ai-icon`,
                { scale: 0, rotate: -180 },
                { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(3)" },
                "-=0.5",
              )
              .fromTo(
                `.ai-card-${i} .ai-demo`,
                { opacity: 0 },
                { opacity: 1, duration: 0.25 },
                "-=0.15",
              );

            const demoKind = aiFeatures[i]?.demo;

            if (demoKind === "form") {
              tl.fromTo(
                `.ai-card-${i} .ai-demo-fill`,
                { width: "0%" },
                { width: "100%", duration: 0.6, ease: "power2.out" },
              ).fromTo(
                `.ai-card-${i} .ai-demo-check`,
                { scale: 0 },
                { scale: 1, duration: 0.35, ease: "back.out(4)" },
              );
            }

            if (demoKind === "quiz") {
              tl.fromTo(
                `.ai-card-${i} .ai-demo-option`,
                { x: -14, opacity: 0 },
                {
                  x: 0,
                  opacity: 1,
                  duration: 0.25,
                  stagger: 0.12,
                  ease: "power2.out",
                },
              ).fromTo(
                `.ai-card-${i} .ai-demo-option--correct .ai-demo-option-dot`,
                { scale: 0 },
                { scale: 1, duration: 0.3, ease: "back.out(4)" },
                "-=0.1",
              );
            }

            if (demoKind === "respondent") {
              tl.fromTo(
                `.ai-card-${i} .ai-demo-chat-agent`,
                { scale: 0, opacity: 0, transformOrigin: "bottom left" },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.3,
                  ease: "back.out(3)",
                },
              );
              tl.fromTo(
                `.ai-card-${i} .ai-demo-chat-user`,
                { scale: 0, opacity: 0, transformOrigin: "bottom right" },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.3,
                  ease: "back.out(3)",
                },
                "+=0.2",
              );
            }

            tl.to({}, { duration: 0.12 });
          });

          gsap.utils.toArray<HTMLElement>(".ai-sparkle").forEach((el, i) => {
            gsap.to(el, {
              y: "-=16",
              x: i % 2 === 0 ? "+=8" : "-=8",
              rotate: 25,
              duration: 2.2 + (i % 3) * 0.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.2,
            });
          });
        },
      );

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  const handleMouseEnter = (e: React.MouseEvent, index: number) => {
    const card = e.currentTarget as HTMLElement;
    const icon = card.querySelector(".ai-icon");

    gsap.to(card, {
      y: -8,
      x: -4,
      scale: 1.02,
      rotate: index % 2 === 0 ? 1 : -1,
      boxShadow: `12px 12px 0px 0px ${aiFeatures[index]?.color || "var(--color-ink-charcoal)"}`,
      duration: 0.4,
      ease: "back.out(2)",
    });

    if (icon) {
      gsap.to(icon, {
        rotate: 15,
        scale: 1.15,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent, index: number) => {
    const card = e.currentTarget as HTMLElement;
    const icon = card.querySelector(".ai-icon");

    gsap.to(card, {
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      boxShadow: `8px 8px 0px 0px var(--color-ink-charcoal)`,
      duration: 0.5,
      ease: "power3.out",
    });

    if (icon) {
      gsap.to(icon, { rotate: 0, scale: 1, duration: 0.4, ease: "power3.out" });
    }
  };

  return (
    <section
      id="ai-features"
      className="border-y-4 border-[var(--color-ink-charcoal)] py-24 overflow-hidden theme-transition"
      style={{ backgroundColor: "var(--color-canvas-cream)" }}
      aria-labelledby="ai-features-heading"
      ref={containerRef}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div
            className="ai-header-item inline-block bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)] border-2 border-[var(--color-ink-charcoal)] px-4 py-1.5 rounded-full text-label-md font-bold shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] mb-6"
            style={{ opacity: 0 }}
          >
            NEW: VibeCheck AI ✨
          </div>
          <h2
            id="ai-features-heading"
            className="ai-header-item text-headline-lg font-display font-black text-[var(--color-ink-charcoal)] mb-6 leading-tight"
            style={{ opacity: 0 }}
          >
            Built by you. <br className="hidden sm:block" />
            <span className="bg-[var(--color-electric-sun)] px-3 rounded-lg border-2 border-[var(--color-ink-charcoal)] inline-block -rotate-1 mt-2 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]">
              Powered by AI Agents.
            </span>
          </h2>
          <p
            className="ai-header-item text-body-lg text-[var(--color-ink-charcoal)] font-semibold opacity-90"
            style={{ opacity: 0 }}
          >
            Let our intelligent agents do the heavy lifting. Build, test, and
            analyze on autopilot so you can focus on the vibes.
          </p>
        </div>

        <div className="ai-terminal" style={{ opacity: 0 }}>
          <Zap
            className="ai-sparkle"
            size={16}
            style={{ top: 12, right: 40 }}
          />
          <Sparkles
            className="ai-sparkle"
            size={14}
            style={{ bottom: 16, left: 28 }}
          />
          <div className="ai-terminal-header">
            <div className="ai-terminal-avatar-wrap">
              <span className="ai-terminal-pulse-ring" />
              <span className="ai-terminal-avatar">
                <Bot size={18} />
              </span>
            </div>
            <span className="ai-terminal-title">VibeCheck Agent</span>
            <span className="ai-terminal-status">
              <span className="ai-terminal-status-dot" />
              <span className="ai-terminal-status-label">Live</span>
            </span>
          </div>
          <div className="ai-terminal-body">
            <span className="ai-typing-dots" style={{ opacity: 0 }}>
              <span />
              <span />
              <span />
            </span>
            {aiFeatures.map((feature) => (
              <span
                key={feature.id}
                className="ai-terminal-line"
                data-text={`> ${feature.command}`}
              />
            ))}
          </div>
        </div>

        <div className="ai-cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {aiFeatures.map((feature, i) => (
            <div
              key={feature.id}
              onMouseEnter={(e) => handleMouseEnter(e, i)}
              onMouseLeave={(e) => handleMouseLeave(e, i)}
              className={`ai-card ai-card-${i} bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] p-6 sm:p-8 rounded-2xl flex flex-col relative group cursor-pointer`}
              style={{
                boxShadow: `8px 8px 0px 0px var(--color-ink-charcoal)`,
                opacity: 0, // prevents FOUC
              }}
            >
              <div
                className="ai-icon w-16 h-16 rounded-xl border-4 border-[var(--color-ink-charcoal)] flex items-center justify-center mb-6 shadow-hard-sm"
                style={{ backgroundColor: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="text-headline-sm font-display font-black text-[var(--color-ink-charcoal)] mb-4">
                {feature.title}
              </h3>
              <p className="text-body-lg font-semibold text-[var(--color-on-surface-variant)] mb-6">
                {feature.description}
              </p>

              <div className="ai-demo">
                {feature.demo === "form" && (
                  <>
                    <p className="ai-demo-label">Generating field</p>
                    <div className="ai-demo-input">
                      <div className="ai-demo-fill" />
                      <span className="ai-demo-check">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    </div>
                  </>
                )}

                {feature.demo === "quiz" && (
                  <>
                    <p className="ai-demo-label">Question 1 of 10</p>
                    <div className="ai-demo-option">
                      <span className="ai-demo-option-dot" />
                      Paris
                    </div>
                    <div className="ai-demo-option">
                      <span className="ai-demo-option-dot" />
                      Berlin
                    </div>
                    <div className="ai-demo-option ai-demo-option--correct">
                      <span className="ai-demo-option-dot">
                        <Check size={9} strokeWidth={4} />
                      </span>
                      Madrid
                    </div>
                  </>
                )}

                {feature.demo === "respondent" && (
                  <>
                    <p className="ai-demo-label">Collecting answer</p>
                    <div className="flex flex-col gap-2 mt-2 w-full">
                      <div className="bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] rounded-xl rounded-bl-none p-2 sm:p-3 text-[11px] font-bold text-[var(--color-ink-charcoal)] self-start max-w-[90%] sm:max-w-[85%] shadow-[2px_2px_0px_0px_var(--color-ink-charcoal)] ai-demo-chat-bubble ai-demo-chat-agent">
                        How are you feeling today? 😊
                      </div>
                      <div className="bg-[var(--color-electric-sun)] border-2 border-[var(--color-ink-charcoal)] rounded-xl rounded-br-none p-2 sm:p-3 text-[11px] font-bold text-[var(--color-ink-charcoal)] self-end max-w-[90%] sm:max-w-[85%] shadow-[2px_2px_0px_0px_var(--color-ink-charcoal)] ai-demo-chat-bubble ai-demo-chat-user mt-1">
                        I'm doing great!
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
