import React from 'react';
import { PitchType } from '../../@types/elements';
import { getPitchDimensions } from '../../lib/svg-utils';

interface FootballPitchProps {
  pitchType: PitchType;
}

const FootballPitch: React.FC<FootballPitchProps> = ({ pitchType }) => {
  const { width, height } = getPitchDimensions(pitchType);
  
  // Beregn dimensjoner basert på banetype
  const isFullPitch = pitchType === 'full' || pitchType === 'fullLandscape';
  const isOffensive = pitchType === 'offensive';
  const isDefensive = pitchType === 'defensive';
  const isHandball = pitchType === 'handball';
  
  // Fotballbane-dimensjoner
  const pitchWidth = isHandball ? 400 : 
                    pitchType === 'fullLandscape' ? 1050 : 680;
  const pitchHeight = isHandball ? 200 : 
                     pitchType === 'full' ? 1050 : 
                     pitchType === 'fullLandscape' ? 680 : 525;
  const halfPitchWidth = pitchWidth / 2;
  
  // Straffefelt-dimensjoner
  const penaltyBoxWidth = pitchType === 'fullLandscape' ? 165 : 400.32;
  const penaltyBoxHeight = pitchType === 'fullLandscape' ? 400.32 : 165;
  const penaltyBoxX = isDefensive ? 0 : pitchWidth - (pitchType === 'fullLandscape' ? 165 : 400.32);
  const penaltyBoxY = pitchType === 'fullLandscape' ? (pitchHeight - 400.32) / 2 : isDefensive ? pitchHeight - 165 : 0;
  
  // Målområde-dimensjoner
  const goalAreaWidth = pitchType === 'fullLandscape' ? 55 : 218.32;
  const goalAreaHeight = pitchType === 'fullLandscape' ? 198.32 : 55;
  const goalAreaX = isDefensive ? 0 : pitchWidth - (pitchType === 'fullLandscape' ? 55 : 218.32);
  const goalAreaY = pitchType === 'fullLandscape' ? (pitchHeight - 198.32) / 2 : isDefensive ? pitchHeight - 55 : 0;
  
  // Mål-dimensjoner
  const goalWidth = 15;
  const goalHeight = pitchType === 'fullLandscape' ? 100 : 75;
  const goalX = isDefensive ? -goalWidth : pitchWidth;
  const goalY = (pitchHeight - goalHeight) / 2;
  
  // Hjørneflagg-dimensjoner
  const cornerRadius = 10;
  
  // Fotballbane-dimensjoner
  if (isHandball) {
    return (
      <g>
        {/* Hovedbane */}
        <rect
          x="0"
          y="0"
          width="680"
          height="340"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
        
        {/* Midtlinje */}
        <line
          x1="340"
          y1="0"
          x2="340"
          y2="340"
          stroke="black"
          strokeWidth="2"
        />
        
        {/* Venstre målfelt (straffeområde) - 6m bue fra dødlinje */}
        <path 
          d="M 0,51 A 102,102 1 0 1 0,289" 
          fill="none" 
          stroke="black" 
          strokeWidth="2"
        />
        
        {/* Høyre målfelt (straffeområde) - 6m bue fra dødlinje */}
        <path 
          d="M 680,51 A 102,102 1 0 0 680,289" 
          fill="none" 
          stroke="black" 
          strokeWidth="2"
        />
        
        {/* Venstre 9-meter (stiplet) - parallell med 6-meteren */}
        <path 
          d="M 0,0 A 153,153 1 0 1 0,340" 
          fill="none" 
          stroke="black" 
          strokeWidth="2" 
          strokeDasharray="5,5"
        />
        
        {/* Høyre 9-meter (stiplet) - parallell med 6-meteren */}
        <path 
          d="M 680,0 A 153,153 1 0 0 680,340" 
          fill="none" 
          stroke="black" 
          strokeWidth="2" 
          strokeDasharray="5,5"
        />
        
        {/* Venstre mål */}
        <rect
          x="-15"
          y="120"
          width="15"
          height="100"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
        
        {/* Høyre mål */}
        <rect
          x="680"
          y="120"
          width="15"
          height="100"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
      </g>
    );
  }
  
  if (pitchType === 'full') {
    return (
      <g>
        <rect x="0" y="0" width="680" height="1050" fill="none" stroke="black" strokeWidth="2"/>
        <rect x="139.84" y="0" width="400.32" height="165" fill="none" stroke="black" strokeWidth="2"/>
        <rect x="230.84" y="0" width="218.32" height="55" fill="none" stroke="black" strokeWidth="2"/>
        <circle cx="340" cy="110" r="2" fill="black"/>
        <rect x="139.84" y="885" width="400.32" height="165" fill="none" stroke="black" strokeWidth="2"/>
        <rect x="230.84" y="995" width="218.32" height="55" fill="none" stroke="black" strokeWidth="2"/>
        <circle cx="340" cy="940" r="2" fill="black"/>
        <line x1="0" y1="525" x2="680" y2="525" stroke="black" strokeWidth="2"/>
        <circle cx="340" cy="525" r="91.5" fill="none" stroke="black" strokeWidth="2"/>
        <circle cx="340" cy="525" r="2" fill="black"/>
      </g>
    );
  }
  
  if (pitchType === 'fullLandscape') {
    return (
      <g>
        {/* Ytre bane */}
        <rect x="0" y="0" width="1050" height="680" fill="none" stroke="black" strokeWidth="2"/>
        
        {/* Midtlinje */}
        <line x1="525" y1="0" x2="525" y2="680" stroke="black" strokeWidth="2"/>
        <circle cx="525" cy="340" r="91.5" fill="none" stroke="black" strokeWidth="2"/>
        <circle cx="525" cy="340" r="2" fill="black"/>
        
        {/* Venstre 16-meter */}
        <rect x="0" y="139.84" width="165" height="400.32" fill="none" stroke="black" strokeWidth="2"/>
        
        {/* Høyre 16-meter */}
        <rect x="885" y="139.84" width="165" height="400.32" fill="none" stroke="black" strokeWidth="2"/>
        
        {/* Venstre målområde (5-meter) */}
        <rect x="0" y="240.84" width="55" height="198.32" fill="none" stroke="black" strokeWidth="2"/>
        
        {/* Høyre målområde (5-meter) */}
        <rect x="995" y="240.84" width="55" height="198.32" fill="none" stroke="black" strokeWidth="2"/>

        {/* Venstre mål */}
        <rect x="-15" y="290" width="15" height="100" fill="none" stroke="black" strokeWidth="2"/>
        
        {/* Høyre mål */}
        <rect x="1050" y="290" width="15" height="100" fill="none" stroke="black" strokeWidth="2"/>
        
        {/* Venstre straffepunkt */}
        <circle cx="110" cy="340" r="2" fill="black"/>
        
        {/* Høyre straffepunkt */}
        <circle cx="940" cy="340" r="2" fill="black"/>
      </g>
    );
  }
  
  if (pitchType === 'offensive') {
    return (
      <g>
        <rect x="0" y="0" width="680" height="525" fill="none" stroke="black" strokeWidth="2"/>
        <rect x="139.84" y="0" width="400.32" height="165" fill="none" stroke="black" strokeWidth="2"/>
        <rect x="230.84" y="0" width="218.32" height="55" fill="none" stroke="black" strokeWidth="2"/>
        <circle cx="340" cy="110" r="2" fill="black"/>
        <line x1="0" y1="525" x2="680" y2="525" stroke="black" strokeWidth="2"/>
        <path d="M 248.5 525 A 91.5 91.5 0 0 1 431.5 525" fill="none" stroke="black" strokeWidth="2"/>
      </g>
    );
  }
  
  if (pitchType === 'defensive') {
    return (
      <g>
        <rect x="0" y="0" width="680" height="525" fill="none" stroke="black" strokeWidth="2"/>
        <rect x="139.84" y="360" width="400.32" height="165" fill="none" stroke="black" strokeWidth="2"/>
        <rect x="230.84" y="470" width="218.32" height="55" fill="none" stroke="black" strokeWidth="2"/>
        <circle cx="340" cy="415" r="2" fill="black"/>
        <line x1="0" y1="0" x2="680" y2="0" stroke="black" strokeWidth="2"/>
        <path d="M 248.5 0 A 91.5 91.5 0 0 0 431.5 0" fill="none" stroke="black" strokeWidth="2"/>
      </g>
    );
  }
  
  return null;
};

export default FootballPitch; 