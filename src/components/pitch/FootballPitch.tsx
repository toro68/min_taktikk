import React, { forwardRef, memo } from 'react';
import { PitchType, GuidelineMode } from '../../@types/elements';
import { SVG_ATTRIBUTES, SVG_STYLES } from '../../constants/svg';

interface FootballPitchProps {
  pitchType?: PitchType;
  type?: PitchType;
  guidelineMode?: GuidelineMode;
  showGuidelines?: GuidelineMode;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  role?: string;
}

const FootballPitch = memo(forwardRef<SVGSVGElement, FootballPitchProps>(({
  pitchType,
  type,
  guidelineMode,
  showGuidelines
}, ref) => {
  // Use either pitchType or type prop for backwards compatibility
  const actualType = pitchType || type || 'offensive';
  const actualGuidelineMode = guidelineMode || showGuidelines || 'none';

  // Function to render the green guidelines for zoning
  const renderGuidelines = () => {
    if (!actualGuidelineMode || actualType !== 'fullLandscape') return null;
    
    // For fullLandscape pitch
    const quarterPitchWidth = 1050 / 4;  // 1/4 of pitch width
    const halfPitchWidth = 1050 / 2;     // Half of pitch width
    const centerX = halfPitchWidth;      // Center of pitch
    
    // Vertical positions from the existing layout
    const penaltyAreaY = 139.84;        // Y-coordinate of top of penalty area (16m box)
    const penaltyAreaHeight = 400.32;   // Height of the penalty area
    const goalAreaY = 240.84;           // Y-coordinate of top of goal area (5m box)
    const goalAreaHeight = 198.32;      // Height of the goal area
    
    // Calculate bottom edges of both areas
    const penaltyAreaBottomY = penaltyAreaY + penaltyAreaHeight;  // Bottom edge of 16m box
    const goalAreaBottomY = goalAreaY + goalAreaHeight;           // Bottom edge of 5m box
    
    // ADJUSTED HEIGHTS: Make flanke end at the 16-meter line
    const topFlankeHeight = penaltyAreaY;  // Flanke extends to top of 16m box
    const topFlankeY = 0;                  // Starts at the top of the pitch
    
    // Calculate central zone height - area between 5m boxes
    const centralZoneHeight = goalAreaHeight;  // Height of the central zone = height of goal area
    const centralZoneY = goalAreaY;            // Y-coordinate where central zone starts
    
    // Calculate halvrom heights - space between flanke and central zone
    const topHalvromHeight = goalAreaY - penaltyAreaY;  // Space between 16m line and 5m line
    const topHalvromY = penaltyAreaY;                   // Starts at the 16m line
    
    const bottomHalvromHeight = penaltyAreaBottomY - goalAreaBottomY;  // Space between bottom of 5m and 16m lines
    const bottomHalvromY = goalAreaBottomY;                            // Starts at bottom of 5m box
    
    // Bottom flanke - from bottom of 16m box to bottom of pitch
    const bottomFlankeHeight = 680 - penaltyAreaBottomY;  // Height from bottom of 16m box to pitch edge
    const bottomFlankeY = penaltyAreaBottomY;             // Starts at bottom of 16m box
    
    // Vertical positions for text distribution - center of each zone
    const topY = topFlankeY + (topFlankeHeight / 2);           // Middle of top flanke zone
    const topMidY = topHalvromY + (topHalvromHeight / 2);      // Middle of top halvrom zone
    const middleY = centralZoneY + (centralZoneHeight / 2);    // Middle of central zone
    const bottomMidY = bottomHalvromY + (bottomHalvromHeight / 2); // Middle of bottom halvrom
    const bottomY = bottomFlankeY + (bottomFlankeHeight / 2);  // Middle of bottom flanke
    
    const shouldShowLines = actualGuidelineMode === 'lines' || actualGuidelineMode === 'colors' || actualGuidelineMode === 'full';
    const shouldShowText = actualGuidelineMode === 'full';

    return (
      <>
        {/* Vertical lines for zone divisions */}
        {shouldShowLines && (
          <>
            {/* Quarter lines */}
            <line 
              x1={quarterPitchWidth}
              y1="0" 
              x2={quarterPitchWidth} 
              y2="680" 
              stroke={SVG_ATTRIBUTES.stroke.green}
              strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
              strokeDasharray="5,5" 
            />
            
            <line 
              x1={halfPitchWidth + quarterPitchWidth}
              y1="0" 
              x2={halfPitchWidth + quarterPitchWidth} 
              y2="680" 
              stroke={SVG_ATTRIBUTES.stroke.green}
              strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
              strokeDasharray="5,5" 
            />
            
            {/* Horizontal zone lines */}
            <line 
              x1="0" 
              y1={penaltyAreaY} 
              x2="1050" 
              y2={penaltyAreaY} 
              stroke={SVG_ATTRIBUTES.stroke.green}
              strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
              strokeDasharray="5,5" 
            />
            <line 
              x1="0" 
              y1={penaltyAreaBottomY} 
              x2="1050" 
              y2={penaltyAreaBottomY} 
              stroke={SVG_ATTRIBUTES.stroke.green}
              strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
              strokeDasharray="5,5" 
            />
            <line 
              x1="0" 
              y1={goalAreaY} 
              x2="1050" 
              y2={goalAreaY} 
              stroke={SVG_ATTRIBUTES.stroke.green}
              strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
              strokeDasharray="5,5" 
            />
            <line 
              x1="0" 
              y1={goalAreaBottomY} 
              x2="1050" 
              y2={goalAreaBottomY} 
              stroke={SVG_ATTRIBUTES.stroke.green}
              strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
              strokeDasharray="5,5" 
            />
          </>
        )}

        {/* Zone text labels */}
        {shouldShowText && (
          <>
            {/* Top - Flanke */}
            <rect 
              x={centerX - 35} 
              y={topY - 15} 
              width="70" 
              height="30" 
              fill="rgba(255, 255, 255, 0.9)" 
              stroke={SVG_ATTRIBUTES.stroke.black}
              strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
              rx="5"
            />
            <text 
              x={centerX} 
              y={topY} 
              textAnchor="middle" 
              dominantBaseline="middle"
              fill={SVG_ATTRIBUTES.stroke.black}
              fontSize="18"
              fontWeight="bold"
            >
              Flanke
            </text>
            
            {/* Top-middle - Halvrom */}
            <rect 
              x={centerX - 35} 
              y={topMidY - 15} 
              width="70" 
              height="30" 
              fill="rgba(255, 255, 255, 0.9)" 
              stroke={SVG_ATTRIBUTES.stroke.black}
              strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
              rx="5"
            />
            <text 
              x={centerX} 
              y={topMidY} 
              textAnchor="middle" 
              dominantBaseline="middle"
              fill={SVG_ATTRIBUTES.stroke.black}
              fontSize="18"
              fontWeight="bold"
            >
              Halvrom
            </text>
            
            {/* Middle - Sentralt */}
            <rect 
              x={centerX - 35} 
              y={middleY - 15} 
              width="70" 
              height="30" 
              fill="rgba(255, 255, 255, 0.9)" 
              stroke={SVG_ATTRIBUTES.stroke.black}
              strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
              rx="5"
            />
            <text 
              x={centerX} 
              y={middleY} 
              textAnchor="middle" 
              dominantBaseline="middle"
              fill={SVG_ATTRIBUTES.stroke.black}
              fontSize="18"
              fontWeight="bold"
            >
              Sentralt
            </text>
            
            {/* Bottom-middle - Halvrom */}
            <rect 
              x={centerX - 35} 
              y={bottomMidY - 15} 
              width="70" 
              height="30" 
              fill="rgba(255, 255, 255, 0.9)" 
              stroke={SVG_ATTRIBUTES.stroke.black}
              strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
              rx="5"
            />
            <text 
              x={centerX} 
              y={bottomMidY} 
              textAnchor="middle" 
              dominantBaseline="middle"
              fill={SVG_ATTRIBUTES.stroke.black}
              fontSize="18"
              fontWeight="bold"
            >
              Halvrom
            </text>
            
            {/* Bottom - Flanke */}
            <rect 
              x={centerX - 35} 
              y={bottomY - 15} 
              width="70" 
              height="30" 
              fill="rgba(255, 255, 255, 0.9)" 
              stroke={SVG_ATTRIBUTES.stroke.black}
              strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
              rx="5"
            />
            <text 
              x={centerX} 
              y={bottomY} 
              textAnchor="middle" 
              dominantBaseline="middle"
              fill={SVG_ATTRIBUTES.stroke.black}
              fontSize="18"
              fontWeight="bold"
            >
              Flanke
            </text>
          </>
        )}
      </>
    );
  };
  
  if (actualType === 'handball') {
    return (
      <g>
        {/* Hvit bakgrunn for hele baneområdet */}
        <rect
          x="0"
          y="0" 
          width="680"
          height="340"
          fill={SVG_ATTRIBUTES.fill.white}
          stroke={SVG_ATTRIBUTES.fill.none}
        />
        {/* Hovedbane */}
        <rect
          x="0"
          y="0"
          width="680"
          height="340"
          {...SVG_STYLES.pitchLine}
        />
        
        {/* Midtlinje */}
        <line
          x1="340"
          y1="0"
          x2="340"
          y2="340"
          {...SVG_STYLES.pitchLine}
        />
        
        {/* Venstre målfelt (straffeområde) - 6m bue fra dødlinje */}
        <path 
          d="M 0,51 A 102,102 1 0 1 0,289" 
          {...SVG_STYLES.pitchLine}
        />
        
        {/* Høyre målfelt (straffeområde) - 6m bue fra dødlinje */}
        <path 
          d="M 680,51 A 102,102 1 0 0 680,289" 
          {...SVG_STYLES.pitchLine}
        />
        
        {/* Venstre 9-meter (stiplet) - parallell med 6-meteren */}
        <path 
          d="M 0,0 A 153,153 1 0 1 0,340" 
          stroke={SVG_ATTRIBUTES.stroke.black}
          strokeWidth={SVG_ATTRIBUTES.strokeWidth.normal}
          fill={SVG_ATTRIBUTES.fill.none}
          strokeDasharray="5,5"
        />
        
        {/* Høyre 9-meter (stiplet) - parallell med 6-meteren */}
        <path 
          d="M 680,0 A 153,153 1 0 0 680,340" 
          stroke={SVG_ATTRIBUTES.stroke.black}
          strokeWidth={SVG_ATTRIBUTES.strokeWidth.normal}
          fill={SVG_ATTRIBUTES.fill.none}
          strokeDasharray="5,5"
        />
        
        {/* Venstre mål */}
        <rect
          x="-15"
          y="120"
          width="15"
          height="100"
          {...SVG_STYLES.pitchLine}
        />
        
        {/* Høyre mål */}
        <rect
          x="680"
          y="120"
          width="15"
          height="100"
          {...SVG_STYLES.pitchLine}
        />
      </g>
    );
  }

  if (actualType === 'full') {
    return (
      <g>
        {/* Hvit bakgrunn for hele baneområdet */}
        <rect x="0" y="0" width="680" height="1050" fill={SVG_ATTRIBUTES.fill.white} stroke={SVG_ATTRIBUTES.fill.none}/>
        
        <rect x="0" y="0" width="680" height="1050" {...SVG_STYLES.pitchLine}/>
        <rect x="139.84" y="0" width="400.32" height="165" {...SVG_STYLES.pitchLine}/>
        <rect x="230.84" y="0" width="218.32" height="55" {...SVG_STYLES.pitchLine}/>
        <circle cx="340" cy="110" r="2" fill={SVG_ATTRIBUTES.fill.black}/>
        <rect x="139.84" y="885" width="400.32" height="165" {...SVG_STYLES.pitchLine}/>
        <rect x="230.84" y="995" width="218.32" height="55" {...SVG_STYLES.pitchLine}/>
        <circle cx="340" cy="940" r="2" fill={SVG_ATTRIBUTES.fill.black}/>
        <line x1="0" y1="525" x2="680" y2="525" {...SVG_STYLES.pitchLine}/>
        <circle cx="340" cy="525" r="91.5" {...SVG_STYLES.pitchLine}/>
        <circle cx="340" cy="525" r="2" fill={SVG_ATTRIBUTES.fill.black}/>
      </g>
    );
  }

  if (actualType === 'fullLandscape') {
    return (
      <g>
        {/* Hvit bakgrunn for hele baneområdet */}
        <rect x="0" y="0" width="1050" height="680" fill={SVG_ATTRIBUTES.fill.white} stroke={SVG_ATTRIBUTES.fill.none}/>
        
        {/* Ytre bane */}
        <rect x="0" y="0" width="1050" height="680" {...SVG_STYLES.pitchLine}/>
        
        {/* Midtlinje */}
        <line x1="525" y1="0" x2="525" y2="680" {...SVG_STYLES.pitchLine}/>
        <circle cx="525" cy="340" r="91.5" {...SVG_STYLES.pitchLine}/>
        <circle cx="525" cy="340" r="2" fill={SVG_ATTRIBUTES.fill.black}/>
        
        {/* Venstre 16-meter */}
        <rect x="0" y="139.84" width="165" height="400.32" {...SVG_STYLES.pitchLine}/>
        
        {/* Høyre 16-meter */}
        <rect x="885" y="139.84" width="165" height="400.32" {...SVG_STYLES.pitchLine}/>
        
        {/* Venstre målområde (5-meter) */}
        <rect x="0" y="240.84" width="55" height="198.32" {...SVG_STYLES.pitchLine}/>
        
        {/* Høyre målområde (5-meter) */}
        <rect x="995" y="240.84" width="55" height="198.32" {...SVG_STYLES.pitchLine}/>

        {/* Venstre mål */}
        <rect 
          x="-15" 
          y="290" 
          width="15" 
          height="100" 
          {...SVG_STYLES.pitchLine}
        />
        
        {/* Høyre mål */}
        <rect 
          x="1050" 
          y="290" 
          width="15" 
          height="100" 
          {...SVG_STYLES.pitchLine}
        />
        
        {/* Straffepunkter */}
        <circle 
          cx="110" 
          cy="340" 
          r="2" 
          fill={SVG_ATTRIBUTES.fill.black}
        />
        
        <circle 
          cx="940" 
          cy="340" 
          r="2" 
          fill={SVG_ATTRIBUTES.fill.black}
        />

        {renderGuidelines()}
      </g>
    );
  }

  if (actualType === 'offensive') {
    // Half pitch, goal at top. Scale is 10px per meter.
    // Penalty arc is part of circle (r=9.15m) around the penalty spot that lies outside the 16.5m line.
    const penaltySpotX = 340;
    const penaltySpotY = 110;
    const penaltyArcRadius = 91.5;
    const dxToSixteen = 55; // 16.5m - 11m = 5.5m
    const dyOnSixteen = Math.sqrt(penaltyArcRadius * penaltyArcRadius - dxToSixteen * dxToSixteen);
    const sixteenY = 165;

    return (
      <g>
        {/* Hvit bakgrunn for hele baneområdet */}
        <rect x="0" y="0" width="680" height="525" fill={SVG_ATTRIBUTES.fill.white} stroke={SVG_ATTRIBUTES.fill.none}/>
        
        <rect x="0" y="0" width="680" height="525" {...SVG_STYLES.pitchLine}/>
        <rect x="139.84" y="0" width="400.32" height="165" {...SVG_STYLES.pitchLine}/>
        <rect x="230.84" y="0" width="218.32" height="55" {...SVG_STYLES.pitchLine}/>
        <circle cx={penaltySpotX} cy={penaltySpotY} r="2" fill={SVG_ATTRIBUTES.fill.black}/>
        <path
          d={`M ${penaltySpotX - dyOnSixteen} ${sixteenY} A ${penaltyArcRadius} ${penaltyArcRadius} 0 0 0 ${penaltySpotX + dyOnSixteen} ${sixteenY}`}
          {...SVG_STYLES.pitchLine}
          fill={SVG_ATTRIBUTES.fill.none}
        />
        <line x1="0" y1="525" x2="680" y2="525" {...SVG_STYLES.pitchLine}/>
        <circle cx="340" cy="525" r="91.5" {...SVG_STYLES.pitchLine}/>
        <circle cx="340" cy="525" r="2" fill={SVG_ATTRIBUTES.fill.black}/>
      </g>
    );
  }

  // Defensive pitch (default)
  // Half pitch, goal at bottom. Scale is 10px per meter.
  const penaltySpotX = 340;
  const penaltySpotY = 415;
  const penaltyArcRadius = 91.5;
  const dxToSixteen = 55; // 16.5m - 11m = 5.5m
  const dyOnSixteen = Math.sqrt(penaltyArcRadius * penaltyArcRadius - dxToSixteen * dxToSixteen);
  const sixteenY = 360;

  return (
    <g>
      {/* Hvit bakgrunn for hele baneområdet */}
      <rect x="0" y="0" width="680" height="525" fill={SVG_ATTRIBUTES.fill.white} stroke={SVG_ATTRIBUTES.fill.none}/>
      
      <rect x="0" y="0" width="680" height="525" {...SVG_STYLES.pitchLine}/>
      <rect x="139.84" y="360" width="400.32" height="165" {...SVG_STYLES.pitchLine}/>
      <rect x="230.84" y="470" width="218.32" height="55" {...SVG_STYLES.pitchLine}/>
      <circle cx={penaltySpotX} cy={penaltySpotY} r="2" fill={SVG_ATTRIBUTES.fill.black}/>
      <path
        d={`M ${penaltySpotX - dyOnSixteen} ${sixteenY} A ${penaltyArcRadius} ${penaltyArcRadius} 0 0 1 ${penaltySpotX + dyOnSixteen} ${sixteenY}`}
        {...SVG_STYLES.pitchLine}
      />
      <line x1="0" y1="0" x2="680" y2="0" {...SVG_STYLES.pitchLine}/>
      <circle cx="340" cy="0" r="91.5" {...SVG_STYLES.pitchLine}/>
      <circle cx="340" cy="0" r="2" fill={SVG_ATTRIBUTES.fill.black}/>
    </g>
  );
}));

FootballPitch.displayName = 'FootballPitch';

FootballPitch.displayName = 'FootballPitch';

export default FootballPitch;

