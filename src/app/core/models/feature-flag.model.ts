// Domain models for Feature Flags

export interface FeatureFlag {
  id: number;
  name: string;
  description?: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface FeatureFlagCreate {
  name: string;
  description?: string;
  isEnabled: boolean;
}

export interface FeatureFlagUpdate {
  description?: string;
  isEnabled: boolean;
}

export interface FeatureFlagState {
  name: string;
  isEnabled: boolean;
}
