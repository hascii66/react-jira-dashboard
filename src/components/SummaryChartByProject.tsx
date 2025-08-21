import { Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

type Props = {
  issues: any[];
  projectName?: string;
};

export default function SummaryChartByProject({ issues, projectName }: Props) {
  if (!Array.isArray(issues) || issues.length === 0) {
    return null;
  }

  // ✅ Group by Sprint + Assignee
  const sprintAssigneeMap = new Map<string, Map<string, number>>();
  const assigneeSet = new Set<string>();

  issues.forEach((issue) => {
    const sprint = issue.fields.customfield_10020?.[0]?.name || "No Sprint";
    const assignee = issue.fields.assignee?.displayName || "Unassigned";
    const points = issue.fields.customfield_10030 || 0;

    if (!sprintAssigneeMap.has(sprint)) {
      sprintAssigneeMap.set(sprint, new Map());
    }

    const sprintMap = sprintAssigneeMap.get(sprint)!;
    sprintMap.set(assignee, (sprintMap.get(assignee) || 0) + points);

    assigneeSet.add(assignee);
  });

  // ✅ Convert & sort sprint
  let sprintEntries = Array.from(sprintAssigneeMap.entries()).map(
    ([sprint, assigneeMap]) => {
      const sprintMatch = sprint.match(/Sprint\s+(\d+)/i);
      const sprintNum = sprintMatch ? parseInt(sprintMatch[1], 10) : 0;
      return { sprint, sprintNum, assigneeMap };
    }
  );

  sprintEntries.sort((a, b) => a.sprintNum - b.sprintNum);

  // ✅ Prepare data for stacked chart
  const labels = sprintEntries.map((e) => e.sprint);
  const assignees = Array.from(assigneeSet);

  const series = assignees.map((assignee) => ({
    label: assignee,
    data: sprintEntries.map((entry) => entry.assigneeMap.get(assignee) || 0),
  }));

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Sprint Summary {projectName ? `for ${projectName}` : ""} (by Assignee)
      </Typography>
      <BarChart
        xAxis={[{ scaleType: "band", data: labels }]}
        series={series}
        height={400}
        margin={{ top: 20, right: 30, bottom: 40, left: 50 }}
        // ✅ stacked bar
        layout="vertical"
        slotProps={{
          legend: { position: { vertical: "middle", horizontal: "start" } },
        }}
      />
    </Paper>
  );
}