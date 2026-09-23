export interface DateRange {
  startDate: string; // ISO 8601 or YYYY-MM
  endDate?: string;   // ISO 8601 or YYYY-MM (undefined = present)
  isCurrent?: boolean;
}
