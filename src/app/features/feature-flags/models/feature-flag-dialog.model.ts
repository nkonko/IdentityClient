// Component-level models for Feature Flags management

import { FeatureFlag } from '../../../core/models';

export interface FeatureFlagDialogData {
  mode: 'create' | 'edit';
  featureFlag?: FeatureFlag;
}

export interface FeatureFlagDialogResult {
  name: string;
  description?: string;
  isEnabled: boolean;
}
