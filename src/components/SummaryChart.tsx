import { Paper, Typography, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

type Props = {
  issues: any[];
  assigneeName: string;
};

export default function SummaryChart({ issues, assigneeName }: Props) {
  // ✅ Group issues by Project
  const projectGroups = new Map<string, any[]>();

  issues.forEach((issue) => {
    const project = issue.fields.project?.name || "Unknown Project";
    if (!projectGroups.has(project)) {
      projectGroups.set(project, []);
    }
    projectGroups.get(project)!.push(issue);
  });

  if (issues.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Dashboard: {assigneeName}'s Story Points
      </Typography>

      {Array.from(projectGroups.entries()).map(([project, projectIssues]) => {
        // ✅ Group by Sprint in each Project
        const sprintMap = new Map<string, number>();

        projectIssues.forEach((issue) => {
          const sprint = issue.fields.customfield_10020?.[0]?.name || "No Sprint";
          const points = issue.fields.customfield_10030 || 0;
          sprintMap.set(sprint, (sprintMap.get(sprint) || 0) + points);
        });

        let entries = Array.from(sprintMap.entries()).map(([label, value]) => {
          const sprintMatch = label.match(/Sprint\s+(\d+)/i);
          const sprintNum = sprintMatch ? parseInt(sprintMatch[1], 10) : 0;
          return { label, value, sprintNum };
        });

        entries.sort((a, b) => a.sprintNum - b.sprintNum);

        const labels = entries.map((e) => e.label);
        const values = entries.map((e) => e.value);

        return (
          <Paper key={project} sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {project}
            </Typography>
            <BarChart
              xAxis={[{ scaleType: "band", data: labels }]}
              series={[{ data: values, label: "Story Points" }]}
              height={300}
              colors={["Green"]}
              margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
            />
          </Paper>
        );
      })}
    </Box>
  );
}