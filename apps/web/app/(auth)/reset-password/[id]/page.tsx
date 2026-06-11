"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Mail,
  Key,
  Lock,
  RefreshCw,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";
import { useResetPassword } from "@/hook/auth/useResetPassword";

const inputColors = [
  "var(--color-electric-sun)",
  "var(--color-vivid-coral)",
  "var(--color-sky-blue)",
  "var(--color-mint)",
  "var(--color-lavender)",
  "var(--color-tangerine)",
];

const resetPasswordSchema = z
  .object({
    otp1: z.string().length(1),
    otp2: z.string().length(1),
    otp3: z.string().length(1),
    otp4: z.string().length(1),
    otp5: z.string().length(1),
    otp6: z.string().length(1),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
    setValue,
    watch,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    handleResetPassword,
    apiError,
    isSubmitting: isSubmittingApi,
  } = useResetPassword();

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpValues = [
    watch("otp1"),
    watch("otp2"),
    watch("otp3"),
    watch("otp4"),
    watch("otp5"),
    watch("otp6"),
  ];

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const val = e.target.value;
    if (val.length > 1) {
      e.target.value = val.slice(0, 1);
    }
    const fieldName = `otp${index + 1}` as keyof ResetPasswordFormValues;
    setValue(fieldName, e.target.value);

    if (e.target.value.length === 1 && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!id) return;
    const otp = `${data.otp1}${data.otp2}${data.otp3}${data.otp4}${data.otp5}${data.otp6}`;
    await handleResetPassword({ id, otp, newPassword: data.newPassword });
  };

  const otpError =
    errors.otp1 ||
    errors.otp2 ||
    errors.otp3 ||
    errors.otp4 ||
    errors.otp5 ||
    errors.otp6;

  return (
    <div className="bg-canvas-cream text-ink-charcoal min-h-screen flex items-center justify-center p-4 md:p-10 font-body-md bg-dot-pattern">
      <main className="w-full max-w-[600px] bg-pure-white border-4 border-ink-charcoal shadow-hard rounded-lg overflow-hidden flex flex-col relative self-center mx-auto">
        <div className="h-32 bg-electric-sun border-b-4 border-ink-charcoal relative overflow-hidden flex items-center justify-center">
          <div
            className="absolute -bottom-4 z-10 w-48 h-48 bg-pure-white border-4 border-ink-charcoal rounded-full flex items-center justify-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCtrS2fB2ZBaNzVVs2HQTlsM5zYm_h7uEQf1u-RU3uAFGznliOOPOBy62V5YAycNIoinbNVB78hgs1EzHFSB5lfJSjVdtA4kNnzSDhESuLKg7A9UO_C08mevECc2ToO0CDeJgHEC-_QqK461rbth_omKAIgUw92eNHiOv1M-wNkTEOWk-FaHJTkuZ-MQBCjw1-oTxz3HHJt8ckiUe4AwwhmHscDdEaspx3btVMXwbGkWKW8sB_9z43kiMTHFQAg91cJAb6z6gEFUfY')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          ></div>
          <div className="absolute top-4 left-4 w-10 h-10 rounded-full border-4 border-ink-charcoal accent-coral flex items-center justify-center shadow-hard-sm animate-float-slow">
            <Mail className="text-ink-charcoal w-5 h-5" />
          </div>
          <div className="absolute top-8 right-8 w-12 h-12 rotate-12 border-4 border-ink-charcoal accent-tangerine flex items-center justify-center shadow-hard-sm animate-wiggle">
            <Key className="text-ink-charcoal w-6 h-6" />
          </div>
          <div className="absolute bottom-4 right-24 w-10 h-10 rounded-full border-4 border-ink-charcoal accent-mint flex items-center justify-center shadow-hard-sm animate-float-medium">
            <Lock className="text-ink-charcoal w-5 h-5" />
          </div>
          <div className="absolute top-1/2 left-24 w-8 h-8 rotate-45 border-4 border-ink-charcoal accent-lavender shadow-hard-sm"></div>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-12 flex flex-col items-center pt-24 text-center z-20 bg-pure-white w-full">
          <h1 className="font-headline-lg text-headline-sm md:text-headline-lg text-ink-charcoal mb-4 uppercase flex flex-col sm:flex-row items-center gap-3 justify-center">
            <ShieldCheck
              className="w-10 h-10 hidden sm:block"
              style={{ color: "var(--color-leaf-green)" }}
            />
            <span>
              Reset Your{" "}
              <span className="bg-electric-sun px-3 py-1 border-2 border-ink-charcoal shadow-hard-sm inline-block rotate-2">
                Vibe
              </span>
            </span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-md mt-2">
            Enter the 6-digit code we sent you and choose a new secret.
          </p>

          {!id && (
            <div className="p-3 mb-4 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg text-sm font-body text-center w-full">
              Invalid or missing reset token. Please request a new link.
            </div>
          )}

          {apiError && (
            <div className="p-3 mb-4 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg text-sm font-body text-center w-full">
              {apiError}
            </div>
          )}
          <form
            className="w-full flex flex-col items-center gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* OTP Inputs */}
            <div className="w-full">
              <div className="flex gap-2 sm:gap-4 md:gap-6 justify-center w-full">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const fieldName =
                    `otp${index + 1}` as keyof ResetPasswordFormValues;
                  return (
                    <input
                      key={index}
                      {...register(fieldName as any)}
                      ref={(el) => {
                        register(fieldName as any).ref(el);
                        otpRefs.current[index] = el;
                      }}
                      autoFocus={index === 0}
                      className="w-12 h-16 sm:w-14 sm:h-18 md:w-16 md:h-20 border-4 border-ink-charcoal shadow-hard-sm rounded text-center font-display-lg text-display-lg text-ink-charcoal transition-all placeholder:text-surface-dim focus:outline-none focus:border-ink-charcoal focus:-translate-y-1 focus:shadow-hard"
                      maxLength={1}
                      placeholder="0"
                      type="number"
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      style={{
                        MozAppearance: "textfield",
                        backgroundColor: otpValues[index]
                          ? inputColors[index]
                          : "var(--color-pure-white)",
                      }}
                      aria-label={`Digit ${index + 1}`}
                    />
                  );
                })}
              </div>
              {otpError && (
                <p className="text-red-500 text-xs mt-2 text-center">
                  Please enter a valid 6-digit OTP
                </p>
              )}
            </div>
            <div className="w-full space-y-1 text-left">
              <label
                className="block font-label-md text-label-sm uppercase text-ink-charcoal"
                htmlFor="new-password"
              >
                New Password
              </label>
              <input
                {...register("newPassword")}
                className="w-full bg-pure-white border-4 border-ink-charcoal rounded-lg px-4 py-4 font-body-lg text-body-lg focus:outline-none focus:border-ink-charcoal focus:-translate-y-1 focus:shadow-hard transition-all placeholder:text-surface-dim"
                id="new-password"
                placeholder="Make it a good one"
                type="password"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="w-full space-y-1 text-left">
              <label
                className="block font-label-md text-label-sm uppercase text-ink-charcoal"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                className="w-full bg-pure-white border-4 border-ink-charcoal rounded-lg px-4 py-4 font-body-lg text-body-lg focus:outline-none focus:border-ink-charcoal focus:-translate-y-1 focus:shadow-hard transition-all placeholder:text-surface-dim"
                id="confirm-password"
                placeholder="Type it again"
                type="password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Primary Action */}
            <button
              type="submit"
              disabled={isFormSubmitting || isSubmittingApi || !id}
              className="w-full max-w-sm bg-leaf-green hover:bg-electric-sun transition-colors duration-300 text-ink-charcoal border-4 border-ink-charcoal py-4 px-8 rounded font-headline-md text-headline-md uppercase shadow-hard btn-press flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isSubmittingApi ? "Saving..." : "Save"}
              {isSubmittingApi ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <ArrowRight className="w-6 h-6" />
              )}
            </button>
          </form>

          {/* Secondary Actions */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link
              href="/forgot-password"
              className="font-label-md text-label-md text-ink-charcoal accent-lavender px-4 py-2 border-2 border-ink-charcoal shadow-hard-sm hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all uppercase flex items-center gap-2 group rounded"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Wait, take me back
            </Link>
          </div>
        </div>
      </main>

      {/* Hide number input arrows globally for this component */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
        }
      `,
        }}
      />
    </div>
  );
}
