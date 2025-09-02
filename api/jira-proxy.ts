export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.searchParams.get("path");

  if (!path) {
    return new Response(JSON.stringify({ error: "Missing ?path query param" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const jiraEmail = process.env.JIRA_EMAIL!;
  const jiraToken = process.env.JIRA_API_TOKEN!;
  const jiraDomain = "https://sirisoftth.atlassian.net";

  const jiraUrl = `${jiraDomain}${path}`;

  try {
    const response = await fetch(jiraUrl, {
      method: req.method,
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${jiraEmail}:${jiraToken}`).toString("base64"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? await req.text() : undefined,
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Proxy request failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}