import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";

interface AvatarUploaderProps {
  currentAvatarUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatarUrl,
  onUpload,
  isUploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      await onUpload(file);
      URL.revokeObjectURL(objectUrl);
      setPreview(null);
    }
  };

  const displayUrl =
    preview ||
    currentAvatarUrl ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder";

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        className="relative group cursor-pointer tilt-card"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-ink-charcoal)] shadow-hard bg-[var(--color-pure-white)] relative">
          <motion.img
            layoutId="avatar"
            src={displayUrl}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />

          <AnimatePresence>
            {!isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-[var(--color-leaf-green)]/80 flex flex-col items-center justify-center text-[var(--color-ink-charcoal)] transition-opacity backdrop-blur-sm"
              >
                <Camera className="w-8 h-8 mb-1" />
                <span className="text-xs font-bold font-display uppercase tracking-widest">
                  Change
                </span>
              </motion.div>
            )}

            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[var(--color-canvas-cream)]/80 flex items-center justify-center text-[var(--color-ink-charcoal)] backdrop-blur-sm"
              >
                <Loader2 className="w-8 h-8 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
