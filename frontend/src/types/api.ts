export type SecurityStatus = "no_data" | "safe" | "at_risk" | "unknown";

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  mode: string;
}

export interface LatestActivity {
  report_id: string;
  title: string;
  security_status: string;
  created_at: string;
}

export interface OverviewResponse {
  scenarios_tested: number;
  safe_transitions: number;
  unsafe_transitions: number;
  attack_paths: number;
  latest_activity: LatestActivity | null;
  security_status: SecurityStatus;
}

export interface ConfigFileInfo {
  id: string;
  filename: string;
  size_bytes: number;
  modified_at: string;
}

export interface ConfigListResponse {
  configs: ConfigFileInfo[];
}

export interface ReportFileInfo {
  id: string;
  filename: string;
  created_at: string | null;
  security_status: string | null;
}

export interface ReportListResponse {
  reports: ReportFileInfo[];
}
