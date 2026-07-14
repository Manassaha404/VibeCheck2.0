import React from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialValues: {
    firstName: string;
    lastName: string;
    username: string;
  };
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  isLoading: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-label-md font-display font-bold uppercase tracking-wider text-[var(--color-ink-charcoal)] ml-1">
            First Name
          </label>
          <input
            {...register("firstName")}
            className={`w-full bg-[var(--color-pure-white)] border-2 ${errors.firstName ? "border-[var(--color-vivid-coral)] focus:ring-[var(--color-vivid-coral)]/40" : "border-[var(--color-ink-charcoal)] focus:ring-[var(--color-leaf-green)]/40"} shadow-hard-sm px-4 py-3 text-[var(--color-ink-charcoal)] font-body font-bold placeholder:text-[var(--color-ink-charcoal)]/40 focus:outline-none focus:ring-4 transition-all`}
            placeholder="John"
          />
          {errors.firstName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[var(--color-vivid-coral)] text-label-sm font-bold ml-1 mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.firstName.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-display font-bold uppercase tracking-wider text-[var(--color-ink-charcoal)] ml-1">
            Last Name
          </label>
          <input
            {...register("lastName")}
            className={`w-full bg-[var(--color-pure-white)] border-2 ${errors.lastName ? "border-[var(--color-vivid-coral)] focus:ring-[var(--color-vivid-coral)]/40" : "border-[var(--color-ink-charcoal)] focus:ring-[var(--color-leaf-green)]/40"} shadow-hard-sm px-4 py-3 text-[var(--color-ink-charcoal)] font-body font-bold placeholder:text-[var(--color-ink-charcoal)]/40 focus:outline-none focus:ring-4 transition-all`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[var(--color-vivid-coral)] text-label-sm font-bold ml-1 mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.lastName.message}
            </motion.p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-label-md font-display font-bold uppercase tracking-wider text-[var(--color-ink-charcoal)] ml-1">
          Username
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-[var(--color-ink-charcoal)]/50 font-bold">
            @
          </span>
          <input
            {...register("username")}
            className={`w-full bg-[var(--color-pure-white)] border-2 ${errors.username ? "border-[var(--color-vivid-coral)] focus:ring-[var(--color-vivid-coral)]/40" : "border-[var(--color-ink-charcoal)] focus:ring-[var(--color-leaf-green)]/40"} shadow-hard-sm pl-10 pr-4 py-3 text-[var(--color-ink-charcoal)] font-body font-bold placeholder:text-[var(--color-ink-charcoal)]/40 focus:outline-none focus:ring-4 transition-all`}
            placeholder="johndoe"
          />
        </div>
        {errors.username && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[var(--color-vivid-coral)] text-label-sm font-bold ml-1 mt-1 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.username.message}
          </motion.p>
        )}
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="w-full mt-6 bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)] font-display font-black text-headline-sm py-4 border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press flex justify-center items-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
};
