import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getSchematic, saveSchematic } from '../../api/useSchematicService';
import { appFonts } from '../../config/theme';
import {
  PointNode,
  LabelNode,
  BoilerNode,
  HotWaterTankNode,
  ColdWaterTankNode,
  WaterPumpNode,
  SensorNode,
  ValveNode,
  FlowMeterNode,
  ReturnMeterNode,
  PressureSensorNode,
  HeatExchangerNode,
  ExpansionVesselNode,
  ControllerNode,
  BoosterPumpNode,
  TemperatureDifferenceNode,
} from './SchematicNodes.web';

const {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  ConnectionLineType,
  MarkerType,
} = require('@xyflow/react/dist/umd/index.js');

const nodeTypes = {
  point: PointNode,
  label: LabelNode,
  boiler: BoilerNode,
  hotWaterTank: HotWaterTankNode,
  coldWaterTank: ColdWaterTankNode,
  waterPump: WaterPumpNode,
  sensor: SensorNode,
  valve: ValveNode,
  flowMeter: FlowMeterNode,
  returnMeter: ReturnMeterNode,
  pressureSensor: PressureSensorNode,
  hex: HeatExchangerNode,
  expansion: ExpansionVesselNode,
  controller: ControllerNode,
  boosterPump: BoosterPumpNode,
  temperatureDifference: TemperatureDifferenceNode,
};

const PIPE_COLORS = {
  RED: '#d32f2f',
  BLUE: '#1976d2',
  ORANGE: '#ed6c02',
  GREY: '#616161',
};

const unwrapGraphicsData = (raw) => {
  let payload = raw?.graphics_data ?? raw;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      return null;
    }
  }
  while (
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    payload.graphics_data &&
    !payload.nodes &&
    !payload.edges
  ) {
    payload = payload.graphics_data;
  }
  return payload || null;
};

export default function SchematicBuilder({
  propertyId,
  graphicType = 'default',
  readOnly = false,
  boilerList = [],
  waterPumpList = [],
  flowMeterList = [],
  pt1000Sensors = [],
  pressureSensors = [],
  toggleBoilerStatus,
  toggleWaterPumpStatus,
}) {
  const theme = useTheme();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const [viewportToRestore, setViewportToRestore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [tempValue1, setTempValue1] = useState('');
  const [tempValue2, setTempValue2] = useState('');
  const [showComponentLabels, setShowComponentLabels] = useState(false);
  const [activeColor, setActiveColor] = useState(PIPE_COLORS.RED);

  const colors = {
    background: theme.colors?.background || '#fafafa',
    surface: theme.colors?.card || theme.colors?.surface || '#fff',
    text: theme.colors?.text || '#111',
    border: theme.colors?.border || '#d9d9d9',
    primary: theme.colors?.primary || '#1976d2',
    action: theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
  };

  const controlsStyle = useMemo(
    () => ({
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 4,
      boxShadow: theme.dark ? 'none' : '0 2px 6px rgba(0,0,0,0.12)',
      padding: 4,
      '--xy-controls-button-background-color': colors.surface,
      '--xy-controls-button-background-color-hover': colors.action,
      '--xy-controls-button-color': colors.text,
      '--xy-controls-button-border-bottom': `1px solid ${colors.border}`,
    }),
    [colors.action, colors.border, colors.surface, colors.text, theme.dark]
  );

  const showMessage = (message, severity = 'success') => setSnackbar({ message, severity });

  const formatNodeTypeLabel = (nodeType) =>
    nodeType ? nodeType.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()) : '';

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, []);

  const normalizeId = (id) => String(id || '').trim().toLowerCase();

  const onNodeClick = useCallback((event, node) => {
    if (!readOnly) {
      if (node.type === 'temperatureDifference') {
        setSelectedNode(node);
        setTempValue1(node.data.sensorId1 || '');
        setTempValue2(node.data.sensorId2 || '');
        return;
      }
      if (node.type === 'label') {
        setSelectedNode(node);
        setTempValue(node.data.label || '');
        return;
      }
      const dynamicTypes = ['boiler', 'waterPump', 'sensor', 'pressureSensor', 'flowMeter', 'returnMeter'];
      if (dynamicTypes.includes(node.type)) {
        setSelectedNode(node);
        setTempValue(node.data.dbId || node.id);
      }
      return;
    }

    const dbId = node.data.dbId || node.id;

    if (node.type === 'boiler' && toggleBoilerStatus) {
      const newStatus = node.data.status === 1 ? 0 : 1;
      setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, status: newStatus } } : n)));
      toggleBoilerStatus(dbId, newStatus).catch(() => showMessage('Failed to toggle boiler', 'error'));
    }

    if (node.type === 'waterPump' && toggleWaterPumpStatus) {
      const newStatus = node.data.status === 1 ? 0 : 1;
      setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, status: newStatus } } : n)));
      toggleWaterPumpStatus(dbId, newStatus).catch(() => showMessage('Failed to toggle water pump', 'error'));
    }
  }, [readOnly, toggleBoilerStatus, toggleWaterPumpStatus]);

  useEffect(() => {
    setEdges((eds) =>
      eds.map((e) => {
        const hasCustomColor = e.data?.customColor || (e.style?.stroke && e.style.stroke !== '#333');
        const stroke = hasCustomColor ? e.style.stroke : colors.text;
        return {
          ...e,
          style: { ...e.style, strokeWidth: 2, stroke },
          markerEnd: { ...e.markerEnd, type: MarkerType.ArrowClosed, color: stroke },
        };
      })
    );
  }, [colors.text]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onDelete: deleteNode,
          onEdit: (event) => onNodeClick(event, n),
          pt1000Sensors,
          readOnly,
          showLabels: showComponentLabels,
        },
      }))
    );
  }, [deleteNode, onNodeClick, pt1000Sensors, readOnly, showComponentLabels]);

  useEffect(() => {
    const loadData = async () => {
      if (!propertyId) {
        setNodes([]);
        setEdges([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getSchematic(propertyId, graphicType);
        const flow = unwrapGraphicsData(data);

        if (flow) {
          setNodes(flow.nodes || []);
          setEdges(
            (flow.edges || []).map((e) => ({
              ...e,
              type: 'step',
              style: { ...e.style, strokeWidth: 2, stroke: e.style?.stroke || colors.text },
              markerEnd: { ...e.markerEnd, type: MarkerType.ArrowClosed, color: e.style?.stroke || colors.text },
            }))
          );
          if (flow.viewport) {
            setViewportToRestore(flow.viewport);
          }
        } else {
          setNodes([]);
          setEdges([]);
        }
      } catch (error) {
        console.error('Failed to load schematic', error);
        showMessage('Error loading schematic', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [propertyId, graphicType, colors.text]);

  useEffect(() => {
    if (rfInstance && viewportToRestore) {
      rfInstance.setViewport(viewportToRestore);
      setViewportToRestore(null);
    }
  }, [rfInstance, viewportToRestore]);

  useEffect(() => {
    if (nodes.length === 0) return;
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const dbId = node.data.dbId;
        if (!dbId) return node;
        const cleanDbId = normalizeId(dbId);

        if (node.type === 'boiler') {
          const live = boilerList.find((b) => normalizeId(b.id) === cleanDbId);
          if (live) return { ...node, data: { ...node.data, status: live.status, details: { name: live.name, brand: live.brand, model: live.model } } };
        }
        if (node.type === 'waterPump') {
          const live = waterPumpList.find((p) => normalizeId(p.id) === cleanDbId);
          if (live) return { ...node, data: { ...node.data, status: live.status, details: { name: live.name, brand: live.brand, model: live.model } } };
        }
        if (node.type === 'flowMeter' || node.type === 'returnMeter') {
          const live = flowMeterList.find((f) => normalizeId(f.id) === cleanDbId);
          if (live) return { ...node, data: { ...node.data, value: live.value, details: { name: live.name, brand: live.brand, model: live.model } } };
        }
        if (node.type === 'sensor') {
          const live = pt1000Sensors.find((s) => normalizeId(s.id) === cleanDbId);
          if (live) return { ...node, data: { ...node.data, value: live.value, details: { name: live.name, brand: live.brand, model: live.model } } };
        }
        if (node.type === 'pressureSensor') {
          const live = pressureSensors.find((s) => normalizeId(s.id) === cleanDbId);
          if (live) return { ...node, data: { ...node.data, value: live.value, details: { name: live.name, brand: live.brand, model: live.model } } };
        }
        return node;
      })
    );
  }, [boilerList, waterPumpList, flowMeterList, pt1000Sensors, pressureSensors]);

  const onConnect = useCallback((params) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: 'smoothstep',
          animated: false,
          data: { customColor: true },
          style: { stroke: activeColor, strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: activeColor },
        },
        eds
      )
    );
  }, [activeColor]);

  const onSave = useCallback(async () => {
    if (rfInstance && propertyId) {
      try {
        await saveSchematic(propertyId, graphicType, rfInstance.toObject());
        showMessage('Layout Saved!');
      } catch {
        showMessage('Failed to save.', 'error');
      }
    }
  }, [rfInstance, propertyId, graphicType]);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onInit = useCallback((instance) => setRfInstance(instance), []);

  const onDrop = useCallback((event) => {
    if (readOnly || !rfInstance) return;
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;
    const position = rfInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setNodes((nds) =>
      nds.concat({
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: {
          label: type,
          status: 0,
          value: 0,
          dbId: '',
          details: { name: '', brand: '', model: '' },
          onDelete: deleteNode,
          readOnly,
          showLabels: showComponentLabels,
        },
      })
    );
  }, [deleteNode, readOnly, rfInstance, showComponentLabels]);

  const onEdgeClick = useCallback((event, edge) => {
    if (readOnly) return;
    event.stopPropagation();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, [readOnly]);

  const getDeviceList = (type) => {
    switch (type) {
      case 'boiler': return boilerList;
      case 'waterPump': return waterPumpList;
      case 'flowMeter':
      case 'returnMeter': return flowMeterList;
      case 'sensor': return pt1000Sensors;
      case 'pressureSensor': return pressureSensors;
      default: return [];
    }
  };

  const handleDialogSave = () => {
    if (!selectedNode) return;
    const newId = tempValue.trim();

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== selectedNode.id) return n;
        if (n.type === 'label') return { ...n, data: { ...n.data, label: newId } };
        if (n.type === 'temperatureDifference') {
          return { ...n, data: { ...n.data, sensorId1: tempValue1, sensorId2: tempValue2, pt1000Sensors } };
        }
        const foundItem = getDeviceList(n.type).find((item) => normalizeId(item.id) === normalizeId(newId));
        return {
          ...n,
          data: {
            ...n.data,
            dbId: newId,
            ...(foundItem ? { status: foundItem.status, value: foundItem.value } : {}),
          },
        };
      })
    );

    setSelectedNode(null);
    showMessage('Node updated successfully');
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 40, color: colors.text }}>Loading...</div>;
  }

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: '100%', height: '100%', background: colors.background, border: '1px solid green', borderRadius: 4 }}
    >
      <style>{`
        .react-flow__controls-button {
          fill: ${colors.text} !important;
          color: ${colors.text} !important;
          border-bottom: 1px solid ${colors.border} !important;
        }
        .react-flow__controls-button:last-child,
        .react-flow__controls-button.react-flow__controls-interactive {
          border-bottom: none !important;
        }
        .react-flow__controls-button:hover {
          background-color: ${colors.action} !important;
        }
        .react-flow__controls-button svg { fill: ${colors.text} !important; }
        .read-only-mode .react-flow__handle { opacity: 0 !important; }
        .hide-component-labels .node-label-container { display: none; }
      `}</style>

      <ReactFlow
        className={`${readOnly ? 'read-only-mode' : ''} ${!showComponentLabels ? 'hide-component-labels' : ''}`}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={onInit}
        onNodeClick={onNodeClick}
        onEdgeClick={readOnly ? undefined : onEdgeClick}
        deleteKeyCode={readOnly ? null : ['Backspace', 'Delete']}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        fitView
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        defaultEdgeOptions={{ type: 'step', animated: false }}
        connectionLineStyle={{ stroke: activeColor, strokeWidth: 2 }}
        connectionLineType={ConnectionLineType.Step}
        proOptions={{ hideAttribution: true }}
      >
        <Controls style={controlsStyle} showInteractive={!readOnly} />
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 4, display: 'flex', gap: 8, alignItems: 'center' }}>
          {!readOnly && (
            <div style={{ display: 'flex', background: colors.surface, padding: 4, borderRadius: 8, border: `1px solid ${colors.border}`, marginRight: 8 }}>
              {Object.entries(PIPE_COLORS).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveColor(value)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                    margin: '0 2px',
                  }}
                >
                  <span style={{ display: 'block', width: 20, height: 20, margin: '0 auto', borderRadius: '50%', background: value, opacity: activeColor === value ? 1 : 0.3 }} />
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowComponentLabels((value) => !value)}
            title={showComponentLabels ? 'Hide Labels' : 'Show Labels'}
            aria-label={showComponentLabels ? 'Hide Labels' : 'Show Labels'}
              style={{ background: colors.surface, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name={showComponentLabels ? 'visibility' : 'visibility-off'} size={18} color={colors.text} />
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={onSave}
              style={{ background: colors.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontFamily: appFonts.bold.fontFamily }}
            >
              Save
            </button>
          )}
        </div>
      </ReactFlow>

      {snackbar ? (
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: snackbar.severity === 'error' ? '#b3261e' : '#323232', color: '#fff', padding: 14, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{snackbar.message}</span>
          <button type="button" onClick={() => setSnackbar(null)} style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>OK</button>
        </div>
      ) : null}

      {selectedNode ? (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
          <div style={{ background: colors.surface, color: colors.text, borderRadius: 8, padding: 20, width: '90%', maxWidth: 420, maxHeight: '80%', overflow: 'auto' }}>
            <div style={{ fontSize: 18, fontFamily: appFonts.bold.fontFamily, marginBottom: 16 }}>
              {selectedNode.type === 'label' ? 'Edit Label' : selectedNode.type === 'temperatureDifference' ? 'Assign Temperature Sensors' : `Assign ${formatNodeTypeLabel(selectedNode.type)}`}
            </div>

            {selectedNode.type === 'label' ? (
              <input value={tempValue} onChange={(e) => setTempValue(e.target.value)} placeholder="Label Text" style={{ width: '100%', padding: 10, borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.background, color: colors.text }} />
            ) : null}

            {selectedNode.type === 'temperatureDifference' ? (
              <div style={{ display: 'grid', gap: 12 }}>
                <label>
                  <div style={{ marginBottom: 6, fontFamily: appFonts.bold.fontFamily }}>Sensor 1 (Flow)</div>
                  <select value={tempValue1} onChange={(e) => setTempValue1(e.target.value)} style={{ width: '100%', padding: 10 }}>
                    <option value="">Select sensor</option>
                    {pt1000Sensors.map((sensor) => <option key={sensor.id} value={sensor.id}>{sensor.name}</option>)}
                  </select>
                </label>
                <label>
                  <div style={{ marginBottom: 6, fontFamily: appFonts.bold.fontFamily }}>Sensor 2 (Return)</div>
                  <select value={tempValue2} onChange={(e) => setTempValue2(e.target.value)} style={{ width: '100%', padding: 10 }}>
                    <option value="">Select sensor</option>
                    {pt1000Sensors.map((sensor) => <option key={sensor.id} value={sensor.id}>{sensor.name}</option>)}
                  </select>
                </label>
              </div>
            ) : null}

            {!['label', 'temperatureDifference'].includes(selectedNode.type) ? (
              <select value={tempValue} onChange={(e) => setTempValue(e.target.value)} style={{ width: '100%', padding: 10 }}>
                <option value="">Select device</option>
                {getDeviceList(selectedNode.type).map((device) => <option key={device.id} value={device.id}>{device.name}</option>)}
              </select>
            ) : null}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button type="button" onClick={() => setSelectedNode(null)} style={{ padding: '8px 12px' }}>Cancel</button>
              <button type="button" onClick={handleDialogSave} style={{ padding: '8px 12px', background: colors.primary, color: '#fff', border: 'none', borderRadius: 6, fontFamily: appFonts.bold.fontFamily }}>Save Changes</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
