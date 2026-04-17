import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Text,
  useTheme,
  Divider,
  Surface,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Custom icon component to match MUI icons
const CustomIcon = ({ name, size = 18, color }) => {
  // Map MUI icon names to MaterialIcons names
  const iconMap = {
    'whatshot': 'whatshot',
    'autorenew': 'autorenew',
    'kitchen': 'kitchen',
    'settings-input-hdmi': 'settings-input-hdmi',
    'radio-button-checked': 'radio-button-checked',
    'speed': 'speed',
    'compare-arrows': 'compare-arrows',
    'thermostat': 'thermostat',
    'handyman': 'handyman',
    'place': 'place',
    'label': 'label',
    'functions': 'functions',
  };
  
  return <Icon name={iconMap[name] || name} size={size} color={color} />;
};

export default function SchematicLibrary() {
  const theme = useTheme();

  // For React Native, drag and drop works differently
  // You'll need to use PanResponder or react-native-draggable
  const onDragStart = (nodeType) => {
    // In React Native, you would typically use a state management solution
    // or event emitter to communicate the drag start
    console.log('Drag started for:', nodeType);
    // Emit event or set global state for dragging
    // EventEmitter.emit('dragStart', nodeType);
  };

  const SidebarItem = ({ nodeType, iconName, iconColor, label }) => {
    const isPressed = false; // Track press state for visual feedback
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={() => onDragStart(nodeType)}
        onLongPress={() => onDragStart(nodeType)}
        delayLongPress={100}
        style={[
          styles.sidebarItem,
          {
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.surface,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1,
            elevation: 1,
          },
          isPressed && styles.sidebarItemPressed,
        ]}
      >
        <CustomIcon 
          name={iconName} 
          size={18} 
          color={iconColor || theme.colors.onSurface} 
        />
        <Text variant="labelMedium" style={[styles.sidebarItemText, { color: theme.colors.onSurface }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Surface
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderColor: 'green',
        },
      ]}
      elevation={2}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          Plant Room Library
        </Text>
        
        <Divider style={styles.divider} />

        <Text variant="labelSmall" style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>
          COMPONENTS
        </Text>

        <SidebarItem
          nodeType="boiler"
          iconName="whatshot"
          iconColor="#d32f2f"
          label="Boiler"
        />
        
        <SidebarItem
          nodeType="boosterPump"
          iconName="autorenew"
          iconColor="#1976d2"
          label="Booster Pump"
        />
        
        <SidebarItem
          nodeType="coldWaterTank"
          iconName="kitchen"
          iconColor="#1976d2"
          label="Cold Water Tank"
        />
        
        <SidebarItem
          nodeType="controller"
          iconName="settings-input-hdmi"
          label="Controller"
        />
        
        <SidebarItem
          nodeType="expansion"
          iconName="radio-button-checked"
          iconColor="#d32f2f"
          label="Expansion Vessel"
        />
        
        <SidebarItem
          nodeType="flowMeter"
          iconName="speed"
          label="Flow Meter"
        />
        
        <SidebarItem
          nodeType="hex"
          iconName="compare-arrows"
          label="Heat Exchanger"
        />
        
        <SidebarItem
          nodeType="hotWaterTank"
          iconName="kitchen"
          iconColor="#ed6c02"
          label="Hot Water Tank"
        />
        
        <SidebarItem
          nodeType="pressureSensor"
          iconName="speed"
          iconColor="#616161"
          label="Pressure Sensor"
        />
        
        <SidebarItem
          nodeType="returnMeter"
          iconName="autorenew"
          iconColor="#616161"
          label="Return Meter"
        />
        
        <SidebarItem
          nodeType="sensor"
          iconName="thermostat"
          label="Temperature Sensor"
        />
        
        <SidebarItem
          nodeType="valve"
          iconName="handyman"
          label="Valve"
        />
        
        <SidebarItem
          nodeType="waterPump"
          iconName="autorenew"
          label="Water Pump"
        />

        <Divider style={styles.dividerSpaced} />

        <Text variant="labelSmall" style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>
          ANNOTATION & ROUTING
        </Text>
        
        <SidebarItem
          nodeType="point"
          iconName="place"
          label="Connection Point"
        />
        
        <SidebarItem
          nodeType="label"
          iconName="label"
          label="Label"
        />

        <Divider style={styles.dividerSpaced} />

        <Text variant="labelSmall" style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>
          CALCULATIONS
        </Text>
        
        <SidebarItem
          nodeType="temperatureDifference"
          iconName="functions"
          label="Temperature Difference"
        />

        {/* Add extra space at bottom for better scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </Surface>
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
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 4,
  },
  dividerSpaced: {
    marginVertical: 8,
  },
  sectionHeader: {
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 4,
    display: 'flex',
  },
  sidebarItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      web: {
        cursor: 'grab',
      },
      default: {
        // For mobile, we use touch feedback
      },
    }),
  },
  sidebarItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  sidebarItemText: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 20,
  },
});