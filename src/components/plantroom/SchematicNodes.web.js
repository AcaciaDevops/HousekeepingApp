import React from 'react';
import { useTheme } from '@react-navigation/native';
import { appFonts } from '../../config/theme';

const { Handle, Position } = require('@xyflow/react/dist/umd/index.js');

const useThemeTokens = () => {
  const theme = useTheme();

  return {
    background: theme.colors?.background || '#fafafa',
    surface: theme.colors?.card || theme.colors?.surface || '#fff',
    text: theme.colors?.text || theme.colors?.onSurface || '#111',
    border: theme.colors?.border || theme.colors?.outline || '#d9d9d9',
    primary: theme.colors?.primary || '#1976d2',
    error: theme.colors?.notification || theme.colors?.error || '#d32f2f',
    success: '#2e7d32',
  };
};

const handleStyle = { opacity: 0 };

const SvgWrapper = ({ children, viewBox, color, width, height, strokeWidth = 0.5, ...props }) => {
  const tokens = useThemeTokens();
  return (
    <svg
      viewBox={viewBox || '0 0 24 24'}
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        color: color || tokens.text,
        display: 'block',
        margin: '0 auto',
      }}
      {...props}
    >
      {children}
    </svg>
  );
};

const labelBubbleStyle = (tokens, compact = false) => ({
  backgroundColor: tokens.surface,
  border: `1px solid ${tokens.border}`,
  padding: compact ? '1px 3px' : '2px 4px',
  borderRadius: 4,
  whiteSpace: 'nowrap',
  color: tokens.text,
});

export const PointNode = () => (
  <div
    className="react-flow-point"
    style={{ width: 10, height: 10, background: '#333', borderRadius: '50%' }}
  >
    <Handle type="target" position={Position.Top} id="top-target" style={handleStyle} />
    <Handle type="source" position={Position.Top} id="top-source" style={handleStyle} />
    <Handle type="target" position={Position.Bottom} id="bottom-target" style={handleStyle} />
    <Handle type="source" position={Position.Bottom} id="bottom-source" style={handleStyle} />
    <Handle type="target" position={Position.Left} id="left-target" style={handleStyle} />
    <Handle type="source" position={Position.Left} id="left-source" style={handleStyle} />
    <Handle type="target" position={Position.Right} id="right-target" style={handleStyle} />
    <Handle type="source" position={Position.Right} id="right-source" style={handleStyle} />
  </div>
);

export const LabelNode = ({ data }) => {
  const tokens = useThemeTokens();

  return (
    <div
      style={{
        padding: '2px 4px',
        borderRadius: 4,
        border: data.readOnly ? 'none' : `1px dashed ${tokens.border}`,
        backgroundColor: 'transparent',
        minWidth: 50,
        maxWidth: 100,
        textAlign: 'center',
        overflow: 'hidden',
        color: tokens.text,
        fontSize: 10,
        fontFamily: appFonts.bold.fontFamily,
        lineHeight: 1.2,
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }}
    >
      {data.label || 'New Label'}
    </div>
  );
};

export const BoilerNode = ({ id, data }) => {
  const tokens = useThemeTokens();
  const isActive = data.status === 1;

  return (
    <>
      <Handle type="target" position={Position.Top} id="t-in-1" style={{ ...handleStyle, left: '40%' }} />
      <Handle type="source" position={Position.Top} id="t-out-1" style={{ ...handleStyle, left: '40%' }} />
      <Handle type="target" position={Position.Top} id="t-in-2" style={{ ...handleStyle, left: '60%' }} />
      <Handle type="source" position={Position.Top} id="t-out-2" style={{ ...handleStyle, left: '60%' }} />
      <Handle type="target" position={Position.Bottom} id="b-in-1" style={{ ...handleStyle, left: '40%' }} />
      <Handle type="source" position={Position.Bottom} id="b-out-1" style={{ ...handleStyle, left: '40%' }} />
      <Handle type="target" position={Position.Bottom} id="b-in-2" style={{ ...handleStyle, left: '60%' }} />
      <Handle type="source" position={Position.Bottom} id="b-out-2" style={{ ...handleStyle, left: '60%' }} />
      <Handle type="target" position={Position.Left} id="l-in-1" style={{ ...handleStyle, left: '11%', top: '40%' }} />
      <Handle type="source" position={Position.Left} id="l-out-1" style={{ ...handleStyle, left: '11%', top: '40%' }} />
      <Handle type="target" position={Position.Left} id="l-in-2" style={{ ...handleStyle, left: '11%', top: '60%' }} />
      <Handle type="source" position={Position.Left} id="l-out-2" style={{ ...handleStyle, left: '11%', top: '60%' }} />
      <Handle type="target" position={Position.Right} id="r-in-1" style={{ ...handleStyle, left: '81%', top: '40%' }} />
      <Handle type="source" position={Position.Right} id="r-out-1" style={{ ...handleStyle, left: '81%', top: '40%' }} />
      <Handle type="target" position={Position.Right} id="r-in-2" style={{ ...handleStyle, left: '81%', top: '60%' }} />
      <Handle type="source" position={Position.Right} id="r-out-2" style={{ ...handleStyle, left: '81%', top: '60%' }} />
      <SvgWrapper viewBox="0 0 20 26" width={80} height={100} color={isActive ? 'brown' : 'grey'}>
        <rect x="2" y="0.5" width="16" height="25" rx="1.5" fill={tokens.surface} />
        <path d="M10 14c-1 1-1.5 1.8-1.5 2.7a1.5 1.5 0 0 0 3 0c0-0.9-0.5-1.7-1.5-2.7z" fill={isActive ? 'orange' : 'none'} />
        <circle cx="7.5" cy="19" r="1" fill={isActive ? 'orange' : 'none'} />
        <circle cx="12.5" cy="19" r="1" fill={isActive ? 'orange' : 'none'} />
      </SvgWrapper>
      <div
        style={{
          position: 'absolute',
          top: '13%',
          left: '24%',
          fontSize: 10,
          fontFamily: appFonts.bold.fontFamily,
          padding: '2px 4px',
          lineHeight: 1,
          border: `1px solid ${tokens.text}`,
          borderRadius: 4,
          backgroundColor: isActive ? tokens.success : tokens.error,
          color: '#fff',
        }}
      >
        {isActive ? 'ON' : 'OFF'}
      </div>
      {data.details?.brand ? (
        <div style={{ position: 'absolute', top: '32%', left: '49%', transform: 'translateX(-50%)', ...labelBubbleStyle(tokens, true) }}>
          <span style={{ fontSize: 6, fontFamily: appFonts.bold.fontFamily }}>{data.details.brand}</span>
        </div>
      ) : null}
      <div className="node-label-container" style={{ position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)', ...labelBubbleStyle(tokens) }}>
        <span style={{ fontSize: 8, fontFamily: appFonts.bold.fontFamily }}>{data.details?.name || 'Boiler'}</span>
      </div>
    </>
  );
};

export const HotWaterTankNode = ({ id, data }) => {
  const tokens = useThemeTokens();
  const gradientId = `tank-grad-${id}`;
  return (
    <>
      <Handle type="target" position={Position.Top} id="t-in" style={{ ...handleStyle, left: '47%' }} />
      <Handle type="source" position={Position.Top} id="t-out" style={{ ...handleStyle, left: '47%' }} />
      <Handle type="target" position={Position.Bottom} id="b-in" style={{ ...handleStyle, left: '47%' }} />
      <Handle type="source" position={Position.Bottom} id="b-out" style={{ ...handleStyle, left: '47%' }} />
      <Handle type="target" position={Position.Left} id="l-in" style={{ ...handleStyle, top: '87%', left: '5%' }} />
      <Handle type="source" position={Position.Left} id="l-out" style={{ ...handleStyle, top: '87%', left: '5%' }} />
      <Handle type="target" position={Position.Right} id="r-u-in" style={{ ...handleStyle, top: '34%' }} />
      <Handle type="source" position={Position.Right} id="r-u-out" style={{ ...handleStyle, top: '34%' }} />
      <Handle type="target" position={Position.Right} id="r-d-in" style={{ ...handleStyle, top: '87%' }} />
      <Handle type="source" position={Position.Right} id="r-d-out" style={{ ...handleStyle, top: '87%' }} />
      <SvgWrapper viewBox="6.5 1.5 12 19" width={80} height={120} strokeWidth={0.5}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffeb3b" />
            <stop offset="50%" stopColor="#ff9800" />
            <stop offset="100%" stopColor="#f44336" />
          </linearGradient>
        </defs>
        <path d="M 7 20 L 17 20 L 17 7 A 5 5 0 0 0 7 7 Z" fill={`url(#${gradientId})`} stroke="red" />
        <path d="M 10 18 L 14 16 L 10 14 L 14 12 L 10 10 L 14 8" fill="none" stroke="grey" strokeWidth="0.8" strokeOpacity="0.6" />
        <line x1="14" y1="8" x2="18" y2="8" stroke="grey" strokeWidth="0.8" strokeOpacity="0.6" />
        <line x1="10" y1="18" x2="18" y2="18" stroke="grey" strokeWidth="0.8" strokeOpacity="0.6" />
      </SvgWrapper>
      <div className="node-label-container" style={{ position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, ...labelBubbleStyle(tokens) }}>
        <span style={{ fontSize: 8, fontFamily: appFonts.bold.fontFamily }}>{data.details?.name || 'Hot Water Tank'}</span>
      </div>
    </>
  );
};

export const ColdWaterTankNode = ({ data }) => {
  const tokens = useThemeTokens();
  return (
    <>
      <Handle type="target" position={Position.Top} id="t-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Top} id="t-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Bottom} id="b-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="b-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Left} id="l-in" style={{ ...handleStyle, top: '50%', left: '12%' }} />
      <Handle type="source" position={Position.Left} id="l-out" style={{ ...handleStyle, top: '50%', left: '12%' }} />
      <Handle type="target" position={Position.Right} id="r-in" style={{ ...handleStyle, top: '50%', left: '83%' }} />
      <Handle type="source" position={Position.Right} id="r-out" style={{ ...handleStyle, top: '50%', left: '83%' }} />
      <SvgWrapper viewBox="2 3.5 20 12.5" width={120} height={70} strokeWidth={0.5}>
        <rect x="4" y="5" width="16" height="10" fill="none" stroke="currentColor" />
        <rect x="4.5" y="7.5" width="15" height="7" fill="#2196f3" fillOpacity="0.4" stroke="none" />
        <line x1="4" y1="7.5" x2="20" y2="7.5" stroke="#2196f3" strokeWidth="0.5" strokeDasharray="1,1" />
        <rect x="3" y="4" width="18" height="1" rx="0.5" fill="currentColor" />
      </SvgWrapper>
      <div className="node-label-container" style={{ position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, ...labelBubbleStyle(tokens) }}>
        <span style={{ fontSize: 8, fontFamily: appFonts.bold.fontFamily }}>{data.details?.name || 'Cold Water Tank'}</span>
      </div>
    </>
  );
};

const meterNode = (valueLabel, detailsLabel, reverse = false) => function MeterNode({ data }) {
  const tokens = useThemeTokens();
  return (
    <>
      <div style={{ position: 'absolute', top: -17, left: '50%', transform: 'translateX(-50%)', ...labelBubbleStyle(tokens, true) }}>
        <span style={{ fontSize: 7, fontFamily: appFonts.bold.fontFamily }}>{data.value || 0}{valueLabel}</span>
      </div>
      <Handle type="target" position={Position.Top} id="t-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Top} id="t-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Bottom} id="b-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="b-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Left} id="l-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Left} id="l-out" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="target" position={Position.Right} id="r-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Right} id="r-out" style={{ ...handleStyle, top: '50%' }} />
      <SvgWrapper viewBox="2.5 6.5 19 11" width={reverse ? 45 : 40} height={22} strokeWidth={0.5}>
        <rect x="7" y="7" width="10" height="10" rx="1.5" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="12" x2={reverse ? '9.5' : '14.5'} y2="11" />
        <line x1="3" y1="12" x2="7" y2="12" />
        {reverse ? <polyline points="3,12 4.5,10.5 4.5,13.5" fill="none" /> : <polyline points="5.5,10.5 7,12 5.5,13.5" fill="none" />}
        <line x1="17" y1="12" x2="21" y2="12" />
        {reverse ? <polyline points="21,12 19.5,10.5 19.5,13.5" fill="none" /> : <polyline points="19.5,10.5 21,12 19.5,13.5" fill="none" />}
      </SvgWrapper>
      <div className="node-label-container" style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', ...labelBubbleStyle(tokens, true) }}>
        <span style={{ fontSize: 7, fontFamily: appFonts.bold.fontFamily }}>{data.details?.name || detailsLabel}</span>
      </div>
    </>
  );
};

export const FlowMeterNode = meterNode('m³', 'Flow Meter', false);
export const ReturnMeterNode = meterNode('m³', 'Return Meter', true);

const sensorNode = (unit, fallback) => function SensorLikeNode({ data }) {
  const tokens = useThemeTokens();
  return (
    <>
      <Handle type="target" position={Position.Top} id="t-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Top} id="t-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Bottom} id="b-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="b-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Left} id="l-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Left} id="l-out" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="target" position={Position.Right} id="r-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Right} id="r-out" style={{ ...handleStyle, top: '50%' }} />
      <SvgWrapper viewBox="0 0 35 15" width={35} height={15}>
        <rect x="0.5" y="0.5" width="34" height="14" rx="1" fill={tokens.surface} stroke="currentColor" strokeWidth="0.5" />
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="7" fill={tokens.text}>
          {data.value || '--'}{unit}
        </text>
      </SvgWrapper>
      <div className="node-label-container" style={{ position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)', ...labelBubbleStyle(tokens, true) }}>
        <span style={{ fontSize: 7, fontFamily: appFonts.bold.fontFamily }}>{data.details?.name || fallback}</span>
      </div>
    </>
  );
};

export const SensorNode = sensorNode('°C', 'Temperature Sensor');
export const PressureSensorNode = sensorNode('Pa', 'Pressure Sensor');

export const WaterPumpNode = ({ data }) => {
  const tokens = useThemeTokens();
  const isActive = data.status === 1;
  return (
    <>
      <Handle type="target" position={Position.Top} id="t-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Top} id="t-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Bottom} id="b-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="b-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Left} id="l-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Left} id="l-out" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="target" position={Position.Right} id="r-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Right} id="r-out" style={{ ...handleStyle, top: '50%' }} />
      <SvgWrapper viewBox="6.5 6.5 11 11" width={30} height={30} strokeWidth={0.5}>
        <circle cx="12" cy="12" r="5" stroke="currentColor" />
        <path d="M10 8L16 12L10 16Z" fill={isActive ? tokens.success : tokens.error} stroke="currentColor" strokeWidth={0.5} strokeLinejoin="round" />
      </SvgWrapper>
      <div className="node-label-container" style={{ position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, ...labelBubbleStyle(tokens) }}>
        <span style={{ fontSize: 8, fontFamily: appFonts.bold.fontFamily }}>{data.details?.name || 'Water Pump'}</span>
      </div>
    </>
  );
};

export const ValveNode = ({ data }) => {
  const tokens = useThemeTokens();
  const isActive = data.status === 1;
  return (
    <>
      <Handle type="target" position={Position.Top} id="t-in" style={{ ...handleStyle, top: '25%', left: '50%' }} />
      <Handle type="source" position={Position.Top} id="t-out" style={{ ...handleStyle, top: '25%', left: '50%' }} />
      <Handle type="target" position={Position.Bottom} id="b-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="b-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Left} id="l-in" style={{ ...handleStyle, top: '75%' }} />
      <Handle type="source" position={Position.Left} id="l-out" style={{ ...handleStyle, top: '75%' }} />
      <Handle type="target" position={Position.Right} id="r-in" style={{ ...handleStyle, top: '75%' }} />
      <Handle type="source" position={Position.Right} id="r-out" style={{ ...handleStyle, top: '75%' }} />
      <SvgWrapper viewBox="2.5 5.5 19 8.5" width={80} height={40} color={isActive ? tokens.success : tokens.error} strokeWidth={0.5}>
        <line x1="3" y1="12" x2="21" y2="12" />
        <rect x="9" y="10" width="6" height="4" fill={tokens.surface} />
        <line x1="12" y1="7" x2="12" y2="10" />
        <line x1="10.5" y1="6" x2="13.5" y2="9" />
        <line x1="13.5" y1="6" x2="10.5" y2="9" />
      </SvgWrapper>
      <div className="node-label-container" style={{ position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, ...labelBubbleStyle(tokens) }}>
        <span style={{ fontSize: 8, fontFamily: appFonts.bold.fontFamily }}>{data.details?.name || 'Valve'}</span>
      </div>
    </>
  );
};

export const HeatExchangerNode = ({ id, data }) => {
  const tokens = useThemeTokens();
  return (
    <>
      <Handle type="target" position={Position.Left} id="l-u-in" style={{ ...handleStyle, top: '15.4%' }} />
      <Handle type="source" position={Position.Left} id="l-u-out" style={{ ...handleStyle, top: '15.4%' }} />
      <Handle type="target" position={Position.Left} id="l-d-in" style={{ ...handleStyle, top: '84.6%' }} />
      <Handle type="source" position={Position.Left} id="l-d-out" style={{ ...handleStyle, top: '84.6%' }} />
      <Handle type="target" position={Position.Right} id="r-u-in" style={{ ...handleStyle, top: '15.4%' }} />
      <Handle type="source" position={Position.Right} id="r-u-out" style={{ ...handleStyle, top: '15.4%' }} />
      <Handle type="target" position={Position.Right} id="r-d-in" style={{ ...handleStyle, top: '84.6%' }} />
      <Handle type="source" position={Position.Right} id="r-d-out" style={{ ...handleStyle, top: '84.6%' }} />
      <SvgWrapper viewBox="0 0 16 26" width={50} height={70} color="orange" strokeWidth={1}>
        <defs>
          <linearGradient id={`ex-grad-${id}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="blue" />
            <stop offset="100%" stopColor="red" />
          </linearGradient>
        </defs>
        <rect x="4" y="1" width="8" height="24" rx="1" fill={`url(#ex-grad-${id})`} stroke="currentColor" />
        <path d="M6 5 L10 7 L6 9 L10 11 L6 13 L10 15 L6 17 L10 19 L6 21" stroke="currentColor" fill="none" strokeWidth={0.8} />
        <line x1="0" y1="4" x2="4" y2="4" stroke="currentColor" />
        <polyline points="1.5,2.5 0.5,4 1.5,5.5" stroke="currentColor" fill="none" />
        <line x1="12" y1="4" x2="16" y2="4" stroke="currentColor" />
        <line x1="0" y1="22" x2="4" y2="22" stroke="currentColor" />
        <polyline points="1.5,20.5 0.5,22 1.5,23.5" stroke="currentColor" fill="none" />
        <line x1="12" y1="22" x2="16" y2="22" stroke="currentColor" />
      </SvgWrapper>
      <div className="node-label-container" style={{ position: 'absolute', top: '102%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, ...labelBubbleStyle(tokens) }}>
        <span style={{ fontSize: 8, fontFamily: appFonts.bold.fontFamily }}>{data.details?.name || 'Heat Exchanger'}</span>
      </div>
    </>
  );
};

export const ExpansionVesselNode = ({ data }) => {
  const tokens = useThemeTokens();
  return (
    <>
      <Handle type="target" position={Position.Top} id="t-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Top} id="t-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Bottom} id="b-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="b-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Left} id="l-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Left} id="l-out" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="target" position={Position.Right} id="r-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Right} id="r-out" style={{ ...handleStyle, top: '50%' }} />
      <SvgWrapper viewBox="8.5 4.5 7 16" width={40} height={90} strokeWidth={0.5}>
        <rect x="9" y="5" width="6" height="12" rx="3" fill="currentColor" fillOpacity={0.2} />
        <line x1="12" y1="17" x2="12" y2="20" />
      </SvgWrapper>
      <div className="node-label-container" style={{ position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, ...labelBubbleStyle(tokens) }}>
        <span style={{ fontSize: 8, fontFamily: appFonts.bold.fontFamily }}>{data.details?.name || 'Exp. Vessel'}</span>
      </div>
    </>
  );
};

export const ControllerNode = ({ data }) => {
  const tokens = useThemeTokens();
  return (
    <>
      <Handle type="target" position={Position.Top} id="t-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Top} id="t-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Bottom} id="b-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="b-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Left} id="l-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Left} id="l-out" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="target" position={Position.Right} id="r-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Right} id="r-out" style={{ ...handleStyle, top: '50%' }} />
      <SvgWrapper viewBox="4.5 3.5 15 17" width={35} height={40} strokeWidth={0.5}>
        <rect x="5" y="4" width="14" height="16" rx="1.5" />
        <rect x="7" y="6" width="6" height="4" />
        <circle cx="14.5" cy="13" r="0.9" />
        <circle cx="11.5" cy="13" r="0.9" />
        <circle cx="8.5" cy="13" r="0.9" />
        <circle cx="14.5" cy="16" r="0.9" />
        <circle cx="11.5" cy="16" r="0.9" />
        <circle cx="8.5" cy="16" r="0.9" />
      </SvgWrapper>
      <div className="node-label-container" style={{ position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, ...labelBubbleStyle(tokens) }}>
        <span style={{ fontSize: 8, fontFamily: appFonts.bold.fontFamily }}>{data.details?.name || 'PLC Controller'}</span>
      </div>
    </>
  );
};

export const BoosterPumpNode = ({ data }) => {
  const tokens = useThemeTokens();
  return (
    <>
      <Handle type="target" position={Position.Top} id="t-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Top} id="t-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Bottom} id="b-in" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="b-out" style={{ ...handleStyle, left: '50%' }} />
      <Handle type="target" position={Position.Left} id="l-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Left} id="l-out" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="target" position={Position.Right} id="r-in" style={{ ...handleStyle, top: '50%' }} />
      <Handle type="source" position={Position.Right} id="r-out" style={{ ...handleStyle, top: '50%' }} />
      <SvgWrapper viewBox="6.5 6.5 11 11" width={30} height={30} strokeWidth={0.5}>
        <circle cx="12" cy="12" r="5" stroke="currentColor" />
        <path d="M14 8L7 12L14 16Z" fill="silver" stroke="currentColor" strokeWidth={0.5} strokeLinejoin="round" />
      </SvgWrapper>
      <div className="node-label-container" style={{ position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, ...labelBubbleStyle(tokens) }}>
        <span style={{ fontSize: 8, fontFamily: appFonts.bold.fontFamily }}>{data.details?.name || 'Booster Pump'}</span>
      </div>
    </>
  );
};

export const TemperatureDifferenceNode = ({ data }) => {
  const sensor1 = data.pt1000Sensors?.find((s) => s.id === data.sensorId1);
  const sensor2 = data.pt1000Sensors?.find((s) => s.id === data.sensorId2);
  const difference = Math.abs((sensor1?.value || 0) - (sensor2?.value || 0)).toFixed(1);

  return (
    <div onClick={data.onEdit} style={{ padding: 8, minWidth: 90, textAlign: 'center', cursor: 'pointer' }}>
      <span style={{ fontSize: 9, fontFamily: appFonts.bold.fontFamily, color: 'lime' }}>△ {difference}°C</span>
    </div>
  );
};
