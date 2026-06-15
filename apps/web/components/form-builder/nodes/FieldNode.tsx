import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useFormBuilderStore, FieldNode as FieldNodeType, FieldType } from '../../../store/formBuilderStore';
import { FieldPreviewRenderer } from '../shared/field-preview-renderer';
import { ArrowUp, ArrowDown } from 'lucide-react';

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

export function FieldNode({ id, data, selected }: { id: string; data: FieldNodeType['data']; selected: boolean }) {
  const isSelected = selected;
  const { nodes, moveNode } = useFormBuilderStore();
  const index = nodes.findIndex(n => n.id === id);
  const total = nodes.length;

  return (
    <div
      className={`relative border-4 rounded bg-pure-white w-[400px] transition-all group
        ${isSelected ? 'border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] -translate-y-1' : 'border-ink-charcoal shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] hover:shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-1'}
      `}
    >
      <div className={`w-full h-4 border-b-4 border-ink-charcoal ${getTypeColor(data.type)} rounded-t-sm`} />
      {/* Order Badge & Controls */}
      <div className="absolute -top-4 -left-4 flex items-center bg-pure-white border-2 border-ink-charcoal rounded shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] overflow-hidden z-10 opacity-100 transition-opacity">
        <div className={`px-3 py-1 h-full flex items-center justify-center font-bold font-label-md text-ink-charcoal border-r-2 border-ink-charcoal ${getTypeColor(data.type)}`}>
          #{index + 1}
        </div>
        <div className="flex flex-col bg-canvas-cream">
          <button 
            onClick={(e) => { e.stopPropagation(); moveNode(id, 'up'); }}
            disabled={index <= 0}
            className="px-1 py-0.5 hover:bg-leaf-green hover:text-pure-white border-b-2 border-ink-charcoal disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-charcoal transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Move Up in Order"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); moveNode(id, 'down'); }}
            disabled={index >= total - 1}
            className="px-1 py-0.5 hover:bg-leaf-green hover:text-pure-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-charcoal transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Move Down in Order"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-ink-charcoal border-2 border-pure-white rounded-full -mt-4"
        />

        <div className="mb-2 flex items-center gap-2">
        <label className="text-headline-sm text-ink-charcoal font-headline-sm font-bold">
          {data.label || 'Untitled Question'}
        </label>
        {data.isRequired && (
          <span className="text-error font-bold text-xl leading-none">*</span>
        )}
      </div>

      {data.helperText && (
        <p className="text-body-md text-ink-charcoal/60 mb-4">{data.helperText}</p>
      )}

        {/* Preview of the field based on its type */}
        <FieldPreviewRenderer data={data} nodeId={id} />

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-leaf-green border-2 border-pure-white rounded-full -mb-4"
        />
      </div>
    </div>
  );
}

