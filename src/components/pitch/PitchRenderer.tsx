import React from 'react';
import FootballPitch from './FootballPitch';
import HandballPitch from './HandballPitch';
import BlankPitch from './BlankPitch';
import { PitchType } from '../../@types/elements';

interface PitchRendererProps {
  pitchType: PitchType;
  showGuidelines?: any;
}

const PitchRenderer: React.FC<PitchRendererProps> = ({ pitchType, showGuidelines }) => {
  if (pitchType === 'handball') {
    return <HandballPitch />;
  } else if (pitchType === 'blankPortrait' || pitchType === 'blankLandscape') {
    // Beregn dimensjoner basert på pitch type
    const isPortrait = pitchType === 'blankPortrait';
    const width = isPortrait ? 400 : 600;
    const height = isPortrait ? 600 : 400;
    
    return <BlankPitch width={width} height={height} isPortrait={isPortrait} />;
  } else {
    return <FootballPitch pitchType={pitchType} showGuidelines={showGuidelines} />;
  }
};

export default PitchRenderer;