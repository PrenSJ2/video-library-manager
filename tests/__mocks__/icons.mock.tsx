import React from 'react';

// Mock all icons to be simple svg elements with a data-testid for easy selection in tests.
// This prevents Jest from trying to parse actual SVG code.

export const PlusIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} data-testid="plus-icon" />
);

export const VideoCameraIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} data-testid="video-camera-icon" />
);

export const XIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} data-testid="x-icon" />
);

export const LightBulbIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} data-testid="light-bulb-icon" />
);

export const SparklesIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} data-testid="sparkles-icon" />
);