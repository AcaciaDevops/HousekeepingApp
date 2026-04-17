import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, {
  Rect,
  Circle,
  Line,
  Path,
  Polyline,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

// Helper component for SVG wrapper
const SvgWrapper = ({ children, viewBox, color, width, height, strokeWidth = 0.5 }) => {
  const theme = useTheme();
  return (
    <Svg
      viewBox={viewBox || '0 0 24 24'}
      width={width || 24}
      height={height || 24}
      fill="none"
      stroke={color || theme.colors.onSurface}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </Svg>
  );
};

// Handle component for connection points (simplified for React Native)
const Handle = ({ position, id, style }) => {
  // In React Native, handles are touch targets for connections
  // This is a simplified version - you'll need to implement actual connection logic
  return (
    <View
      style={[
        styles.handle,
        {
          [position]: position === 'top' ? -6 : position === 'bottom' ? -6 : '50%',
          left: style?.left || '50%',
          top: style?.top || '50%',
        },
      ]}
    />
  );
};

export const PointNode = ({ data }) => {
  const theme = useTheme();
  return (
    <View style={styles.pointNode}>
      <View style={[styles.point, { backgroundColor: theme.colors.onSurface }]} />
      {/* Handles for connections - positioned around the point */}
      <View style={[styles.handleTop, styles.handleHidden]} />
      <View style={[styles.handleBottom, styles.handleHidden]} />
      <View style={[styles.handleLeft, styles.handleHidden]} />
      <View style={[styles.handleRight, styles.handleHidden]} />
    </View>
  );
};

export const LabelNode = ({ data }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.labelNode,
        {
          borderColor: data.readOnly ? 'transparent' : theme.colors.outline,
          borderWidth: data.readOnly ? 0 : 1,
          borderStyle: 'dashed',
        },
      ]}
    >
      <Text style={[styles.labelText, { color: theme.colors.onSurface }]}>
        {data.label || 'New Label'}
      </Text>
    </View>
  );
};

export const BoilerNode = ({ id, data }) => {
  const theme = useTheme();
  const isActive = data.status === 1;
  const gradientId = `boiler-grad-${id}`;

  return (
    <View style={styles.boilerNode}>
      {/* Handles */}
      <View style={[styles.handleTop, { left: '40%' }]} />
      <View style={[styles.handleTop, { left: '60%' }]} />
      <View style={[styles.handleBottom, { left: '40%' }]} />
      <View style={[styles.handleBottom, { left: '60%' }]} />
      <View style={[styles.handleLeft, { top: '40%', left: '11%' }]} />
      <View style={[styles.handleLeft, { top: '60%', left: '11%' }]} />
      <View style={[styles.handleRight, { top: '40%', right: '11%' }]} />
      <View style={[styles.handleRight, { top: '60%', right: '11%' }]} />

      {/* SVG Graphic */}
      <SvgWrapper viewBox="0 0 20 26" width={80} height={100} color={isActive ? 'brown' : 'grey'}>
        <Rect
          x="2"
          y="0.5"
          width="16"
          height="25"
          rx="1.5"
          fill={theme.colors.surface}
          stroke="currentColor"
        />
        <Path
          d="M10 14c-1 1-1.5 1.8-1.5 2.7a1.5 1.5 0 0 0 3 0c0-0.9-0.5-1.7-1.5-2.7z"
          fill={isActive ? 'orange' : 'none'}
          stroke="none"
        />
        <Circle cx="7.5" cy="19" r="1" fill={isActive ? 'orange' : 'none'} />
        <Circle cx="12.5" cy="19" r="1" fill={isActive ? 'orange' : 'none'} />
      </SvgWrapper>

      {/* Status Badge */}
      <View style={styles.statusBadge}>
        <Text style={[styles.statusText, { backgroundColor: isActive ? theme.colors.primary : theme.colors.error }]}>
          {isActive ? 'ON' : 'OFF'}
        </Text>
      </View>

      {/* Brand */}
      {data.details?.brand && (
        <View style={styles.brandBadge}>
          <Text style={styles.brandText}>{data.details.brand}</Text>
        </View>
      )}

      {/* Label */}
      {data.showLabels !== false && (
        <View style={styles.nodeLabel}>
          <Text style={styles.nodeLabelText}>{data.details?.name || 'Boiler'}</Text>
        </View>
      )}
    </View>
  );
};

export const HotWaterTankNode = ({ id, data }) => {
  const theme = useTheme();
  const gradientId = `tank-grad-${id}`;

  return (
    <View style={styles.tankNode}>
      <View style={[styles.handleTop, { left: '47%' }]} />
      <View style={[styles.handleBottom, { left: '47%' }]} />
      <View style={[styles.handleLeft, { top: '87%', left: '5%' }]} />
      <View style={[styles.handleRight, { top: '34%' }]} />
      <View style={[styles.handleRight, { top: '87%' }]} />

      <SvgWrapper viewBox="6.5 1.5 12 19" width={80} height={120} strokeWidth={0.5}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0%" stopColor="#ffeb3b" />
            <Stop offset="50%" stopColor="#ff9800" />
            <Stop offset="100%" stopColor="#f44336" />
          </LinearGradient>
        </Defs>
        <Path
          d="M 7 20 L 17 20 L 17 7 A 5 5 0 0 0 7 7 Z"
          fill={`url(#${gradientId})`}
          stroke="red"
        />
        <Path
          d="M 10 18 L 14 16 L 10 14 L 14 12 L 10 10 L 14 8"
          fill="none"
          stroke="grey"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />
        <Line x1="14" y1="8" x2="18" y2="8" stroke="grey" strokeWidth="0.8" strokeOpacity="0.6" />
        <Line x1="10" y1="18" x2="18" y2="18" stroke="grey" strokeWidth="0.8" strokeOpacity="0.6" />
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.nodeLabel}>
          <Text style={styles.nodeLabelText}>{data.details?.name || 'Hot Water Tank'}</Text>
        </View>
      )}
    </View>
  );
};

export const ColdWaterTankNode = ({ id, data }) => {
  const theme = useTheme();

  return (
    <View style={styles.tankNode}>
      <View style={[styles.handleTop, { left: '50%' }]} />
      <View style={[styles.handleBottom, { left: '50%' }]} />
      <View style={[styles.handleLeft, { top: '50%', left: '12%' }]} />
      <View style={[styles.handleRight, { top: '50%', right: '12%' }]} />

      <SvgWrapper viewBox="2 3.5 20 12.5" width={120} height={70} strokeWidth={0.5}>
        <Rect x="4" y="5" width="16" height="10" fill="none" stroke="currentColor" />
        <Rect x="4.5" y="7.5" width="15" height="7" fill="#2196f3" fillOpacity="0.4" stroke="none" />
        <Line x1="4" y1="7.5" x2="20" y2="7.5" stroke="#2196f3" strokeWidth="0.5" strokeDasharray="1,1" />
        <Rect x="3" y="4" width="18" height="1" rx="0.5" fill="currentColor" />
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.nodeLabel}>
          <Text style={styles.nodeLabelText}>{data.details?.name || 'Cold Water Tank'}</Text>
        </View>
      )}
    </View>
  );
};

export const FlowMeterNode = ({ id, data }) => {
  const theme = useTheme();

  return (
    <View style={styles.meterNode}>
      <View style={styles.valueBadge}>
        <Text style={styles.valueText}>{data.value || 0}m³</Text>
      </View>

      <View style={[styles.handleTop, { left: '50%' }]} />
      <View style={[styles.handleBottom, { left: '50%' }]} />
      <View style={[styles.handleLeft, { top: '50%' }]} />
      <View style={[styles.handleRight, { top: '50%' }]} />

      <SvgWrapper viewBox="2.5 6.5 19 11" width={40} height={22} strokeWidth={0.5}>
        <Rect x="7" y="7" width="10" height="10" rx="1.5" />
        <Circle cx="12" cy="12" r="3" />
        <Line x1="12" y1="12" x2="14.5" y2="11" />
        <Line x1="3" y1="12" x2="7" y2="12" />
        <Polyline points="5.5,10.5 7,12 5.5,13.5" fill="none" />
        <Line x1="17" y1="12" x2="21" y2="12" />
        <Polyline points="19.5,10.5 21,12 19.5,13.5" fill="none" />
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.bottomLabel}>
          <Text style={styles.labelSmallText}>{data.details?.name || 'Flow Meter'}</Text>
        </View>
      )}
    </View>
  );
};

export const ReturnMeterNode = ({ id, data }) => {
  const theme = useTheme();

  return (
    <View style={styles.meterNode}>
      <View style={styles.valueBadge}>
        <Text style={styles.valueText}>{data.value || 0}m³</Text>
      </View>

      <View style={[styles.handleTop, { left: '50%' }]} />
      <View style={[styles.handleBottom, { left: '50%' }]} />
      <View style={[styles.handleLeft, { top: '50%' }]} />
      <View style={[styles.handleRight, { top: '50%' }]} />

      <SvgWrapper viewBox="2.5 6.5 19 11" width={45} height={22} strokeWidth={0.5}>
        <Rect x="7" y="7" width="10" height="10" rx="1.5" />
        <Circle cx="12" cy="12" r="3" />
        <Line x1="12" y1="12" x2="9.5" y2="11" />
        <Line x1="3" y1="12" x2="7" y2="12" />
        <Polyline points="3,12 4.5,10.5 4.5,13.5" fill="none" />
        <Line x1="17" y1="12" x2="21" y2="12" />
        <Polyline points="21,12 19.5,10.5 19.5,13.5" fill="none" />
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.bottomLabel}>
          <Text style={styles.labelSmallText}>{data.details?.name || 'Return Meter'}</Text>
        </View>
      )}
    </View>
  );
};

export const SensorNode = ({ id, data }) => {
  const theme = useTheme();

  return (
    <View style={styles.sensorNode}>
      <View style={[styles.handleTop, { left: '50%' }]} />
      <View style={[styles.handleBottom, { left: '50%' }]} />
      <View style={[styles.handleLeft, { top: '50%' }]} />
      <View style={[styles.handleRight, { top: '50%' }]} />

      <SvgWrapper viewBox="0 0 35 15" width={35} height={15}>
        <Rect
          x="0.5"
          y="0.5"
          width="34"
          height="14"
          rx="1"
          fill={theme.colors.surface}
          stroke="currentColor"
          strokeWidth={0.5}
        />
        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          fontSize="7"
          fill={theme.colors.onSurface}
          alignmentBaseline="middle"
        >
          {data.value || '--'}°C
        </SvgText>
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.topLabel}>
          <Text style={styles.labelSmallText}>{data.details?.name || 'Temperature Sensor'}</Text>
        </View>
      )}
    </View>
  );
};

export const PressureSensorNode = ({ id, data }) => {
  const theme = useTheme();

  return (
    <View style={styles.sensorNode}>
      <View style={[styles.handleTop, { left: '50%' }]} />
      <View style={[styles.handleBottom, { left: '50%' }]} />
      <View style={[styles.handleLeft, { top: '50%' }]} />
      <View style={[styles.handleRight, { top: '50%' }]} />

      <SvgWrapper viewBox="0 0 35 15" width={35} height={15}>
        <Rect
          x="0.5"
          y="0.5"
          width="34"
          height="14"
          rx="1"
          fill={theme.colors.surface}
          stroke="currentColor"
          strokeWidth={0.5}
        />
        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          fontSize="7"
          fill={theme.colors.onSurface}
          alignmentBaseline="middle"
        >
          {data.value || '--'}Pa
        </SvgText>
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.topLabel}>
          <Text style={styles.labelSmallText}>{data.details?.name || 'Pressure Sensor'}</Text>
        </View>
      )}
    </View>
  );
};

export const WaterPumpNode = ({ id, data }) => {
  const theme = useTheme();
  const isActive = data.status === 1;

  return (
    <View style={styles.pumpNode}>
      <View style={[styles.handleTop, { left: '50%' }]} />
      <View style={[styles.handleBottom, { left: '50%' }]} />
      <View style={[styles.handleLeft, { top: '50%' }]} />
      <View style={[styles.handleRight, { top: '50%' }]} />

      <SvgWrapper viewBox="6.5 6.5 11 11" width={30} height={30} strokeWidth={0.5}>
        <Circle cx="12" cy="12" r="5" stroke="currentColor" />
        <Path
          d="M10 8L16 12L10 16Z"
          fill={isActive ? theme.colors.primary : theme.colors.error}
          stroke="currentColor"
          strokeWidth={0.5}
          strokeLinejoin="round"
        />
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.nodeLabel}>
          <Text style={styles.nodeLabelText}>{data.details?.name || 'Water Pump'}</Text>
        </View>
      )}
    </View>
  );
};

export const ValveNode = ({ id, data }) => {
  const theme = useTheme();
  const isActive = data.status === 1;

  return (
    <View style={styles.valveNode}>
      <View style={[styles.handleTop, { top: '25%', left: '50%' }]} />
      <View style={[styles.handleBottom, { left: '50%' }]} />
      <View style={[styles.handleLeft, { top: '75%' }]} />
      <View style={[styles.handleRight, { top: '75%' }]} />

      <SvgWrapper
        viewBox="2.5 5.5 19 8.5"
        width={80}
        height={40}
        color={isActive ? theme.colors.primary : theme.colors.error}
        strokeWidth={0.5}
      >
        <Line x1="3" y1="12" x2="21" y2="12" />
        <Rect x="9" y="10" width="6" height="4" fill={theme.colors.surface} />
        <Line x1="12" y1="7" x2="12" y2="10" />
        <Line x1="10.5" y1="6" x2="13.5" y2="9" />
        <Line x1="13.5" y1="6" x2="10.5" y2="9" />
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.nodeLabel}>
          <Text style={styles.nodeLabelText}>{data.details?.name || 'Valve'}</Text>
        </View>
      )}
    </View>
  );
};

export const HeatExchangerNode = ({ id, data }) => {
  const theme = useTheme();
  const gradientId = `ex-grad-${id}`;

  return (
    <View style={styles.hexNode}>
      <View style={[styles.handleLeft, { top: '15.4%' }]} />
      <View style={[styles.handleLeft, { top: '84.6%' }]} />
      <View style={[styles.handleRight, { top: '15.4%' }]} />
      <View style={[styles.handleRight, { top: '84.6%' }]} />

      <SvgWrapper viewBox="0 0 16 26" width={50} height={70} color="orange" strokeWidth={1}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0%" stopColor="blue" />
            <Stop offset="100%" stopColor="red" />
          </LinearGradient>
        </Defs>
        <Rect x="4" y="1" width="8" height="24" rx="1" fill={`url(#${gradientId})`} stroke="currentColor" />
        <Path
          d="M6 5 L10 7 L6 9 L10 11 L6 13 L10 15 L6 17 L10 19 L6 21"
          stroke="currentColor"
          fill="none"
          strokeWidth={0.8}
        />
        <Line x1="0" y1="4" x2="4" y2="4" stroke="currentColor" />
        <Polyline points="1.5,2.5 0.5,4 1.5,5.5" stroke="currentColor" fill="none" />
        <Line x1="12" y1="4" x2="16" y2="4" stroke="currentColor" />
        <Line x1="0" y1="22" x2="4" y2="22" stroke="currentColor" />
        <Polyline points="1.5,20.5 0.5,22 1.5,23.5" stroke="currentColor" fill="none" />
        <Line x1="12" y1="22" x2="16" y2="22" stroke="currentColor" />
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.nodeLabel}>
          <Text style={styles.nodeLabelText}>{data.details?.name || 'Heat Exchanger'}</Text>
        </View>
      )}
    </View>
  );
};

export const ExpansionVesselNode = ({ id, data }) => {
  const theme = useTheme();

  return (
    <View style={styles.vesselNode}>
      <View style={[styles.handleTop, { left: '50%' }]} />
      <View style={[styles.handleBottom, { left: '50%' }]} />
      <View style={[styles.handleLeft, { top: '50%' }]} />
      <View style={[styles.handleRight, { top: '50%' }]} />

      <SvgWrapper viewBox="8.5 4.5 7 16" width={40} height={90} strokeWidth={0.5}>
        <Rect x="9" y="5" width="6" height="12" rx="3" fill="currentColor" fillOpacity={0.2} />
        <Line x1="12" y1="17" x2="12" y2="20" />
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.nodeLabel}>
          <Text style={styles.nodeLabelText}>{data.details?.name || 'Exp. Vessel'}</Text>
        </View>
      )}
    </View>
  );
};

export const ControllerNode = ({ id, data }) => {
  const theme = useTheme();

  return (
    <View style={styles.controllerNode}>
      <View style={[styles.handleTop, { left: '50%' }]} />
      <View style={[styles.handleBottom, { left: '50%' }]} />
      <View style={[styles.handleLeft, { top: '50%' }]} />
      <View style={[styles.handleRight, { top: '50%' }]} />

      <SvgWrapper viewBox="4.5 3.5 15 17" width={35} height={40} strokeWidth={0.5}>
        <Rect x="5" y="4" width="14" height="16" rx="1.5" />
        <Rect x="7" y="6" width="6" height="4" />
        <Circle cx="14.5" cy="13" r="0.9" />
        <Circle cx="11.5" cy="13" r="0.9" />
        <Circle cx="8.5" cy="13" r="0.9" />
        <Circle cx="14.5" cy="16" r="0.9" />
        <Circle cx="11.5" cy="16" r="0.9" />
        <Circle cx="8.5" cy="16" r="0.9" />
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.nodeLabel}>
          <Text style={styles.nodeLabelText}>{data.details?.name || 'PLC Controller'}</Text>
        </View>
      )}
    </View>
  );
};

export const BoosterPumpNode = ({ id, data }) => {
  const theme = useTheme();

  return (
    <View style={styles.pumpNode}>
      <View style={[styles.handleTop, { left: '50%' }]} />
      <View style={[styles.handleBottom, { left: '50%' }]} />
      <View style={[styles.handleLeft, { top: '50%' }]} />
      <View style={[styles.handleRight, { top: '50%' }]} />

      <SvgWrapper viewBox="6.5 6.5 11 11" width={30} height={30} strokeWidth={0.5}>
        <Circle cx="12" cy="12" r="5" stroke="currentColor" />
        <Path d="M14 8L7 12L14 16Z" fill="silver" stroke="currentColor" strokeWidth={0.5} strokeLinejoin="round" />
      </SvgWrapper>

      {data.showLabels !== false && (
        <View style={styles.nodeLabel}>
          <Text style={styles.nodeLabelText}>{data.details?.name || 'Booster Pump'}</Text>
        </View>
      )}
    </View>
  );
};

export const TemperatureDifferenceNode = ({ data }) => {
  const theme = useTheme();
  
  const sensor1 = data.pt1000Sensors?.find(s => s.id === data.sensorId1);
  const sensor2 = data.pt1000Sensors?.find(s => s.id === data.sensorId2);
  
  const val1 = sensor1?.value || 0;
  const val2 = sensor2?.value || 0;
  const difference = Math.abs(val1 - val2).toFixed(1);

  return (
    <TouchableOpacity onPress={data.onEdit} style={styles.tempDiffNode}>
      <Text style={[styles.tempDiffText, { color: 'lime' }]}>
        △ {difference}°C
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Point Node
  pointNode: {
    width: 10,
    height: 10,
    position: 'relative',
  },
  point: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  
  // Handles
  handle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: 'transparent',
  },
  handleHidden: {
    opacity: 0,
  },
  handleTop: {
    position: 'absolute',
    top: -6,
    left: '50%',
    width: 8,
    height: 8,
    backgroundColor: 'transparent',
  },
  handleBottom: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    width: 8,
    height: 8,
    backgroundColor: 'transparent',
  },
  handleLeft: {
    position: 'absolute',
    left: -6,
    top: '50%',
    width: 8,
    height: 8,
    backgroundColor: 'transparent',
  },
  handleRight: {
    position: 'absolute',
    right: -6,
    top: '50%',
    width: 8,
    height: 8,
    backgroundColor: 'transparent',
  },
  
  // Label Node
  labelNode: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 50,
    maxWidth: 100,
    backgroundColor: 'transparent',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Common Node Styles
  statusBadge: {
    position: 'absolute',
    top: '13%',
    left: '24%',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    color: 'white',
  },
  brandBadge: {
    position: 'absolute',
    top: '32%',
    left: '49%',
    transform: [{ translateX: -50 }],
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  brandText: {
    fontSize: 6,
    fontWeight: 'bold',
  },
  nodeLabel: {
    position: 'absolute',
    top: '105%',
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    whiteSpace: 'nowrap',
  },
  topLabel: {
    position: 'absolute',
    top: -20,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bottomLabel: {
    position: 'absolute',
    bottom: -12,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nodeLabelText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  labelSmallText: {
    fontSize: 7,
    fontWeight: 'bold',
  },
  valueBadge: {
    position: 'absolute',
    top: -17,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  valueText: {
    fontSize: 7,
    fontWeight: 'bold',
  },
  
  // Node Containers
  boilerNode: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tankNode: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meterNode: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorNode: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pumpNode: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valveNode: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexNode: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vesselNode: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controllerNode: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempDiffNode: {
    padding: 8,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempDiffText: {
    fontSize: 9,
    fontWeight: '900',
  },
});