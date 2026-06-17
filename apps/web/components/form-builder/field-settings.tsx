import React, { useCallback } from "react";
import { useFormBuilderStore } from "../../store/formStore/formBuilderStore";
import { Pointer, Info, GripVertical, X, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useUserInfoStore } from "../../store/userInfoStore";
import { usePathname } from "next/navigation";

export function FieldSettings() {
  const { nodes, selectedNodeId, updateNodeData, removeNode } = useFormBuilderStore();
  const { googleDriveRefreshToken } = useUserInfoStore();
  const pathname = usePathname();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleConnectDrive = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/trpc', '') || 'http://localhost:8000';
    window.location.href = `${apiUrl}/auth/google/drive?returnTo=${pathname}`;
  };

  const isDriveConnected = !!googleDriveRefreshToken;

  const handleUpdate = useCallback((key: string, value: any) => {
    if (selectedNodeId) {
      updateNodeData(selectedNodeId, { [key]: value });
    }
  }, [selectedNodeId, updateNodeData]);

  const addOption = () => {
    if (!selectedNode) return;
    const currentOptions = selectedNode.data.options || [];
    const newOption = { id: crypto.randomUUID(), value: `Option ${currentOptions.length + 1}` };
    handleUpdate("options", [...currentOptions, newOption]);
  };

  const removeOption = (id: string) => {
    if (!selectedNode) return;
    const newOptions = (selectedNode.data.options || []).filter(opt => opt.id !== id);
    handleUpdate("options", newOptions);
  };

  const updateOptionText = (id: string, newValue: string) => {
    if (!selectedNode) return;
    const newOptions = (selectedNode.data.options || []).map(opt => 
      opt.id === id ? { ...opt, value: newValue } : opt
    );
    handleUpdate("options", newOptions);
  };

  if (!selectedNode) {
    return (
      <aside className="w-full md:w-80 border-l-2 border-ink-charcoal bg-pure-white flex flex-col h-full flex-shrink-0 z-20">
        <div className="p-4 border-b-2 border-ink-charcoal bg-electric-sun flex justify-between items-center">
          <h2 className="text-headline-sm text-ink-charcoal uppercase tracking-tight font-headline-sm font-bold">Properties</h2>
        </div>
        <div className="p-6 flex flex-col items-center justify-center h-full text-outline gap-4">
          <Pointer className="w-12 h-12" />
          <p className="text-body-md font-body-md text-center">Select a node on the canvas to edit its properties.</p>
        </div>
      </aside>
    );
  }

  const { data } = selectedNode;
  const hasOptions = ["radio", "select", "multi_select", "checkbox"].includes(data.type);
  const hasPlaceholder = ["short_text", "long_text", "number", "email", "phone", "date"].includes(data.type);

  return (
    <aside className="w-full md:w-80 border-l-2 border-ink-charcoal bg-pure-white flex flex-col h-full flex-shrink-0 z-20">
      <div className="p-4 border-b-2 border-ink-charcoal bg-electric-sun flex justify-between items-center">
        <h2 className="text-headline-sm text-ink-charcoal uppercase tracking-tight font-headline-sm font-bold">Field Settings</h2>
      </div>
      <div className="p-6 overflow-y-auto space-y-8 flex-grow">
        {/* Field Type indicator */}
        <div className="flex items-center gap-3 bg-surface-container-low border-2 border-ink-charcoal p-3 rounded">
          <span className="text-label-md font-label-md uppercase tracking-wider">{data.label || data.type} Node</span>
        </div>
        
        {/* Label Setting */}
        <div className="space-y-2">
          <label className="text-label-md font-label-md uppercase text-outline flex items-center gap-1">
            Question Label
            <span title="The main text displayed above the input"><Info className="w-4 h-4 cursor-help" /></span>
          </label>
          <textarea 
            className="w-full border-2 border-ink-charcoal bg-pure-white p-3 rounded font-body-md text-body-md focus:ring-4 focus:ring-electric-sun focus:border-ink-charcoal outline-none resize-none" 
            rows={2} 
            value={data.label || ""}
            onChange={(e) => handleUpdate("label", e.target.value)}
            placeholder="Type your question..."
          />
        </div>
        
        {/* Placeholder Setting */}
        {hasPlaceholder && (
          <div className="space-y-2">
            <label className="text-label-md font-label-md uppercase text-outline">Placeholder Text</label>
            <input 
              className="w-full border-2 border-ink-charcoal bg-pure-white p-3 rounded font-body-md text-body-md focus:ring-4 focus:ring-electric-sun focus:border-ink-charcoal outline-none" 
              type="text" 
              value={data.placeholder || ""}
              placeholder={(() => {
                switch (data.type) {
                  case 'short_text': return 'Enter short text...';
                  case 'long_text': return 'Enter detailed text here...';
                  case 'number': return '123';
                  case 'email': return 'email@example.com';
                  case 'phone': return '(555) 000-0000';
                  case 'date': return 'MM/DD/YYYY';
                  default: return '';
                }
              })()}
              onChange={(e) => handleUpdate("placeholder", e.target.value)}
            />
          </div>
        )}
        
        {/* Help Text Setting */}
        <div className="space-y-2">
          <label className="text-label-md font-label-md uppercase text-outline">Helper Text (Optional)</label>
          <input 
            className="w-full border-2 border-ink-charcoal bg-pure-white p-3 rounded font-body-md text-body-md focus:ring-4 focus:ring-electric-sun focus:border-ink-charcoal outline-none" 
            type="text" 
            value={data.helperText || ""}
            onChange={(e) => handleUpdate("helperText", e.target.value)}
            placeholder="Add some context..." 
          />
        </div>

        {/* Options Manager */}
        {hasOptions && (
          <div className="space-y-4 pt-4 border-t-2 border-ink-charcoal/20">
            <h3 className="text-headline-sm text-ink-charcoal font-headline-sm font-bold">Options</h3>
            
            <div className="space-y-3">
              {(data.options || []).map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-outline cursor-grab" />
                  <input
                    type="text"
                    value={opt.value}
                    onChange={(e) => updateOptionText(opt.id, e.target.value)}
                    className="flex-grow border-2 border-ink-charcoal bg-pure-white p-2 rounded font-body-md text-body-md outline-none focus:border-electric-sun focus:ring-2 focus:ring-electric-sun"
                  />
                  <button 
                    onClick={() => removeOption(opt.id)}
                    className="w-10 h-10 flex items-center justify-center border-2 border-ink-charcoal rounded bg-pure-white text-error hover:bg-error hover:text-pure-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={addOption}
              className="w-full bg-leaf-green text-ink-charcoal border-2 border-ink-charcoal py-3 rounded shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] font-label-md text-label-md uppercase hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Option
            </button>
          </div>
        )}
        
        {/* File Integration */}
        {data.type === 'file' && (
          <div className="space-y-4 pt-4 border-t-2 border-ink-charcoal/20">
            <h3 className="text-headline-sm text-ink-charcoal font-headline-sm font-bold">Storage Integration</h3>
            <div className="flex flex-col gap-3 p-4 border-2 border-ink-charcoal rounded-DEFAULT bg-canvas-cream">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pure-white border-2 border-ink-charcoal flex items-center justify-center rounded-DEFAULT shrink-0">
                   <img 
                     src="https://imgs.search.brave.com/n8AbV7H1VwspJNw4Wc3SeZpGO99NfCW_SNM4YfAJ-7Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZmF2cG5nLmNvbS8x/MS80LzYvZ29vZ2xl/LWRyaXZlLWxvZ28t/d0NicnRqM0hfdC5q/cGc" 
                     alt="Google Drive" 
                     className="w-5 h-5 object-contain"
                   />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-ink-charcoal text-label-md">Google Drive</span>
                  <span className="text-ink-charcoal/70 text-[11px] leading-tight">Send uploaded files directly to your Drive</span>
                </div>
              </div>
              
              {isDriveConnected ? (
                <div className="flex items-center justify-center gap-2 text-[#008933] font-bold text-sm uppercase px-4 py-2 border-2 border-[#008933] bg-[#008933]/10 rounded">
                  <CheckCircle2 className="w-4 h-4" />
                  Connected
                </div>
              ) : (
                <button 
                  onClick={handleConnectDrive}
                  className="w-full px-4 py-2 border-2 border-ink-charcoal bg-pure-white shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:bg-electric-sun hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(44,46,42,1)] transition-all font-bold text-sm uppercase"
                >
                  Connect Drive
                </button>
              )}
            </div>
          </div>
        )}
        
        <hr className="border-t-2 border-ink-charcoal/20" />
        
        {/* Validations */}
        <div className="space-y-4">
          <h3 className="text-headline-sm text-ink-charcoal font-headline-sm font-bold">Rules</h3>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-1">
              <span className="text-label-md font-label-md">Required Field</span>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
              <input 
                checked={data.isRequired || false}
                onChange={(e) => handleUpdate("isRequired", e.target.checked)}
                className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform translate-x-0 checked:translate-x-6 checked:bg-pure-white checked:bg-none focus:ring-0" 
                type="checkbox" 
              />
              <div className={`toggle-label block overflow-hidden h-6 rounded-full border-2 border-ink-charcoal cursor-pointer ${data.isRequired ? 'bg-leaf-green' : 'bg-surface-variant'}`}></div>
            </div>
          </label>

          {['short_text', 'email', 'number'].includes(data.type) && (
            <label className="flex items-center justify-between cursor-pointer group pt-2 border-t-2 border-ink-charcoal/10">
              <div className="flex items-center gap-1">
                <span className="text-label-md font-label-md flex items-center gap-2">
                  Primary Field
                  <span title="Used as the main identifier for submissions (e.g. Drive Folder name). Only one field can be Primary."><Info className="w-4 h-4 text-ink-charcoal/50 cursor-help" /></span>
                </span>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  checked={data.isPrimary || false}
                  onChange={(e) => handleUpdate("isPrimary", e.target.checked)}
                  className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform translate-x-0 checked:translate-x-6 checked:bg-pure-white checked:bg-none focus:ring-0" 
                  type="checkbox" 
                />
                <div className={`toggle-label block overflow-hidden h-6 rounded-full border-2 border-ink-charcoal cursor-pointer ${data.isPrimary ? 'bg-electric-sun' : 'bg-surface-variant'}`}></div>
              </div>
            </label>
          )}
        </div>
      </div>
      
      <div className="mt-auto p-6 border-t-2 border-ink-charcoal bg-canvas-cream">
        <button 
          onClick={() => {
            if (selectedNodeId) {
              removeNode(selectedNodeId);
            }
          }}
          className="w-full bg-pure-white text-error border-2 border-error px-4 py-3 rounded shadow-[2px_2px_0px_0px_#ba1a1a] font-label-md text-label-md uppercase hover:bg-error-container hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex justify-center items-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Delete Node
        </button>
      </div>
    </aside>
  );
}
