"use client";

import React, { useEffect, useState } from 'react';
import { X, Lock, Settings as SettingsIcon, Info, Calendar, Loader2 } from 'lucide-react';
import { trpc } from '@/trpc/client';
import { useUpdateFormSettings } from '@/hook/form/useUpdateFormSettings';

interface FormSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formSlug: string;
}

export function FormSettingsModal({ isOpen, onClose, formSlug }: FormSettingsModalProps) {
  const [passwordNeeded, setPasswordNeeded] = useState(false);
  const [password, setPassword] = useState("");
  const [allowResponseEdit, setAllowResponseEdit] = useState(true);
  const [responseLimit, setResponseLimit] = useState<number | undefined>(undefined);
  const [expiresAt, setExpiresAt] = useState<string | undefined>(undefined);

  const { mutateAsync: loadDraftMutation, isPending: isLoading } = trpc.form.loadSaveDraft.useMutation();
  const { handleUpdateSettings, isUpdating } = useUpdateFormSettings();

  useEffect(() => {
    if (isOpen && formSlug) {
      loadDraftMutation({ formSlug }).then((response) => {
        if (response?.form) {
          setPasswordNeeded(response.form.passwordNeeded);
          setPassword(response.form.password || "");
          setAllowResponseEdit(response.form.allowResponseEdit);
          setResponseLimit(response.form.responseLimit || undefined);
          
          if (response.form.expiresAt) {
             const date = new Date(response.form.expiresAt);
             // Format for datetime-local: YYYY-MM-DDTHH:mm
             const formattedDate = date.toISOString().slice(0, 16);
             setExpiresAt(formattedDate);
          } else {
             setExpiresAt(undefined);
          }
        }
      }).catch((e) => {
        console.error("Failed to load settings", e);
      });
    }
  }, [isOpen, formSlug, loadDraftMutation]);

  if (!isOpen) return null;

  const onSave = async () => {
    const success = await handleUpdateSettings({
      formSlug,
      passwordNeeded,
      password: passwordNeeded ? password : "",
      allowResponseEdit,
      responseLimit: responseLimit || null,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-charcoal/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-pure-white border-4 border-ink-charcoal shadow-hard rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fade-up">
        <div className="sticky top-0 bg-pure-white border-b-4 border-ink-charcoal p-4 flex justify-between items-center z-20">
          <h2 className="font-headline-sm uppercase tracking-wider">Form Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-canvas-cream border-2 border-transparent hover:border-ink-charcoal rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-ink-charcoal" />
            </div>
          ) : (
            <>
              {/* Security Section */}
              <section className="bg-canvas-cream border-4 border-ink-charcoal rounded p-6 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]">
                <div className="flex items-center gap-3 mb-6 border-b-2 border-ink-charcoal pb-4">
                  <Lock className="text-leaf-green w-6 h-6" />
                  <h3 className="font-headline-sm uppercase">Security</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md cursor-pointer flex flex-col" htmlFor="modal-toggle-password">
                      <span>Password Protection</span>
                      <span className="text-[12px] text-on-surface-variant font-normal">Require a key to enter</span>
                    </label>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform duration-200 ease-in-out peer checked:translate-x-6" 
                        id="modal-toggle-password" 
                        type="checkbox" 
                        checked={passwordNeeded}
                        onChange={(e) => setPasswordNeeded(e.target.checked)}
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full border-2 border-ink-charcoal cursor-pointer transition-colors duration-200 bg-surface-variant peer-checked:bg-leaf-green" htmlFor="modal-toggle-password"></label>
                    </div>
                  </div>
                  
                  <div className={`flex flex-col gap-2 mt-4 p-4 bg-pure-white border-2 border-ink-charcoal rounded transition-opacity duration-200 ${passwordNeeded ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}>
                    <label className="font-label-sm uppercase" htmlFor="modal-form-password">Set Password</label>
                    <input 
                      className="w-full bg-surface-container-lowest border-2 border-ink-charcoal rounded p-3 font-body-md focus:outline-none focus:border-electric-sun" 
                      id="modal-form-password" 
                      placeholder="••••••••" 
                      type="password" 
                      disabled={!passwordNeeded}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Controls Section */}
              <section className="bg-canvas-cream border-4 border-ink-charcoal rounded p-6 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]">
                <div className="flex items-center gap-3 mb-6 border-b-2 border-ink-charcoal pb-4">
                  <SettingsIcon className="text-electric-sun w-6 h-6" />
                  <h3 className="font-headline-sm uppercase">Controls</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md flex items-center justify-between" htmlFor="modal-max-responses">
                      Max Responses
                      <span title="Limit total submissions" className="cursor-help"><Info className="w-4 h-4 text-on-surface-variant" /></span>
                    </label>
                    <input 
                      className="w-full bg-pure-white border-2 border-ink-charcoal rounded p-3 font-body-md focus:outline-none focus:border-electric-sun" 
                      id="modal-max-responses" 
                      placeholder="Unlimited" 
                      type="number" 
                      value={responseLimit || ''}
                      onChange={(e) => setResponseLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md flex items-center justify-between" htmlFor="modal-expiry-time">
                      Expiry Date/Time
                      <span title="When form closes" className="cursor-help"><Calendar className="w-4 h-4 text-on-surface-variant" /></span>
                    </label>
                    <input 
                      className="w-full bg-pure-white border-2 border-ink-charcoal rounded p-3 font-body-md focus:outline-none focus:border-electric-sun appearance-none" 
                      id="modal-expiry-time" 
                      type="datetime-local" 
                      value={expiresAt || ''}
                      onChange={(e) => setExpiresAt(e.target.value || undefined)}
                    />
                  </div>

                  <hr className="border-t-2 border-ink-charcoal/20" />

                  <div className="flex items-center justify-between">
                    <label className="font-label-md cursor-pointer flex flex-col" htmlFor="modal-toggle-edit">
                      <span>Allow Response Edit</span>
                      <span className="text-[12px] text-on-surface-variant font-normal">Users can modify after submitting</span>
                    </label>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform duration-200 ease-in-out peer checked:translate-x-6" 
                        id="modal-toggle-edit" 
                        type="checkbox" 
                        checked={allowResponseEdit}
                        onChange={(e) => setAllowResponseEdit(e.target.checked)}
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full border-2 border-ink-charcoal cursor-pointer transition-colors duration-200 bg-surface-variant peer-checked:bg-leaf-green" htmlFor="modal-toggle-edit"></label>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-pure-white border-t-4 border-ink-charcoal p-4 flex justify-end gap-4 z-20">
          <button 
            onClick={onClose}
            className="px-6 py-2 border-2 border-ink-charcoal rounded font-label-md font-bold uppercase hover:bg-canvas-cream transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            disabled={isUpdating || isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-leaf-green text-pure-white font-bold font-label-md uppercase border-2 border-ink-charcoal rounded shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating && <Loader2 className="w-5 h-5 animate-spin" />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
