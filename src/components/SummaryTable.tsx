import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
} from "@mui/material";

type Props = {
  issues: any[];
};

type SummaryRow = {
  project: string;
  sprint: string;
  totalPoints: number;
};

export default function SummaryTable({ issues }: Props) {
  if (!Array.isArray(issues) || issues.length === 0) {
    return <div>No data found</div>;
  }

  // ✅ group by project + sprint
  const summaryMap = new Map<string, SummaryRow>();

  issues.forEach((issue) => {
    const project = issue.fields.project?.name || "Unknown Project";
    const sprint = issue.fields.customfield_10020?.[0]?.name || "No Sprint";
    const storyPoint = issue.fields.customfield_10030 || 0;

    const key = `${project}_${sprint}`;
    if (!summaryMap.has(key)) {
      summaryMap.set(key, { project, sprint, totalPoints: 0 });
    }
    summaryMap.get(key)!.totalPoints += storyPoint;
  });

  const summary = Array.from(summaryMap.values());

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Project</TableCell>
            <TableCell>Sprint</TableCell>
            <TableCell>Total Story Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {summary.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.project}</TableCell>
              <TableCell>{row.sprint}</TableCell>
              <TableCell>{row.totalPoints}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}