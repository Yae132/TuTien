import React from 'react';
import { FashionConfig } from '../types/game';
import { ChibiCharacterRenderer } from './ChibiCharacterRenderer';

interface ChibiCanvasProps {
  fashion: FashionConfig;
  posture?: 'meditating' | 'standing' | 'walking';
  size?: number;
  animated?: boolean;
  className?: string;
  walkFrame?: number;
}

export const ChibiCanvas: React.FC<ChibiCanvasProps> = ({
  fashion,
  posture = 'standing',
  size = 180,
  className = ''
}) => {
  return (
    <div className={className}>
      <ChibiCharacterRenderer
        fashion={fashion}
        action={posture}
        size={size}
        showAura={true}
      />
    </div>
  );
};
