import React from "react";
import { FieldNode as FieldNodeType, useFormBuilderStore } from "../../../store/formStore/formBuilderStore";
import { Mail, Phone, Calendar, ChevronDown, Upload, Star, Smile, Meh, Frown } from "lucide-react";

export function FieldPreviewRenderer({ data, nodeId }: { data: FieldNodeType['data'], nodeId?: string }) {
  const { updateNodeData } = useFormBuilderStore();
  const { type, placeholder, options } = data;

  const handleOptionChange = (optId: string, newValue: string) => {
    if (!nodeId) return;
    const newOptions = (options || []).map(opt => 
      opt.id === optId ? { ...opt, value: newValue } : opt
    );
    updateNodeData(nodeId, { options: newOptions });
  };

  switch (type) {
    case 'short_text':
      return (
        <input
          className="w-full border-2 border-ink-charcoal bg-canvas-cream text-body-lg p-4 rounded outline-none pointer-events-none"
          disabled
          placeholder={placeholder || 'Enter short text...'}
          type="text"
        />
      );

    case 'long_text':
      return (
        <textarea
          className="w-full border-2 border-ink-charcoal bg-canvas-cream text-body-lg p-4 rounded outline-none resize-y min-h-[100px] pointer-events-none"
          disabled
          placeholder={placeholder || 'Enter detailed text here...'}
          rows={3}
        />
      );

    case 'number':
      return (
        <div className="relative w-full">
          <input
            className="w-full border-2 border-ink-charcoal bg-canvas-cream text-body-lg p-4 rounded outline-none pointer-events-none pr-12 font-mono"
            disabled
            placeholder={placeholder || '123'}
            type="number"
          />
          <div className="absolute right-0 top-0 bottom-0 w-12 border-l-2 border-ink-charcoal flex flex-col pointer-events-none">
            <div className="flex-1 border-b-2 border-ink-charcoal flex items-center justify-center bg-pure-white text-ink-charcoal text-xs font-bold select-none leading-none pt-1">▲</div>
            <div className="flex-1 flex items-center justify-center bg-pure-white text-ink-charcoal text-xs font-bold select-none leading-none pb-1">▼</div>
          </div>
        </div>
      );

    case 'email':
      return (
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink-charcoal/50">
            <Mail className="w-5 h-5" />
          </div>
          <input
            className="w-full border-2 border-ink-charcoal bg-canvas-cream text-body-lg p-4 pl-12 rounded outline-none pointer-events-none"
            disabled
            placeholder={placeholder || 'email@example.com'}
            type="email"
          />
        </div>
      );

    case 'phone':
      return (
        <div className="relative w-full flex">
          <div className="border-2 border-r-0 border-ink-charcoal bg-surface-container-low text-body-lg p-4 rounded-l flex items-center gap-2 pointer-events-none">
            <Phone className="w-5 h-5" />
            <span className="font-bold">+1</span>
          </div>
          <input
            className="w-full border-2 border-ink-charcoal bg-canvas-cream text-body-lg p-4 rounded-r outline-none pointer-events-none"
            disabled
            placeholder={placeholder || '(555) 000-0000'}
            type="tel"
          />
        </div>
      );

    case 'date':
      return (
        <div className="relative w-full">
          <input
            className="w-full border-2 border-ink-charcoal bg-canvas-cream text-body-lg p-4 rounded outline-none pointer-events-none appearance-none"
            disabled
            placeholder={placeholder || 'MM/DD/YYYY'}
            type="text"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink-charcoal">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      );

    case 'select':
      return (
        <div className="relative w-full">
          <div className="w-full border-2 border-ink-charcoal bg-canvas-cream text-body-lg p-4 rounded-t outline-none flex justify-between items-center text-ink-charcoal pointer-events-none">
            <span>Select an option...</span>
            <ChevronDown className="w-6 h-6 text-ink-charcoal" />
          </div>
          <div className="w-full border-2 border-t-0 border-ink-charcoal bg-pure-white rounded-b flex flex-col pointer-events-auto shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]">
            {(options || []).map((opt) => (
              <input
                key={opt.id}
                type="text"
                value={opt.value}
                onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                className="w-full p-3 border-b-2 last:border-b-0 border-ink-charcoal bg-transparent outline-none focus:bg-electric-sun/20 font-body-md text-ink-charcoal transition-colors"
                placeholder="Type option..."
              />
            ))}
          </div>
        </div>
      );

    case 'radio':
      return (
        <div className="flex flex-col gap-3 mt-2 pointer-events-auto">
          {(options || []).map((opt) => (
            <label key={opt.id} className="flex items-center gap-3 p-3 border-2 border-ink-charcoal rounded bg-canvas-cream cursor-text focus-within:border-electric-sun transition-colors">
              <div className="w-6 h-6 rounded-full border-2 border-ink-charcoal bg-pure-white flex items-center justify-center shrink-0">
                {opt.id === (options?.[0]?.id || '1') && <div className="w-3 h-3 rounded-full bg-leaf-green" />}
              </div>
              <input
                type="text"
                value={opt.value}
                onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                className="flex-grow bg-transparent text-body-md font-body-md text-ink-charcoal outline-none border-b-2 border-transparent focus:border-ink-charcoal/30"
                placeholder="Type option..."
              />
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex flex-col gap-3 mt-2 pointer-events-auto">
          {(options || []).map((opt) => (
            <label key={opt.id} className="flex items-center gap-3 p-3 border-2 border-ink-charcoal rounded bg-canvas-cream cursor-text focus-within:border-electric-sun transition-colors">
              <div className="w-6 h-6 rounded border-2 border-ink-charcoal bg-pure-white flex items-center justify-center shrink-0">
                {opt.id === (options?.[0]?.id || '1') && <div className="w-4 h-4 bg-leaf-green clip-path-check" style={{ clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)' }} />}
              </div>
              <input
                type="text"
                value={opt.value}
                onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                className="flex-grow bg-transparent text-body-md font-body-md text-ink-charcoal outline-none border-b-2 border-transparent focus:border-ink-charcoal/30"
                placeholder="Type option..."
              />
            </label>
          ))}
        </div>
      );

    case 'multi_select':
      return (
        <div className="w-full border-2 border-ink-charcoal bg-canvas-cream p-4 rounded outline-none min-h-[64px] flex flex-wrap gap-2 pointer-events-auto items-center">
          {(options || []).map((opt) => (
            <div key={opt.id} className="bg-electric-sun border-2 border-ink-charcoal pl-3 pr-2 py-1 rounded-full flex items-center shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] focus-within:shadow-none focus-within:translate-y-[2px] focus-within:translate-x-[2px] transition-all">
              <input
                type="text"
                value={opt.value}
                onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                className="bg-transparent text-label-sm font-label-sm font-bold text-ink-charcoal outline-none min-w-[40px] max-w-[120px]"
                placeholder="Tag"
                style={{ width: `${Math.max(opt.value.length, 3)}ch` }}
              />
              <span className="ml-1 font-bold cursor-pointer hover:bg-ink-charcoal/10 rounded-full w-5 h-5 flex items-center justify-center transition-colors">×</span>
            </div>
          ))}
          {(!options || options.length === 0) && <span className="text-ink-charcoal/50 text-body-lg ml-1 pointer-events-none">Select multiple...</span>}
        </div>
      );

    case 'file':
      return (
        <div className="border-4 border-dashed border-ink-charcoal bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center text-ink-charcoal gap-4 pointer-events-none relative overflow-hidden group hover:bg-surface-variant transition-colors">
          <div className="w-16 h-16 bg-pure-white border-4 border-ink-charcoal rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] relative z-10">
            <Upload className="w-8 h-8" />
          </div>
          <div className="text-center relative z-10">
            <p className="text-headline-sm font-headline-sm font-bold mb-1">Upload File</p>
            <p className="text-body-md text-ink-charcoal/70 font-bold">Drag & drop or click to browse</p>
          </div>
        </div>
      );

    case 'rating':
      return (
        <div className="flex gap-4 pointer-events-none py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={`w-10 h-10 ${i <= 3 ? 'text-electric-sun fill-electric-sun' : 'text-ink-charcoal/30 fill-transparent'} transition-colors`} />
          ))}
        </div>
      );

    case 'scale':
      return (
        <div className="flex flex-col gap-2 pointer-events-none pt-2">
          <div className="flex justify-between w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div 
                key={i} 
                className={`w-10 h-12 flex items-center justify-center border-2 border-ink-charcoal font-headline-sm font-bold text-lg
                  ${i === 8 ? 'bg-mint shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] -translate-y-1 text-ink-charcoal' : 'bg-pure-white text-ink-charcoal'}
                  ${i === 1 ? 'rounded-l-lg' : ''}
                  ${i === 10 ? 'rounded-r-lg' : ''}
                  ${i !== 10 ? 'border-r-0' : ''}
                `}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="flex justify-between px-2">
            <span className="text-label-sm font-label-sm font-bold text-outline uppercase">Not Likely</span>
            <span className="text-label-sm font-label-sm font-bold text-outline uppercase">Very Likely</span>
          </div>
        </div>
      );

    case 'mood':
      return (
        <div className="flex justify-center gap-8 pointer-events-none py-4">
          <div className="flex flex-col items-center gap-2 opacity-50 grayscale">
            <Frown className="w-14 h-14" />
            <span className="text-label-sm font-label-sm font-bold">Bad</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-ink-charcoal">
            <div className="bg-electric-sun rounded-full p-1 border-2 border-ink-charcoal shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]">
              <Meh className="w-12 h-12" />
            </div>
            <span className="text-label-sm font-label-sm font-bold uppercase mt-1">Okay</span>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-50 grayscale">
            <Smile className="w-14 h-14" />
            <span className="text-label-sm font-label-sm font-bold">Good</span>
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 bg-surface-container-low border-2 border-ink-charcoal rounded pointer-events-none">
          <p className="text-center italic font-body-md text-ink-charcoal">Preview not available for {type}</p>
        </div>
      );
  }
}
