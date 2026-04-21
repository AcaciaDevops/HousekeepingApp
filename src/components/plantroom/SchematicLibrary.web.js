import React from 'react';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appFonts } from '../../config/theme';

const items = [
  ['COMPONENTS', [
    ['boiler', 'Whatshot', '#d32f2f', 'Boiler'],
    ['boosterPump', 'Autorenew', '#1976d2', 'Booster Pump'],
    ['coldWaterTank', 'Kitchen', '#1976d2', 'Cold Water Tank'],
    ['controller', 'SettingsInputHdmi', '', 'Controller'],
    ['expansion', 'RadioButtonChecked', '#d32f2f', 'Expansion Vessel'],
    ['flowMeter', 'Speed', '', 'Flow Meter'],
    ['hex', 'CompareArrows', '', 'Heat Exchanger'],
    ['hotWaterTank', 'Kitchen', '#ed6c02', 'Hot Water Tank'],
    ['pressureSensor', 'Speed', '#616161', 'Pressure Sensor'],
    ['returnMeter', 'Autorenew', '#616161', 'Return Meter'],
    ['sensor', 'Thermostat', '', 'Temperature Sensor'],
    ['valve', 'Handyman', '', 'Valve'],
    ['waterPump', 'Autorenew', '', 'Water Pump'],
  ]],
  ['ANNOTATION & ROUTING', [
    ['point', 'Place', '', 'Connection Point'],
    ['label', 'Label', '', 'Label'],
  ]],
  ['CALCULATIONS', [
    ['temperatureDifference', 'Functions', '', 'Temperature Difference'],
  ]],
];

export default function SchematicLibrary() {
  const theme = useTheme();
  const surface = theme.colors?.card || theme.colors?.surface || '#fff';
  const background = theme.colors?.background || '#fafafa';
  const text = theme.colors?.text || '#111';
  const border = theme.colors?.border || '#d9d9d9';

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      style={{
        height: '100%',
        padding: 16,
        overflowY: 'auto',
        background: background,
        border: '1px solid green',
        borderRadius: 4,
        color: text,
      }}
    >
      <div style={{ marginBottom: 16, fontSize: 20, fontFamily: appFonts.bold.fontFamily }}>Plant Room Library</div>
      {items.map(([section, sectionItems], sectionIndex) => (
        <div key={section}>
          {sectionIndex > 0 ? <div style={{ margin: '16px 0', borderTop: `1px solid ${border}` }} /> : <div style={{ margin: '8px 0', borderTop: `1px solid ${border}` }} />}
          <div style={{ color: text, opacity: 0.7, fontSize: 12, fontFamily: appFonts.bold.fontFamily, marginBottom: 8 }}>{section}</div>
          {sectionItems.map(([nodeType, iconName, iconColor, label]) => (
            <div
              key={nodeType}
              draggable
              onDragStart={(event) => onDragStart(event, nodeType)}
              style={{
                padding: 10,
                margin: '5px 0',
                border: `1px solid ${border}`,
                borderRadius: 4,
                background: surface,
                cursor: 'grab',
                fontSize: 12,
                fontFamily: appFonts.bold.fontFamily,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: theme.dark ? 'none' : '0 1px 3px rgba(0,0,0,0.12)',
              }}
            >
              <Icon name={iconName.toLowerCase().replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, '').replace(/_/g, '-')} size={18} color={iconColor || text} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
