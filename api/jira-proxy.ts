import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;

  if (!path || typeof path !== "string") {
    res.status(400).json({ error: "Missing ?path query param" });
    return;
  }

  const jiraEmail = process.env.JIRA_EMAIL!;
  const jiraToken = process.env.JIRA_API_TOKEN!;
  const jiraDomain = "https://sirisoftth.atlassian.net";

  const url = `${jiraDomain}${path}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Authorization":
          "Basic " + Buffer.from(`${jiraEmail}:${jiraToken}`).toString("base64"),
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status).send(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Proxy request failed" });
  }
}