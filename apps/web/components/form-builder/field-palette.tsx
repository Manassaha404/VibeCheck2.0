import React from "react";

export function FieldPalette() {
  return (
    <aside className="w-full md:w-72 border-r-2 border-ink-charcoal bg-pure-white flex flex-col h-full flex-shrink-0 z-10">
      <div className="p-4 border-b-2 border-ink-charcoal bg-canvas-cream">
        <h2 className="text-headline-sm text-ink-charcoal uppercase tracking-tight">Form Elements</h2>
      </div>
      <div className="p-4 flex-grow overflow-y-auto bg-pure-white space-y-4">
        <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Drag to add</p>
        
        {/* Draggable Items */}
        {[
          { icon: "short_text", label: "Short Text" },
          { icon: "notes", label: "Long Text" },
          { icon: "radio_button_checked", label: "Single Select" },
          { icon: "check_box", label: "Multi Select" },
          { icon: "arrow_drop_down_circle", label: "Dropdown" },
          { icon: "calendar_month", label: "Date Picker" },
          { icon: "upload_file", label: "File Upload" },
          { icon: "mail", label: "Email" },
          { icon: "123", label: "Number" },
          { icon: "star", label: "Rating" },
          { icon: "sentiment_satisfied", label: "Mood" }
        ].map((item) => (
          <div key={item.label} className="bg-surface-container-low border-2 border-ink-charcoal rounded p-3 cursor-grab hover:bg-electric-sun transition-colors flex items-center gap-3 group">
            <span className="material-symbols-outlined text-outline group-hover:text-ink-charcoal">{item.icon}</span>
            <span className="text-label-md flex-grow">{item.label}</span>
            <span className="material-symbols-outlined text-outline group-hover:text-ink-charcoal opacity-50">drag_indicator</span>
          </div>
        ))}
      </div>
      
      {/* Decorative character */}
      <div className="p-4 mt-auto border-t-2 border-ink-charcoal bg-canvas-cream hidden md:block">
        <img 
          alt="Playful vector illustration" 
          className="w-full h-32 object-contain filter grayscale contrast-125" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5vPHqMr1QovHB1UCc-VieGR0tpJ6QOMXv4EUXsgKN1m-bKSCJy5_o8fnAvgHlZzdVoq7_VOG_TvyvU26bD2_M3lEwdnQVueiIxmeXPX4aDdsYg8ckzBrZxTug0Uq8Zc64uFzjVkRfbovTQt5Zg_sMDmBWc80WNU6gqmtDZNR5md_HF1_HPQRH0hxcdR1vqE0F5Q6sH9nrujwDTd6A-Pce1SNhgrNQQvx4vmNWngShsaiLRBqYOA1MGlSKzntQjBdKzluKQumyVjk"
        />
      </div>
    </aside>
  );
}
