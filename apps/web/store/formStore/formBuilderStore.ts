import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";

export type FieldType =
  | "short_text"
  | "long_text"
  | "number"
  | "email"
  | "phone"
  | "date"
  | "select"
  | "multi_select"
  | "radio"
  | "checkbox"
  | "file"
  | "rating"
  | "scale"
  | "mood";

export type FormFieldData = {
  label: string;
  type: FieldType;
  placeholder?: string;
  helperText?: string;
  isRequired: boolean;
  isPrimary: boolean;
  options?: { id: string; value: string }[];
};

export type FieldNode = Node<FormFieldData>;

interface FormBuilderState {
  nodes: FieldNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  viewMode: "canvas" | "linear";
  /** UUID of the current form draft — set after load, used by agent */
  formId: string | null;

  onNodesChange: OnNodesChange<FieldNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  setNodes: (nodes: FieldNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  setViewMode: (mode: "canvas" | "linear") => void;
  setFormId: (id: string | null) => void;

  addNode: (node: FieldNode) => void;
  updateNodeData: (id: string, data: Partial<FormFieldData>) => void;
  removeNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  moveNode: (id: string, direction: "up" | "down") => void;
  reorderNodes: (oldIndex: number, newIndex: number) => void;
  syncLinearEdges: () => void;
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  viewMode: "linear",
  formId: null,

  onNodesChange: (changes: NodeChange<FieldNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  setNodes: (nodes: FieldNode[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),
  setFormId: (id: string | null) => set({ formId: id }),

  setViewMode: (mode: "canvas" | "linear") => {
    const currentMode = get().viewMode;
    if (currentMode === mode) return;

    if (mode === "linear") {
      // Coming from Canvas: sort nodes by Y coordinate to reflect visual order
      const sortedNodes = [...get().nodes].sort(
        (a, b) => a.position.y - b.position.y,
      );
      set({ nodes: sortedNodes, viewMode: mode });
    } else {
      // Coming from Linear: adjust Y coordinates to reflect new array order, keeping X intact
      const updatedNodes = get().nodes.map((node, index) => ({
        ...node,
        position: { ...node.position, y: 50 + index * 250 },
      }));
      set({ nodes: updatedNodes, viewMode: mode });
    }
  },

  addNode: (node: FieldNode) => {
    const currentNodes = get().nodes;
    const maxY =
      currentNodes.length > 0
        ? Math.max(...currentNodes.map((n) => n.position.y))
        : 0;
    const lastNode =
      currentNodes.length > 0 ? currentNodes[currentNodes.length - 1] : null;

    // Ensure the new node is placed visually below existing nodes
    const positionedNode = {
      ...node,
      position: {
        ...node.position,
        y: currentNodes.length === 0 ? 50 : maxY + 250,
      },
    };

    set({ nodes: [...currentNodes, positionedNode] });

    if (lastNode) {
      set({
        edges: [
          ...get().edges,
          {
            id: `e-${lastNode.id}-${positionedNode.id}`,
            source: lastNode.id,
            target: positionedNode.id,
            type: "default",
          },
        ],
      });
    }
  },

  updateNodeData: (id: string, data: Partial<FormFieldData>) => {
    set({
      nodes: get().nodes.map((node) => {
        // If this field is being set as primary, unset isPrimary on all other fields to ensure uniqueness
        if (data.isPrimary === true && node.id !== id) {
          return { ...node, data: { ...node.data, isPrimary: false } };
        }
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },

  removeNode: (id: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter(
        (edge) => edge.source !== id && edge.target !== id,
      ),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  setSelectedNode: (id: string | null) => set({ selectedNodeId: id }),

  moveNode: (id: string, direction: "up" | "down") => {
    const nodes = [...get().nodes];
    const index = nodes.findIndex((n) => n.id === id);
    if (index === -1) return;

    if (direction === "up" && index > 0) {
      const temp = nodes[index - 1] as FieldNode;
      nodes[index - 1] = nodes[index] as FieldNode;
      nodes[index] = temp;
      set({ nodes });
      get().syncLinearEdges();
    } else if (direction === "down" && index < nodes.length - 1) {
      const temp = nodes[index + 1] as FieldNode;
      nodes[index + 1] = nodes[index] as FieldNode;
      nodes[index] = temp;
      set({ nodes });
      get().syncLinearEdges();
    }
  },

  reorderNodes: (oldIndex: number, newIndex: number) => {
    const newNodes = [...get().nodes];
    const [moved] = newNodes.splice(oldIndex, 1);
    newNodes.splice(newIndex, 0, moved as FieldNode);
    set({ nodes: newNodes });
    get().syncLinearEdges();
  },

  syncLinearEdges: () => {
    const nodes = get().nodes;
    const newEdges: Edge[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      newEdges.push({
        id: `e-${nodes[i]!.id}-${nodes[i + 1]!.id}`,
        source: nodes[i]!.id,
        target: nodes[i + 1]!.id,
        type: "default",
      });
    }
    set({ edges: newEdges });
  },
}));
