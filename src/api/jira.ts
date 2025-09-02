const email = import.meta.env.VITE_JIRA_EMAIL;
const token = import.meta.env.VITE_JIRA_API_TOKEN;

// ✅ เลือก baseUrl ตาม environment
const isDev = import.meta.env.MODE === "development";

// Dev ใช้ vite proxy, Prod ใช้ CORS proxy
const corsProxy = "https://go-cors-proxy-1.onrender.com";
// const proxy = "https://cors-anywhere.herokuapp.com/";
const jiraDomain = "https://sirisoftth.atlassian.net";

function buildUrl(path: string) {
  if (isDev) {
    return `/jira${path}`;
  } else {
    // encode Jira URL เป็น query param
    return `${corsProxy}/?url=${encodeURIComponent(jiraDomain + path)}`;
  }
}

const headers = {
  Authorization: "Basic " + btoa(`${email}:${token}`),
  Accept: "application/json",
};

export async function fetchProjects() {
  const res = await fetch(buildUrl(`/rest/api/3/project`), { headers });
  if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchSprints(boardId: number) {
  const res = await fetch(buildUrl(`/rest/agile/1.0/board/${boardId}/sprint`), {
    headers,
  });
  if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchSubtasks(projectKey: string) {
  const jql = `project=${projectKey} AND issuetype = Sub-task`;
  let allIssues: any[] = [];
  let startAt = 0;
  const maxResults = 100;

  while (true) {
    const url = buildUrl(
      `/rest/api/3/search?jql=${encodeURIComponent(
        jql
      )}&startAt=${startAt}&maxResults=${maxResults}`
    );

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);

    const data = await res.json();
    allIssues = [...allIssues, ...data.issues];

    if (data.issues.length < maxResults) break;
    startAt += maxResults;
  }

  return allIssues || [];
}

export async function fetchUsers() {
  const res = await fetch(
    buildUrl(`/rest/api/3/users/search?maxResults=1000`),
    { headers }
  );
  if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);

  const users = await res.json();
  return users.filter((u: any) => u.active) || [];
}

export async function fetchSubtasksByAssignee(accountId: string) {
  const jql = `issuetype = Sub-task AND assignee = "${accountId}"`;
  const res = await fetch(
    buildUrl(
      `/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=9999999`
    ),
    { headers }
  );

  if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);

  const data = await res.json();
  return data.issues || [];
}

export async function fetchAllSubtasks(onChunk: (chunk: any[]) => void) {
  let startAt = 0;
  const maxResults = 100;

  while (true) {
    const url = buildUrl(
      `/rest/api/3/search?jql=issuetype=Sub-task&startAt=${startAt}&maxResults=${maxResults}`
    );

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);

    const data = await res.json();
    if (!data.issues || data.issues.length === 0) break;

    // ✅ ส่ง chunk กลับไปให้ UI ใช้ก่อน
    onChunk(data.issues);

    if (data.startAt + data.maxResults >= data.total) break;
    startAt += maxResults;
  }
}