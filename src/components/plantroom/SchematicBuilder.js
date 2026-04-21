import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import Draggable from 'react-native-draggable';
import Svg, { Path } from 'react-native-svg';
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import { saveSchematic, getSchematic } from '../../api/useSchematicService'; // ✅ Keep your original import
import { appFonts } from '../../config/theme';
import { useNativeSchematicDrag } from './NativeSchematicDragContext';
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
} from './SchematicNodes';

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

const NODE_DEFAULT_SIZES = {
  point: { width: 10, height: 10 },
  label: { width: 100, height: 30 },
  boiler: { width: 80, height: 100 },
  hotWaterTank: { width: 80, height: 120 },
  coldWaterTank: { width: 120, height: 70 },
  flowMeter: { width: 40, height: 22 },
  returnMeter: { width: 45, height: 22 },
  waterPump: { width: 30, height: 30 },
  sensor: { width: 35, height: 15 },
  pressureSensor: { width: 35, height: 15 },
  valve: { width: 80, height: 40 },
  hex: { width: 50, height: 70 },
  expansion: { width: 40, height: 90 },
  controller: { width: 35, height: 40 },
  boosterPump: { width: 30, height: 30 },
  temperatureDifference: { width: 90, height: 30 },
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const unwrapGraphicsData = (raw) => {
  let payload = raw?.graphics_data ?? raw;

  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
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

const getNodeSize = (node) => {
  const measured = node?.measured || {};
  const defaults = NODE_DEFAULT_SIZES[node?.type] || { width: 50, height: 50 };

  return {
    width: toNumber(measured.width, defaults.width),
    height: toNumber(measured.height, defaults.height),
  };
};

const getHandleOrientation = (handle = '') => {
  const normalized = String(handle).toLowerCase();

  if (
    normalized.includes('left') ||
    normalized.startsWith('l-') ||
    normalized.endsWith('-l') ||
    normalized === 'l'
  ) {
    return 'left';
  }

  if (
    normalized.includes('right') ||
    normalized.startsWith('r-') ||
    normalized.endsWith('-r') ||
    normalized === 'r'
  ) {
    return 'right';
  }

  if (
    normalized.includes('top') ||
    normalized.startsWith('t-') ||
    normalized.endsWith('-t') ||
    normalized === 't'
  ) {
    return 'top';
  }

  if (
    normalized.includes('bottom') ||
    normalized.startsWith('b-') ||
    normalized.endsWith('-b') ||
    normalized === 'b'
  ) {
    return 'bottom';
  }

  return 'center';
};

const getAnchorPoint = (node, handle) => {
  const { width, height } = getNodeSize(node);
  const x = toNumber(node?.position?.x);
  const y = toNumber(node?.position?.y);
  const orientation = getHandleOrientation(handle);

  switch (orientation) {
    case 'left':
      return { x, y: y + height / 2 };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    case 'top':
      return { x: x + width / 2, y };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    default:
      return { x: x + width / 2, y: y + height / 2 };
  }
};

const getEdgeColor = (edge, fallback) => edge?.style?.stroke || edge?.data?.color || fallback;

const buildEdgePath = (sourceNode, targetNode, edge) => {
  const sourcePoint = getAnchorPoint(sourceNode, edge?.sourceHandle);
  const targetPoint = getAnchorPoint(targetNode, edge?.targetHandle);
  const midX = (sourcePoint.x + targetPoint.x) / 2;

  return `M ${sourcePoint.x} ${sourcePoint.y} L ${midX} ${sourcePoint.y} L ${midX} ${targetPoint.y} L ${targetPoint.x} ${targetPoint.y}`;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  toggleWaterPumpStatus
}) {
  const theme = useTheme();
  const canvasDropZoneRef = useRef(null);
  const translateRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const panStartRef = useRef({ x: 0, y: 0 });
  const pinchStartRef = useRef(1);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const [viewportToRestore, setViewportToRestore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [tempValue1, setTempValue1] = useState('');
  const [tempValue2, setTempValue2] = useState('');
  const [showComponentLabels, setShowComponentLabels] = useState(false);
  const [activeColor, setActiveColor] = useState(PIPE_COLORS.RED);
  const { registerDropHandler } = useNativeSchematicDrag();
  const lineColor = theme.colors?.text || theme.colors?.onSurface || '#333';
  const surfaceColor = theme.colors?.card || theme.colors?.surface || '#fff';
  const backgroundColor = theme.colors?.background || '#fafafa';
  const borderColor = theme.colors?.border || theme.colors?.outline || '#e0e0e0';
  const mutedActionColor = theme.colors?.text || theme.colors?.onSurface || '#333';
  const gridColor = theme.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)';
  
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const showLocalizedSnackbar = (id, defaultMessage, severity = 'success') => {
    setSnackbar({
      open: true,
      message: defaultMessage,
      severity
    });
  };

  const formatNodeTypeLabel = (nodeType) =>
    nodeType
      ? nodeType
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
      : '';

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
            (flow.edges || []).map((edge) => ({
              ...edge,
              type: edge.type || 'step',
              animated: false,
              data: {
                ...edge.data,
                themeLinked:
                  edge.data?.themeLinked ?? (!edge.style?.stroke && !edge.data?.customColor),
              },
              style: {
                strokeWidth: 2,
                stroke: getEdgeColor(edge, lineColor),
                ...edge.style,
              },
            }))
          );
          
          if (flow.viewport) {
            setViewportToRestore(flow.viewport);
          }
        } else {
          setNodes([]);
          setEdges([]);
        }
      } catch (err) {
        console.error('Failed to load schematic', err);
        showLocalizedSnackbar('Error loading schematic', 'Error loading schematic', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [propertyId, graphicType, lineColor]);

  useEffect(() => {
    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        if (!edge?.data?.themeLinked) {
          return edge;
        }

        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: lineColor,
            strokeWidth: 2,
          },
        };
      })
    );
  }, [lineColor]);

  const onSave = useCallback(async () => {
    if (propertyId) {
      const flow = {
        nodes,
        edges,
        viewport: { x: translateX.value, y: translateY.value, zoom: scale.value }
      };
      try {
        await saveSchematic(propertyId, graphicType, flow);
        showLocalizedSnackbar('Layout Saved!', 'Layout Saved!');
      } catch (err) {
        showLocalizedSnackbar('Failed to save.', 'Failed to save.', 'error');
      }
    }
  }, [nodes, edges, propertyId, graphicType]);

  useEffect(() => {
    if (!viewportToRestore) return;

    translateX.value = toNumber(viewportToRestore.x, 0);
    translateY.value = toNumber(viewportToRestore.y, 0);
    scale.value = toNumber(viewportToRestore.zoom, 1);
    translateRef.current = {
      x: toNumber(viewportToRestore.x, 0),
      y: toNumber(viewportToRestore.y, 0),
    };
    scaleRef.current = toNumber(viewportToRestore.zoom, 1);
  }, [viewportToRestore, scale, translateX, translateY]);

  const normalizeId = (id) =>
    String(id || '')
      .trim()
      .toLowerCase();

  useEffect(() => {
    if (nodes.length === 0) return;
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const dbId = node.data?.dbId;
        if (!dbId) return node;
        const cleanDbId = normalizeId(dbId);

        if (node.type === 'boiler') {
          const live = boilerList.find((b) => normalizeId(b.id) === cleanDbId);
          if (live)
            return {
              ...node,
              data: { ...node.data, status: live.status, details: { name: live.name, brand: live.brand, model: live.model } }
            };
        }
        if (node.type === 'waterPump') {
          const live = waterPumpList.find((p) => normalizeId(p.id) === cleanDbId);
          if (live)
            return {
              ...node,
              data: { ...node.data, status: live.status, details: { name: live.name, brand: live.brand, model: live.model } }
            };
        }
        if (node.type === 'flowMeter' || node.type === 'returnMeter') {
          const live = flowMeterList.find((f) => normalizeId(f.id) === cleanDbId);
          if (live)
            return {
              ...node,
              data: { ...node.data, value: live.value, details: { name: live.name, brand: live.brand, model: live.model } }
            };
        }
        if (node.type === 'sensor') {
          const live = pt1000Sensors.find((s) => normalizeId(s.id) === cleanDbId);
          if (live)
            return {
              ...node,
              data: { ...node.data, value: live.value, details: { name: live.name, brand: live.brand, model: live.model } }
            };
        }
        if (node.type === 'pressureSensor') {
          const live = pressureSensors.find((s) => normalizeId(s.id) === cleanDbId);
          if (live)
            return {
              ...node,
              data: { ...node.data, value: live.value, details: { name: live.name, brand: live.brand, model: live.model } }
            };
        }
        return node;
      })
    );
  }, [boilerList, waterPumpList, flowMeterList, pt1000Sensors, pressureSensors]);

  const onNodeClick = (event, node) => {
    if (!readOnly) {
      if (node.type === 'temperatureDifference') {
        setSelectedNode(node);
        setTempValue1(node.data.sensorId1 || '');
        setTempValue2(node.data.sensorId2 || '');
        setEditDialogOpen(true);
        return;
      }
      if (node.type === 'label') {
        setSelectedNode(node);
        setTempValue(node.data.label || '');
        setEditDialogOpen(true);
        return;
      }

      const dynamicTypes = ['boiler', 'waterPump', 'sensor', 'pressureSensor', 'flowMeter', 'returnMeter'];
      if (dynamicTypes.includes(node.type)) {
        setSelectedNode(node);
        setTempValue(node.data.dbId || node.id);
        setEditDialogOpen(true);
        return;
      }
      return;
    }

    const dbId = node.data.dbId || node.id;

    if (node.type === 'boiler' && toggleBoilerStatus) {
      const newStatus = node.data.status === 1 ? 0 : 1;
      setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, status: newStatus } } : n)));
      toggleBoilerStatus(dbId, newStatus).catch(() =>
        showLocalizedSnackbar('Failed to toggle boiler', 'Failed to toggle boiler', 'error')
      );
    }

    if (node.type === 'waterPump' && toggleWaterPumpStatus) {
      const newStatus = node.data.status === 1 ? 0 : 1;
      setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, status: newStatus } } : n)));
      toggleWaterPumpStatus(dbId, newStatus).catch(() =>
        showLocalizedSnackbar('Failed to toggle water pump', 'Failed to toggle water pump', 'error')
      );
    }
  };

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, []);

  const createNode = useCallback(
    (type, position = { x: 100, y: 100 }) => ({
      id: `${type}_${Date.now()}`,
      type,
      position,
      data: {
        label: type,
        status: 0,
        value: 0,
        dbId: '',
        details: {
          name: '',
          brand: '',
          model: '',
        },
        onDelete: deleteNode,
        readOnly,
        showLabels: showComponentLabels,
      },
    }),
    [deleteNode, readOnly, showComponentLabels]
  );

  useEffect(() => {
    const unregister = registerDropHandler((item, pageX, pageY) => {
      if (readOnly || !canvasDropZoneRef.current) {
        return;
      }

      canvasDropZoneRef.current.measureInWindow((x, y, width, height) => {
        const isInside =
          pageX >= x &&
          pageX <= x + width &&
          pageY >= y &&
          pageY <= y + height;

        if (!isInside) {
          return;
        }

        const canvasX = (pageX - x - translateRef.current.x) / scaleRef.current;
        const canvasY = (pageY - y - translateRef.current.y) / scaleRef.current;

        setNodes((currentNodes) =>
          currentNodes.concat(
            createNode(item.nodeType, {
              x: Math.max(0, Math.round(canvasX)),
              y: Math.max(0, Math.round(canvasY)),
            })
          )
        );
      });
    });

    return unregister;
  }, [createNode, readOnly, registerDropHandler]);

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onDelete: deleteNode,
          onEdit: () => onNodeClick(null, node),
          pt1000Sensors,
          readOnly,
          showLabels: showComponentLabels,
        },
      }))
    );
  }, [deleteNode, pt1000Sensors, readOnly, showComponentLabels]);

  const onConnect = useCallback((params) => {
    const newEdge = {
      id: `edge_${params.source}_${params.target}_${Date.now()}`,
      source: params.source,
      target: params.target,
      type: 'smoothstep',
      animated: false,
      data: {
        customColor: true,
        themeLinked: false,
      },
      style: {
        stroke: activeColor,
        strokeWidth: 2,
      },
    };
    setEdges((eds) => [...eds, newEdge]);
  }, [activeColor]);

  const getDeviceList = (type) => {
    switch (type) {
      case 'boiler':
        return boilerList;
      case 'waterPump':
        return waterPumpList;
      case 'flowMeter':
        return flowMeterList;
      case 'returnMeter':
        return flowMeterList;
      case 'sensor':
        return pt1000Sensors;
      case 'pressureSensor':
        return pressureSensors;
      default:
        return [];
    }
  };

  const handleDialogSave = () => {
    if (!selectedNode) return;

    const newId = tempValue.trim();

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== selectedNode.id) return n;

        if (n.type === 'label') {
          return { ...n, data: { ...n.data, label: newId } };
        }

        if (n.type === 'temperatureDifference') {
          return {
            ...n,
            data: {
              ...n.data,
              sensorId1: tempValue1,
              sensorId2: tempValue2,
              pt1000Sensors: pt1000Sensors
            }
          };
        }

        const list = getDeviceList(n.type);
        const foundItem = list.find((item) => normalizeId(item.id) === normalizeId(newId));

        return {
          ...n,
          data: {
            ...n.data,
            dbId: newId,
            ...(foundItem ? { status: foundItem.status, value: foundItem.value } : {})
          }
        };
      })
    );

    setEditDialogOpen(false);
    showLocalizedSnackbar('Node updated successfully', 'Node updated successfully');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: surfaceColor, borderBottomColor: borderColor }]}>
        <View style={[styles.colorPicker, { borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={() => setActiveColor(PIPE_COLORS.RED)}>
            <View style={[styles.colorCircle, { backgroundColor: PIPE_COLORS.RED, opacity: activeColor === PIPE_COLORS.RED ? 1 : 0.3 }]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveColor(PIPE_COLORS.BLUE)}>
            <View style={[styles.colorCircle, { backgroundColor: PIPE_COLORS.BLUE, opacity: activeColor === PIPE_COLORS.BLUE ? 1 : 0.3 }]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveColor(PIPE_COLORS.ORANGE)}>
            <View style={[styles.colorCircle, { backgroundColor: PIPE_COLORS.ORANGE, opacity: activeColor === PIPE_COLORS.ORANGE ? 1 : 0.3 }]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveColor(PIPE_COLORS.GREY)}>
            <View style={[styles.colorCircle, { backgroundColor: PIPE_COLORS.GREY, opacity: activeColor === PIPE_COLORS.GREY ? 1 : 0.3 }]} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setShowComponentLabels(!showComponentLabels)}>
            <Icon name={showComponentLabels ? "visibility" : "visibility-off"} size={24} color={mutedActionColor} />
          </TouchableOpacity>
          
          {!readOnly && (
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors?.primary || '#4caf50' }]} onPress={onSave}>
              <Icon name="save" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <PinchGestureHandler
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === State.BEGAN) {
            pinchStartRef.current = scaleRef.current;
          }
        }}
        onGestureEvent={(event) => {
          const nextScale = Math.max(0.4, Math.min(2.5, pinchStartRef.current * event.nativeEvent.scale));
          scaleRef.current = nextScale;
          scale.value = nextScale;
        }}
      >
        <View ref={canvasDropZoneRef} collapsable={false} style={styles.canvasContainer}>
          <PanGestureHandler
            onHandlerStateChange={(event) => {
              if (event.nativeEvent.state === State.BEGAN) {
                panStartRef.current = { ...translateRef.current };
              }
            }}
            onGestureEvent={(event) => {
              translateRef.current.x = panStartRef.current.x + event.nativeEvent.translationX;
              translateRef.current.y = panStartRef.current.y + event.nativeEvent.translationY;
              translateX.value = translateRef.current.x;
              translateY.value = translateRef.current.y;
            }}
          >
            <Animated.View
              style={[
                styles.canvas,
                { backgroundColor },
                {
                  transform: [
                    { translateX: translateX.value },
                    { translateY: translateY.value },
                    { scale: scale.value },
                  ],
                },
              ]}
            >
              <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
                {Array.from({ length: 120 }).map((_, index) => {
                  const offset = index * 20;
                  return (
                    <Path
                      key={`grid-v-${index}`}
                      d={`M ${offset} 0 L ${offset} 5000`}
                      stroke={gridColor}
                      strokeWidth={1}
                    />
                  );
                })}
                {Array.from({ length: 120 }).map((_, index) => {
                  const offset = index * 20;
                  return (
                    <Path
                      key={`grid-h-${index}`}
                      d={`M 0 ${offset} L 5000 ${offset}`}
                      stroke={gridColor}
                      strokeWidth={1}
                    />
                  );
                })}
              </Svg>
              <Svg style={StyleSheet.absoluteFill}>
                {edges.map((edge) => {
                  const sourceNode = nodes.find((n) => n.id === edge.source);
                  const targetNode = nodes.find((n) => n.id === edge.target);
                  
                  if (!sourceNode || !targetNode) return null;
                  
                  return (
                    <Path
                      key={edge.id}
                      d={buildEdgePath(sourceNode, targetNode, edge)}
                      stroke={getEdgeColor(edge, lineColor)}
                      strokeWidth={edge.style?.strokeWidth || 2}
                      fill="none"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  );
                })}
              </Svg>
              
              {nodes.map((node) => {
                const NodeComponent = nodeTypes[node.type];
                if (!NodeComponent) return null;
                
                return (
                  <Draggable
                    key={node.id}
                    x={node.position.x}
                    y={node.position.y}
                    onDrag={(event, gestureState) => {
                      if (!readOnly) {
                        setNodes((nds) =>
                          nds.map((n) =>
                            n.id === node.id
                              ? { ...n, position: { x: gestureState.moveX, y: gestureState.moveY } }
                              : n
                          )
                        );
                      }
                    }}
                    disabled={readOnly}
                  >
                    <TouchableOpacity activeOpacity={0.9} onPress={() => onNodeClick(null, node)}>
                      <NodeComponent id={node.id} data={{ ...node.data, showLabels: showComponentLabels }} />
                    </TouchableOpacity>
                  </Draggable>
                );
              })}
            </Animated.View>
          </PanGestureHandler>
        </View>
      </PinchGestureHandler>

      {/* Snackbar/Alert replacement */}
      {snackbar.open && (
        <View style={[styles.snackbar, { backgroundColor: theme.dark ? '#1f1f1f' : '#333' }]}>
          <Text style={styles.snackbarText}>{snackbar.message}</Text>
          <TouchableOpacity onPress={() => setSnackbar({ ...snackbar, open: false })}>
            <Text style={[styles.snackbarAction, { color: theme.colors?.primary || '#4caf50' }]}>OK</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Dialog for editing */}
      <Modal
        visible={editDialogOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditDialogOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: surfaceColor }]}>
            <Text style={[styles.modalTitle, { color: lineColor }]}>
              {selectedNode?.type === 'label' ? 'Edit Label' : 
               selectedNode?.type === 'temperatureDifference' ? 'Assign Temperature Sensors' :
               `Assign ${formatNodeTypeLabel(selectedNode?.type)}`}
            </Text>
            
            <ScrollView>
              {selectedNode?.type === 'label' && (
                <TextInput
                  style={[styles.input, { borderColor, color: lineColor, backgroundColor }]}
                  value={tempValue}
                  onChangeText={setTempValue}
                  placeholder="Label Text"
                  placeholderTextColor={theme.dark ? '#9aa0aa' : '#777'}
                  autoFocus
                />
              )}
              
              {selectedNode?.type === 'temperatureDifference' && (
                <View>
                  <Text style={[styles.label, { color: lineColor }]}>Sensor 1 (Flow)</Text>
                  <ScrollView style={styles.pickerList}>
                    {pt1000Sensors.map((s) => (
                      <TouchableOpacity
                        key={s.id}
                        style={[styles.pickerItem, { borderBottomColor: borderColor }]}
                        onPress={() => setTempValue1(s.id)}
                      >
                        <Text style={{ color: lineColor }}>{s.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  
                  <Text style={[styles.label, { color: lineColor }]}>Sensor 2 (Return)</Text>
                  <ScrollView style={styles.pickerList}>
                    {pt1000Sensors.map((s) => (
                      <TouchableOpacity
                        key={s.id}
                        style={[styles.pickerItem, { borderBottomColor: borderColor }]}
                        onPress={() => setTempValue2(s.id)}
                      >
                        <Text style={{ color: lineColor }}>{s.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              
              {!['label', 'temperatureDifference'].includes(selectedNode?.type) && (
                <ScrollView style={styles.pickerList}>
                  {getDeviceList(selectedNode?.type).map((device) => (
                    <TouchableOpacity
                      key={device.id}
                      style={[styles.pickerItem, { borderBottomColor: borderColor }]}
                      onPress={() => setTempValue(device.id)}
                    >
                      <Text style={{ color: lineColor }}>{device.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditDialogOpen(false)} style={styles.modalButton}>
                <Text style={{ color: lineColor }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDialogSave} style={[styles.modalButton, styles.modalButtonPrimary, { backgroundColor: theme.colors?.primary || '#2196f3' }]}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderBottomWidth: 1,
  },
  colorPicker: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  saveButton: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontFamily: appFonts.bold.fontFamily,
  },
  canvasContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
  },
  snackbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snackbarText: {
    color: '#fff',
    flex: 1,
  },
  snackbarAction: {
    color: '#4caf50',
    marginLeft: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontFamily: appFonts.bold.fontFamily,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
    fontFamily: appFonts.bold.fontFamily,
  },
  pickerList: {
    maxHeight: 200,
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalButtonPrimary: {
    backgroundColor: '#2196f3',
    borderRadius: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontFamily: appFonts.bold.fontFamily,
  },
});
