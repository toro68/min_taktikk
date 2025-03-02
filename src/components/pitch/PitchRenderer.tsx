import React from 'react';
import { PitchType } from '../../@types/elements';
import FootballPitch from './FootballPitch';
import HandballPitch from './HandballPitch';
import BlankPitch from './BlankPitch';

interface PitchRendererProps {
  pitchType: PitchType;
}

const PitchRenderer: React.FC<PitchRendererProps> = ({ pitchType }) => {
  if (pitchType === 'handball') {
    return <HandballPitch />;
  } else if (pitchType === 'blankPortrait' || pitchType === 'blankLandscape') {
    return <BlankPitch pitchType={pitchType} />;
  } else {
    return <FootballPitch pitchType={pitchType} />;
  }
};

export default PitchRenderer; 