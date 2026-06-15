import React from "react";
import { useFormBuilderStore, FieldNode as FieldNodeType } from "../../store/formBuilderStore";
import { GripVertical, Rocket } from "lucide-react";
import { FieldPreviewRenderer } from "./shared/field-preview-renderer";

const getTypeColor = (type: string) => {
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function FormLinearPreview() {
  const { nodes, selectedNodeId, setSelectedNode, reorderNodes } = useFormBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = nodes.findIndex((n) => n.id === active.id);
      const newIndex = nodes.findIndex((n) => n.id === over.id);
      reorderNodes(oldIndex, newIndex);
    }
  };

  return (
    <section className="flex-grow overflow-hidden relative flex flex-col items-center bg-canvas-cream bg-dot-pattern">
      <div className="w-full h-full overflow-y-auto flex flex-col items-center p-8">
        <div className="w-full max-w-2xl space-y-6 pb-32">
          {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-ink-charcoal/30 rounded-xl bg-pure-white text-ink-charcoal/50">
            <p className="text-headline-sm font-headline-sm font-bold">No fields yet</p>
            <p className="text-body-lg font-body-lg">Drag or click fields from the palette to get started.</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={nodes.map(n => n.id)}
              strategy={verticalListSortingStrategy}
            >
              {nodes.map((node) => (
                <LinearFieldCard
                  key={node.id}
                  node={node}
                  isSelected={node.id === selectedNodeId}
                  onSelect={() => setSelectedNode(node.id)}
                />
              ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

    </section>
  );
}

function LinearFieldCard({
  node,
  isSelected,
  onSelect,
}: {
  node: FieldNodeType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { data } = node;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`relative border-4 rounded bg-pure-white w-full transition-all cursor-pointer group
        ${isSelected ? 'border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] -translate-y-1' : 'border-ink-charcoal shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] hover:shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-1'}
        ${isDragging ? 'opacity-50 shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] rotate-2' : ''}
      `}
    >
      <div className={`w-full h-4 border-b-4 border-ink-charcoal ${getTypeColor(data.type)} rounded-t-sm`} />
      
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className={`absolute -left-5 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing text-ink-charcoal transition-opacity bg-pure-white border-2 border-ink-charcoal rounded hover:bg-electric-sun shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] z-10
          ${isDragging ? 'opacity-100 bg-electric-sun' : 'opacity-0 group-hover:opacity-100'}
        `}
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="p-6">
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
        <FieldPreviewRenderer data={data} nodeId={node.id} />
      </div>
    </div>
  );
}

