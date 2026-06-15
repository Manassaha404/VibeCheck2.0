import React from "react";
import { FieldType, useFormBuilderStore } from "../../store/formBuilderStore";
import { 
  Type, 
  AlignLeft, 
  CircleDot, 
  CheckSquare, 
  ChevronDownSquare, 
  Calendar, 
  Upload, 
  Mail, 
  Hash, 
  Star, 
  Smile,
  GripVertical,
  Plus
} from "lucide-react";

const getTypeColor = (type: FieldType) => {
  switch (type) {
    case 'short_text':
    case 'long_text':
      return 'bg-sky-blue';
    case 'radio':
    case 'checkbox':
    case 'select':
    case 'multi_select':
      return 'bg-lavender';
    case 'number':
    case 'phone':
    case 'email':
    case 'date':
      return 'bg-mint';
    case 'file':
      return 'bg-tangerine';
    case 'rating':
    case 'scale':
    case 'mood':
      return 'bg-vivid-coral';
    default:
      return 'bg-electric-sun';
  }
};

export function FieldPalette() {
  const { addNode, setSelectedNode } = useFormBuilderStore();

  const onDragStart = (event: React.DragEvent, nodeType: FieldType, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddClick = (nodeType: FieldType, label: string) => {
    const defaultOptions = ['radio', 'select', 'checkbox', 'multi_select'].includes(nodeType) 
      ? [
          { id: crypto.randomUUID(), value: 'Option 1' },
          { id: crypto.randomUUID(), value: 'Option 2' }
        ] 
      : undefined;

    const newNode = {
      id: crypto.randomUUID(),
      type: 'fieldNode',
      position: { x: 50, y: 50 }, // Default position for canvas mode if added via click
      data: { 
        label, 
        type: nodeType, 
        isRequired: false, 
        isPrimary: false,
        ...(defaultOptions && { options: defaultOptions })
      },
    };
    addNode(newNode);
    setSelectedNode(newNode.id);
  };

  const elements: { icon: React.ElementType; label: string; type: FieldType }[] = [
    { icon: Type, label: "Short Text", type: "short_text" },
    { icon: AlignLeft, label: "Long Text", type: "long_text" },
    { icon: CircleDot, label: "Single Select", type: "radio" },
    { icon: CheckSquare, label: "Multi Select", type: "checkbox" },
    { icon: ChevronDownSquare, label: "Dropdown", type: "select" },
    { icon: Calendar, label: "Date Picker", type: "date" },
    { icon: Upload, label: "File Upload", type: "file" },
    { icon: Mail, label: "Email", type: "email" },
    { icon: Hash, label: "Number", type: "number" },
    { icon: Star, label: "Rating", type: "rating" },
    { icon: Smile, label: "Mood", type: "mood" }
  ];

  return (
    <aside className="w-full md:w-72 border-r-2 border-ink-charcoal bg-pure-white flex flex-col h-full flex-shrink-0 z-10">
      <div className="p-4 border-b-2 border-ink-charcoal bg-canvas-cream">
        <h2 className="text-headline-sm text-ink-charcoal uppercase tracking-tight font-headline-sm font-bold">Form Elements</h2>
      </div>
      <div className="p-4 flex-grow overflow-y-auto bg-pure-white space-y-4">
        <p className="text-label-sm font-label-sm font-bold text-outline uppercase tracking-wider mb-2">Drag to add</p>
        
        {/* Draggable & Clickable Items */}
        {elements.map(({ icon: Icon, label, type }) => (
          <div 
            key={label}
            draggable
            onDragStart={(e) => onDragStart(e, type, label)}
            className="flex items-center gap-3 p-3 border-2 border-ink-charcoal bg-pure-white rounded cursor-grab hover:shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-1 transition-all group"
          >
            <div className={`p-2 rounded border-2 border-ink-charcoal ${getTypeColor(type)}`}>
              <Icon className="w-5 h-5 text-ink-charcoal" />
            </div>
            <span className="font-label-md text-label-md flex-grow">{label}</span>
            <button 
              onClick={() => handleAddClick(type, label)}
              className="p-1.5 border-2 border-transparent group-hover:border-ink-charcoal rounded hover:bg-electric-sun transition-colors opacity-0 group-hover:opacity-100"
              title="Add to Canvas"
            >
              <Plus className="w-4 h-4" />
            </button>
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
