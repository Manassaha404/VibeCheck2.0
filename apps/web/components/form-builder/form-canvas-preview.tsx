import React, { useCallback, useRef } from "react";
import { ReactFlow, Background, Controls, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFormBuilderStore } from "../../store/formBuilderStore";
import { FieldNode } from "./nodes/FieldNode";
import { Rocket } from "lucide-react";

const nodeTypes = {
  fieldNode: FieldNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#FF6B6B', strokeWidth: 4, filter: 'drop-shadow(3px 3px 0px #2C2E2A)' },
};

export function FormPreviewCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    addNode,
    setSelectedNode
  } = useFormBuilderStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const rawData = event.dataTransfer.getData('application/reactflow');
      
      if (!rawData || !reactFlowBounds) return;

      const data = JSON.parse(rawData);

      // Map screen coordinates to flow coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const defaultOptions = ['radio', 'select', 'checkbox', 'multi_select'].includes(data.type) 
        ? [
            { id: crypto.randomUUID(), value: 'Option 1' },
            { id: crypto.randomUUID(), value: 'Option 2' }
          ] 
        : undefined;

      const newNode = {
        id: crypto.randomUUID(),
        type: 'fieldNode',
        position,
        data: { 
          label: data.label, 
          type: data.type, 
          isRequired: false, 
          isPrimary: false,
          ...(defaultOptions && { options: defaultOptions })
        },
      };

      addNode(newNode);
      setSelectedNode(newNode.id);
    },
    [screenToFlowPosition, addNode, setSelectedNode]
  );

  return (
    <section className="flex-grow overflow-hidden relative flex flex-col h-full bg-canvas-cream" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        onPaneClick={() => setSelectedNode(null)}
        fitView
      >
        {/* Background matching the neubrutalist dot pattern that supports panning */}
        <Background gap={24} size={3} color="#2C2E2A" />
        <Controls />
      </ReactFlow>

    </section>
  );
}
