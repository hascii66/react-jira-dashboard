import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // ✅ อ่าน path จาก query
    const { path } = req.query;
    if (!path || typeof path !== "string") {
      res.status(400).json({ error: "Missing ?path query param" });
      return;
    }

    // ✅ Jira credentials จาก Environment Variables (ตั้งใน Vercel Dashboard)
    const jiraEmail = process.env.JIRA_EMAIL!;
    const jiraToken = process.env.JIRA_API_TOKEN!;
    const jiraDomain = "https://sirisoftth.atlassian.net";

    // ✅ สร้าง URL ของ Jira
    const url = `${jiraDomain}${path}`;

    // ✅ ส่ง request ต่อไปที่ Jira
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Authorization":
          "Basic " + Buffer.from(`${jiraEmail}:${jiraToken}`).toString("base64"),
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body:
        req.method !== "GET" && req.body
          ? JSON.stringify(req.body)
          : undefined,
    });

    // ✅ forward response กลับไป
    const text = await response.text();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*"); // allow CORS
    res.status(response.status).send(text);
  } catch (err: any) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: err.message || "Proxy request failed" });
  }
}