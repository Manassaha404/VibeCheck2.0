// Shared analytics types used across the analytics dashboard components.
// These mirror the backend types from @repo/services/form/model.

export type FieldType =
  | 'short_text'
  | 'long_text'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'select'
  | 'multi_select'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'rating'
  | 'scale'
  | 'mood';

export interface TextFieldAnalytics {
  kind: 'text';
  samples: string[];
  totalAnswered: number;
}

export interface ChoiceFieldAnalytics {
  kind: 'choice';
  options: { label: string; count: number; pct: number }[];
  totalAnswered: number;
}

export interface NumericFieldAnalytics {
  kind: 'numeric';
  average: number;
  min: number;
  max: number;
  distribution: { label: string; count: number }[];
  totalAnswered: number;
}

export interface MoodFieldAnalytics {
  kind: 'mood';
  distribution: { mood: string; count: number; pct: number }[];
  totalAnswered: number;
}

export interface FileFieldAnalytics {
  kind: 'file';
  totalUploads: number;
}

export interface DateFieldAnalytics {
  kind: 'date';
  distribution: { label: string; count: number }[];
  totalAnswered: number;
}

export type FieldAnalyticsData =
  | TextFieldAnalytics
  | ChoiceFieldAnalytics
  | NumericFieldAnalytics
  | MoodFieldAnalytics
  | FileFieldAnalytics
  | DateFieldAnalytics;

export interface AnalyticsFieldItem {
  fieldId: string;
  label: string;
  type: FieldType;
  orderIndex: number;
  analytics: FieldAnalyticsData;
}

export interface WeeklyDataPoint {
  week: string;
  count: number;
}

export interface FormAnalyticsData {
  form: {
    formId: string;
    title: string;
    slug: string;
    status: string;
    createdAt: Date | string;
    responseLimit: number | null;
    expiresAt: Date | string | null;
  };
  totalResponses: number;
  weeklyResponses: WeeklyDataPoint[];
  fields: AnalyticsFieldItem[];
}
