import React, { useMemo, useRef } from 'react';
import { View, StyleSheet, ScrollView, PanResponder } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appFonts } from '../../config/theme';
import { useNativeSchematicDrag } from './NativeSchematicDragContext';

const ITEMS = [
  {
    heading: 'COMPONENTS',
    entries: [
      ['boiler', 'whatshot', '#d32f2f', 'Boiler'],
      ['boosterPump', 'autorenew', '#1976d2', 'Booster Pump'],
      ['coldWaterTank', 'kitchen', '#1976d2', 'Cold Water Tank'],
      ['controller', 'settings-input-hdmi', null, 'Controller'],
      ['expansion', 'radio-button-checked', '#d32f2f', 'Expansion Vessel'],
      ['flowMeter', 'speed', null, 'Flow Meter'],
      ['hex', 'compare-arrows', null, 'Heat Exchanger'],
      ['hotWaterTank', 'kitchen', '#ed6c02', 'Hot Water Tank'],
      ['pressureSensor', 'speed', '#616161', 'Pressure Sensor'],
      ['returnMeter', 'autorenew', '#616161', 'Return Meter'],
      ['sensor', 'thermostat', null, 'Temperature Sensor'],
      ['valve', 'handyman', null, 'Valve'],
      ['waterPump', 'autorenew', null, 'Water Pump'],
    ],
  },
  {
    heading: 'ANNOTATION & ROUTING',
    entries: [
      ['point', 'place', null, 'Connection Point'],
      ['label', 'label', null, 'Label'],
    ],
  },
  {
    heading: 'CALCULATIONS',
    entries: [['temperatureDifference', 'functions', null, 'Temperature Difference']],
  },
];

function SidebarItem({ nodeType, iconName, iconColor, label }) {
  const theme = useTheme();
  const itemRef = useRef(null);
  const { beginDrag, updateDrag, endDrag } = useNativeSchematicDrag();

  const dragItem = useMemo(
    () => ({
      nodeType,
      iconName,
      iconColor,
      label,
    }),
    [iconColor, iconName, label, nodeType]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3,
        onPanResponderGrant: (event) => {
          beginDrag(dragItem, event.nativeEvent.pageX, event.nativeEvent.pageY);
        },
        onPanResponderMove: (event) => {
          updateDrag(event.nativeEvent.pageX, event.nativeEvent.pageY);
        },
        onPanResponderRelease: (event) => {
          endDrag(event.nativeEvent.pageX, event.nativeEvent.pageY);
        },
        onPanResponderTerminate: (event) => {
          endDrag(event.nativeEvent.pageX, event.nativeEvent.pageY);
        },
      }),
    [beginDrag, dragItem, endDrag, updateDrag]
  );

  return (
    <View
      ref={itemRef}
      collapsable={false}
      style={[
        styles.sidebarItem,
        {
          borderColor: theme.colors.outline,
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.shadow,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Icon name={iconName} size={18} color={iconColor || theme.colors.onSurface} />
      <Text
        variant="labelMedium"
        style={[
          styles.sidebarItemText,
          {
            color: theme.colors.onSurface,
            fontFamily: appFonts.bold.fontFamily,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function SchematicLibrary() {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderColor: 'green',
        },
      ]}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text
          variant="titleMedium"
          style={[
            styles.title,
            {
              color: theme.colors.onSurface,
              fontFamily: appFonts.bold.fontFamily,
            },
          ]}
        >
          Plant Room Library
        </Text>

        {ITEMS.map((section, index) => (
          <View key={section.heading}>
            <View
              style={[
                styles.divider,
                {
                  marginVertical: index === 0 ? 8 : 16,
                  backgroundColor: theme.colors.outline,
                },
              ]}
            />
            <Text
              variant="labelSmall"
              style={[
                styles.sectionHeader,
                {
                  color: theme.colors.onSurfaceVariant || theme.colors.onSurface,
                  fontFamily: appFonts.bold.fontFamily,
                },
              ]}
            >
              {section.heading}
            </Text>
            {section.entries.map(([nodeType, iconName, iconColor, label]) => (
              <SidebarItem
                key={nodeType}
                nodeType={nodeType}
                iconName={iconName}
                iconColor={iconColor}
                label={label}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  divider: {
    height: 1,
  },
  sectionHeader: {
    marginBottom: 8,
    display: 'flex',
  },
  sidebarItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  sidebarItemText: {
    marginLeft: 8,
    fontSize: 12,
  },
});
