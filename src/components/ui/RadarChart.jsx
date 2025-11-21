import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// #region Sample data


// #endregion

// Custom tick component with truncated text and tooltip
const CustomTick = ({ payload, x, y, cx, cy }) => {
  const maxLength = 6; // Maximum characters to show before truncation
  const fullText = payload.value;
  const truncatedText = fullText.length > maxLength 
    ? fullText.substring(0, maxLength) + '.' 
    : fullText;
  
  // Calculate angle and distance from center
  const dx = x - cx;
  const dy = y - cy;
  const angle = Math.atan2(dy, dx);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Increase spacing by extending the distance (adjust multiplier to increase/decrease spacing)
  const spacingMultiplierX = 1.15; // Increase this value to push labels further out
  const spacingMultiplierY = 1.01; // Increase this value to push labels further out
  const newDistanceX = distance * spacingMultiplierX;
  const newDistanceY = distance * spacingMultiplierY;
  const newX = cx + Math.cos(angle) * newDistanceX;
  const newY = cy + Math.sin(angle) * newDistanceY;
  
  return (
    <g transform={`translate(${newX},${newY})`}>
      <foreignObject x={-50} y={-10} width={100} height={20} style={{ overflow: 'visible' }}>
        <div 
          xmlns="http://www.w3.org/1999/xhtml"
          style={{ 
            textAlign: 'center', 
            fontSize: '12px',
            color: 'currentColor',
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span style={{ cursor: 'help', display: 'inline-block', opacity: 0.8 }}>{truncatedText}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fullText}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </foreignObject>
    </g>
  );
};

const RadarChartComponent = ({
    data,
    width,
    height,
    outerRadius,
    innerRadius,
    dataKey,
    stroke,
    fill,
    fillOpacity,
    name,
    margin,
}) => {
  return (
    <RadarChart
      style={{ width: width, height: height, maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1, fontSize:'10px' }}
      responsive
      outerRadius="80%"
      data={data}
      margin={{
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
      }}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
      <PolarRadiusAxis 
        domain={[0, 10]}
        tickCount={6}
        tick={(props) => {
          const { payload, x, y } = props;
          // Only show ticks at 0, 2, 4, 6, 8, 10
          const allowedTicks = [0, 2, 4, 6, 8, 10];
          // Round to nearest integer for comparison (handles floating point precision)
          const roundedValue = Math.round(payload.value);
          if (!allowedTicks.includes(roundedValue)) {
            return null;
          }
          return (
            <text
              x={x}
              y={y}
              fill="currentColor"
              textAnchor="middle"
              fontSize="8px"
            >
              {roundedValue}
            </text>
          );
        }}
      />
      <Radar 
        name={name} 
        dataKey={dataKey} 
        stroke={stroke} 
        fill={fill} 
        fillOpacity={fillOpacity}
        domain={[0, 10]}
      />
    </RadarChart>
  );
};

export default RadarChartComponent;