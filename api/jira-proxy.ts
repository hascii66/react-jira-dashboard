import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;

  if (!path || typeof path !== "string") {
    res.status(400).json({ error: "Missing ?path query param" });
    return;
  }

  const jiraEmail = process.env.JIRA_EMAIL;
  const jiraToken = process.env.JIRA_API_TOKEN;
  const jiraDomain = "https://sirisoftth.atlassian.net";

  if (!jiraEmail || !jiraToken) {
    res.status(500).json({ error: "Missing Jira credentials in env" });
    return;
  }

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

    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(response.status).send(text);
  } catch (err: any) {
    res.status(500).json({
      error: err.message || "Proxy request failed",
      stack: err.stack || "",
    });
  }
}