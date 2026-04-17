import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
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
import Svg, { Line, Path, Circle as SvgCircle, G, Text as SvgText, Defs, Marker } from 'react-native-svg';
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import { saveSchematic, getSchematic } from '../../api/useSchematicService'; // ✅ Keep your original import

// Node Components (same as before)
const PointNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={styles.pointNode}>
      <SvgCircle cx="10" cy="10" r="8" fill={data.color || '#333'} />
      {data.showLabels && <Text style={styles.nodeLabel}>{data.label}</Text>}
    </View>
  </TouchableOpacity>
);

const LabelNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={styles.labelNode}>
      <Text style={styles.labelText}>{data.label || 'Label'}</Text>
    </View>
  </TouchableOpacity>
);

const BoilerNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.boilerNode]}>
      <Icon name="whatshot" size={30} color={data.status === 1 ? '#ff5722' : '#999'} />
      <Text style={styles.nodeTitle}>Boiler</Text>
      {data.showLabels && data.details?.name && (
        <Text style={styles.nodeSubtitle}>{data.details.name}</Text>
      )}
    </View>
  </TouchableOpacity>
);

const WaterPumpNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.waterPumpNode]}>
      <Icon name="opacity" size={30} color={data.status === 1 ? '#2196f3' : '#999'} />
      <Text style={styles.nodeTitle}>Pump</Text>
      {data.showLabels && data.details?.name && (
        <Text style={styles.nodeSubtitle}>{data.details.name}</Text>
      )}
    </View>
  </TouchableOpacity>
);

const SensorNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.sensorNode]}>
      <Icon name="thermostat" size={30} color="#4caf50" />
      <Text style={styles.nodeTitle}>Sensor</Text>
      {data.value !== undefined && <Text style={styles.nodeValue}>{data.value}°C</Text>}
      {data.showLabels && data.details?.name && (
        <Text style={styles.nodeSubtitle}>{data.details.name}</Text>
      )}
    </View>
  </TouchableOpacity>
);

const ValveNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.valveNode]}>
      <Icon name="settings" size={30} color="#ff9800" />
      <Text style={styles.nodeTitle}>Valve</Text>
    </View>
  </TouchableOpacity>
);

const FlowMeterNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.flowMeterNode]}>
      <Icon name="speed" size={30} color="#9c27b0" />
      <Text style={styles.nodeTitle}>Flow Meter</Text>
      {data.value !== undefined && <Text style={styles.nodeValue}>{data.value} L/min</Text>}
    </View>
  </TouchableOpacity>
);

const PressureSensorNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.pressureSensorNode]}>
      <Icon name="gauge" size={30} color="#f44336" />
      <Text style={styles.nodeTitle}>Pressure</Text>
      {data.value !== undefined && <Text style={styles.nodeValue}>{data.value} bar</Text>}
    </View>
  </TouchableOpacity>
);

const HeatExchangerNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.heatExchangerNode]}>
      <Icon name="swap-horiz" size={30} color="#795548" />
      <Text style={styles.nodeTitle}>Heat Exchanger</Text>
    </View>
  </TouchableOpacity>
);

const ExpansionVesselNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.expansionVesselNode]}>
      <Icon name="circle" size={30} color="#607d8b" />
      <Text style={styles.nodeTitle}>Expansion Vessel</Text>
    </View>
  </TouchableOpacity>
);

const ControllerNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.controllerNode]}>
      <Icon name="devices" size={30} color="#3f51b5" />
      <Text style={styles.nodeTitle}>Controller</Text>
    </View>
  </TouchableOpacity>
);

const BoosterPumpNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.boosterPumpNode]}>
      <Icon name="trending-up" size={30} color="#00bcd4" />
      <Text style={styles.nodeTitle}>Booster Pump</Text>
    </View>
  </TouchableOpacity>
);

const TemperatureDifferenceNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.temperatureDifferenceNode]}>
      <Icon name="compare-arrows" size={30} color="#e91e63" />
      <Text style={styles.nodeTitle}>Temp Diff</Text>
      {data.value !== undefined && <Text style={styles.nodeValue}>{data.value}°C</Text>}
    </View>
  </TouchableOpacity>
);

const HotWaterTankNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.hotWaterTankNode]}>
      <Icon name="local-drink" size={30} color="#ff5722" />
      <Text style={styles.nodeTitle}>Hot Water Tank</Text>
    </View>
  </TouchableOpacity>
);

const ColdWaterTankNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.coldWaterTankNode]}>
      <Icon name="water-drop" size={30} color="#2196f3" />
      <Text style={styles.nodeTitle}>Cold Water Tank</Text>
    </View>
  </TouchableOpacity>
);

const ReturnMeterNode = ({ data, onPress }) => (
  <TouchableOpacity onPress={() => onPress(data)}>
    <View style={[styles.nodeContainer, styles.returnMeterNode]}>
      <Icon name="rotate-left" size={30} color="#009688" />
      <Text style={styles.nodeTitle}>Return Meter</Text>
    </View>
  </TouchableOpacity>
);

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
  const reactFlowWrapper = useRef(null);
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
  const lineColor = theme.palette?.text?.primary || '#333';
  
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const showLocalizedSnackbar = (id, defaultMessage, severity = 'success') => {
    setSnackbar({
      open: true,
      message: defaultMessage, // You'll need to implement FormattedMessage equivalent
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
        const data = await getSchematic(propertyId, graphicType); // ✅ Using your original API
console.log("schematic:::",data)
        if (data && data.graphics_data) {
          const flow = data.graphics_data;
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          
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
  }, [propertyId, graphicType]);

  const onSave = useCallback(async () => {
    if (propertyId) {
      const flow = {
        nodes,
        edges,
        viewport: { x: translateX.value, y: translateY.value, zoom: scale.value }
      };
      try {
        await saveSchematic(propertyId, graphicType, { graphics_data: flow }); // ✅ Using your original API
        showLocalizedSnackbar('Layout Saved!', 'Layout Saved!');
      } catch (err) {
        showLocalizedSnackbar('Failed to save.', 'Failed to save.', 'error');
      }
    }
  }, [nodes, edges, propertyId, graphicType]);

  // Keep all your original functions
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

  const onConnect = useCallback((params) => {
    // Implement connection logic for React Native
    const newEdge = {
      id: `edge_${params.source}_${params.target}_${Date.now()}`,
      source: params.source,
      target: params.target,
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: activeColor,
        strokeWidth: 2
      }
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

  const onDrop = useCallback((event) => {
    // Implement drag and drop for React Native
    // This would need to be adapted for React Native's drag and drop system
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.toolbar}>
            {Object.keys(nodeTypes).map((type) => (
              !readOnly && (
                <TouchableOpacity
                  key={type}
                  style={styles.toolbarButton}
                  onPress={() => {
                    const newNode = {
                      id: `${type}_${Date.now()}`,
                      type,
                      position: { x: 100, y: 100 },
                      data: {
                        label: type,
                        status: 0,
                        value: 0,
                        dbId: '',
                        details: {
                          name: '',
                          brand: '',
                          model: ''
                        },
                        onDelete: deleteNode,
                        readOnly,
                        showLabels: showComponentLabels
                      }
                    };
                    setNodes((nds) => [...nds, newNode]);
                  }}
                >
                  <Text style={styles.toolbarButtonText}>
                    {formatNodeTypeLabel(type)}
                  </Text>
                </TouchableOpacity>
              )
            ))}
          </View>
        </ScrollView>
        
        <View style={styles.colorPicker}>
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
            <Icon name={showComponentLabels ? "visibility" : "visibility-off"} size={24} />
          </TouchableOpacity>
          
          {!readOnly && (
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Icon name="save" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <PinchGestureHandler
        onGestureEvent={(event) => {
          scale.value = event.nativeEvent.scale;
        }}
      >
        <Animated.View style={styles.canvasContainer}>
          <PanGestureHandler
            onGestureEvent={(event) => {
              translateX.value += event.nativeEvent.translationX;
              translateY.value += event.nativeEvent.translationY;
            }}
          >
            <Animated.View
              style={[
                styles.canvas,
                {
                  transform: [
                    { translateX: translateX.value },
                    { translateY: translateY.value },
                    { scale: scale.value },
                  ],
                },
              ]}
            >
              <Svg style={StyleSheet.absoluteFill}>
                {edges.map((edge) => {
                  const sourceNode = nodes.find((n) => n.id === edge.source);
                  const targetNode = nodes.find((n) => n.id === edge.target);
                  
                  if (!sourceNode || !targetNode) return null;
                  
                  return (
                    <Line
                      key={edge.id}
                      x1={sourceNode.position.x + 50}
                      y1={sourceNode.position.y + 50}
                      x2={targetNode.position.x + 50}
                      y2={targetNode.position.y + 50}
                      stroke={edge.style?.stroke || activeColor}
                      strokeWidth={2}
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
                    <TouchableOpacity onPress={(event) => onNodeClick(event, node)}>
                      <NodeComponent
                        data={{ ...node.data, showLabels: showComponentLabels }}
                        onPress={onNodeClick}
                      />
                    </TouchableOpacity>
                  </Draggable>
                );
              })}
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>

      {/* Snackbar/Alert replacement */}
      {snackbar.open && (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>{snackbar.message}</Text>
          <TouchableOpacity onPress={() => setSnackbar({ ...snackbar, open: false })}>
            <Text style={styles.snackbarAction}>OK</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedNode?.type === 'label' ? 'Edit Label' : 
               selectedNode?.type === 'temperatureDifference' ? 'Assign Temperature Sensors' :
               `Assign ${formatNodeTypeLabel(selectedNode?.type)}`}
            </Text>
            
            <ScrollView>
              {selectedNode?.type === 'label' && (
                <TextInput
                  style={styles.input}
                  value={tempValue}
                  onChangeText={setTempValue}
                  placeholder="Label Text"
                  autoFocus
                />
              )}
              
              {selectedNode?.type === 'temperatureDifference' && (
                <View>
                  <Text style={styles.label}>Sensor 1 (Flow)</Text>
                  <ScrollView style={styles.pickerList}>
                    {pt1000Sensors.map((s) => (
                      <TouchableOpacity
                        key={s.id}
                        style={styles.pickerItem}
                        onPress={() => setTempValue1(s.id)}
                      >
                        <Text>{s.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  
                  <Text style={styles.label}>Sensor 2 (Return)</Text>
                  <ScrollView style={styles.pickerList}>
                    {pt1000Sensors.map((s) => (
                      <TouchableOpacity
                        key={s.id}
                        style={styles.pickerItem}
                        onPress={() => setTempValue2(s.id)}
                      >
                        <Text>{s.name}</Text>
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
                      style={styles.pickerItem}
                      onPress={() => setTempValue(device.id)}
                    >
                      <Text>{device.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditDialogOpen(false)} style={styles.modalButton}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDialogSave} style={[styles.modalButton, styles.modalButtonPrimary]}>
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
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toolbar: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toolbarButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  toolbarButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    marginLeft: 4,
  },
  canvasContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  nodeContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  boilerNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff5722',
  },
  waterPumpNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  sensorNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  valveNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  flowMeterNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#9c27b0',
  },
  pressureSensorNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  heatExchangerNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#795548',
  },
  expansionVesselNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#607d8b',
  },
  controllerNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#3f51b5',
  },
  boosterPumpNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#00bcd4',
  },
  temperatureDifferenceNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#e91e63',
  },
  hotWaterTankNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff5722',
  },
  coldWaterTankNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  returnMeterNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#009688',
  },
  pointNode: {
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  labelNode: {
    padding: 8,
    backgroundColor: '#fff3e0',
    borderRadius: 4,
  },
  labelText: {
    fontSize: 14,
    color: '#333',
  },
  nodeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  nodeSubtitle: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  nodeValue: {
    fontSize: 10,
    color: '#2196f3',
    marginTop: 2,
  },
  nodeLabel: {
    fontSize: 10,
    marginTop: 2,
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
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
  },
});