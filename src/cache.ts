// เก็บผลลัพธ์ล่าสุดของ fetchAllSubtasks
export let cachedSummary: any[] = [];
export let cachedAssigneeOptions: any[] = [];
export let cachedDone = false;
export let cachedLoading = false;

export function setCache(data: {
  summary: any[];
  options: any[];
  done: boolean;
  loading: boolean;
}) {
  cachedSummary = data.summary;
  cachedAssigneeOptions = data.options;
  cachedDone = data.done;
  cachedLoading = data.loading;
}