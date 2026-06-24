"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { PollDraftFormValues } from "./schema";
import { GripVertical, Trash2, Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableOptionItem({
  id,
  index,
  remove,
  canRemove,
}: {
  id: string;
  index: number;
  remove: (index: number) => void;
  canRemove: boolean;
}) {
  const { register, formState: { errors } } = useFormContext<PollDraftFormValues>();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const optionErrors = errors.options as any;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-pure-white rounded-lg p-2 ${isDragging ? "shadow-hard border-2 border-electric-sun" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1"
      >
        <GripVertical className="text-ink-charcoal opacity-50 hover:opacity-100 flex-shrink-0" />
      </div>
      <div className="flex-grow flex flex-col">
        <input
          {...register(`options.${index}.text`)}
          className="w-full bg-pure-white border-2 border-ink-charcoal rounded p-3 font-body-lg text-body-lg focus:outline-none focus:ring-2 focus:ring-electric-sun focus:border-electric-sun"
          placeholder={`Option ${index + 1}`}
          type="text"
        />
        {optionErrors?.[index]?.text && (
          <span className="text-error font-label-sm text-label-sm mt-1">
            {optionErrors[index]?.text?.message}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => remove(index)}
        disabled={!canRemove}
        className="p-2 text-error hover:bg-error-container rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={24} />
      </button>
    </div>
  );
}

export function PollOptionsList() {
  const { control, formState: { errors } } = useFormContext<PollDraftFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "options",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  return (
    <div className="bg-pure-white border-2 border-ink-charcoal shadow-hard-lg p-6 rounded-xl flex flex-col gap-4 relative overflow-hidden card-lift animate-fade-up" style={{ animationDelay: '100ms' }}>
      <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-mint)] border-b-2 border-ink-charcoal"></div>
      <h2 className="font-headline-sm text-headline-sm text-ink-charcoal mb-2 mt-2">Options</h2>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <SortableOptionItem
                key={field.id}
                id={field.id}
                index={index}
                remove={remove}
                canRemove={fields.length > 2}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {errors.options && typeof errors.options.message === "string" && (
        <p className="text-error font-label-sm text-label-sm">
          {errors.options.message}
        </p>
      )}

      <button
        type="button"
        onClick={() => append({ id: crypto.randomUUID(), text: "" })}
        className="mt-2 flex items-center justify-center gap-2 w-full py-4 bg-canvas-cream border-2 border-ink-charcoal border-dashed hover:border-solid hover:bg-electric-sun transition-all font-label-md text-label-md rounded"
      >
        <Plus size={20} /> Add another option
      </button>
    </div>
  );
}
