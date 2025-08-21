const domain = import.meta.env.VITE_JIRA_DOMAIN;
const email = import.meta.env.VITE_JIRA_EMAIL;
const token = import.meta.env.VITE_JIRA_API_TOKEN;

const headers = {
  Authorization: "Basic " + btoa(`${email}:${token}`),
  Accept: "application/json",
};

export async function fetchProjects() {
  const res = await fetch(`${domain}/rest/api/3/project`, { headers });
  return res.json();
}

export async function fetchSprints(boardId: number) {
  const res = await fetch(`${domain}/rest/agile/1.0/board/${boardId}/sprint`, {
    headers,
  });
  return res.json();
}

export async function fetchSubtasks(projectKey: string) {
  const jql = `project=${projectKey} AND issuetype = Sub-task`;
  let allIssues: any[] = [];
  let startAt = 0;
  const maxResults = 100; // Jira Cloud limit

  while (true) {
    const url = `${domain}/rest/api/3/search?jql=${encodeURIComponent(
      jql
    )}&startAt=${startAt}&maxResults=${maxResults}`;

    const res = await fetch(url, { headers });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch subtasks: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    allIssues = [...allIssues, ...data.issues];

    if (data.issues.length < maxResults) {
      break; // ไม่มีหน้าใหม่แล้ว
    }

    startAt += maxResults; // ขยับ offset ไปเรื่อย ๆ
  }

  return allIssues || [];
}

export async function fetchUsers() {
  const res = await fetch(
    `${domain}/rest/api/3/users/search?maxResults=1000`,
    { headers }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
  }

  const users = await res.json();
  // ✅ filter เอาเฉพาะ user ที่ยัง active
  return users.filter((u: any) => u.active) || [];
}

export async function fetchSubtasksByAssignee(accountId: string) {
  const jql = `issuetype = Sub-task AND assignee = "${accountId}"`;
  const res = await fetch(
    `${domain}/rest/api/3/search?jql=${encodeURIComponent(
      jql
    )}&maxResults=9999999`,
    { headers }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch subtasks: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  return data.issues || [];
}

export async function fetchAllSubtasks(onChunk: (chunk: any[]) => void) {
  let startAt = 0;
  const maxResults = 100;

  while (true) {
    const res = await fetch(
      `${domain}/rest/api/3/search?jql=issuetype=Sub-task&startAt=${startAt}&maxResults=${maxResults}`,
      { headers }
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch subtasks: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    if (!data.issues || data.issues.length === 0) break;

    // ✅ ส่งข้อมูล chunk ให้ UI ใช้งานทันที
    onChunk(data.issues);

    if (data.startAt + data.maxResults >= data.total) break;
    startAt += maxResults;
  }
}