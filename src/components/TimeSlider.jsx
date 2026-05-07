import React from 'react';
import { Slider } from '@/components/ui/slider';

/**
 * TimeSlider molecule that combines the range slider with a 24h time scale.
 * 
 * @param {number} value - Decimal hour (0-24)
 * @param {function} onChange - Callback for when the value changes
 */
const TimeSlider = ({ value, onChange, className }) => {
  return (
    <div className={className}>
      <Slider
        value={[value]}
        max={24}
        step={1}
        onValueChange={(vals) => onChange?.(vals[0])}
      />
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          fontSize: "var(--font-size-subtitle)", 
          color: "var(--text-secondary)", 
          padding: "var(--spacing-sm) 0 0", 
          fontFamily: "var(--font-family)", 
          opacity: 0.6 
        }}
      >
        <span>12am</span>
        <span>6am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>12am</span>
      </div>
    </div>
  );
};

export default TimeSlider;
