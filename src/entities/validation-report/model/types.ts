export interface ValidationReportMeta {
  model: string;
  durationMs: number;
}

export interface ValidationReport {
  markdown: string;
  meta: ValidationReportMeta;
}
