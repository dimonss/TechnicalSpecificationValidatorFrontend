export interface ValidationReportMeta {
  model: string;
  durationMs: number;
}

export interface UsageInfo {
  limit: number;
  used: number;
  remaining: number;
  resetsAt: string;
}

export interface ValidationReport {
  markdown: string;
  meta: ValidationReportMeta;
  usage: UsageInfo;
}
