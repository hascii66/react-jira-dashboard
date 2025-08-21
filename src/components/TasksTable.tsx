import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Link,
  Typography,
} from "@mui/material";

type Props = {
  issues: any[];
  title?: string; // ✅ เพิ่ม optional title เช่น "Subtasks for John Doe"
};

export default function TasksTable({ issues, title }: Props) {
  if (!Array.isArray(issues) || issues.length === 0) {
    return <Typography variant="body1">No tasks found</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      {title && (
        <Typography variant="h6" sx={{ p: 2 }}>
          {title}
        </Typography>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Project</TableCell>
            <TableCell>ชื่อการ์ด</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Sprint</TableCell>
            <TableCell>Story Point</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>{issue.fields.project?.name || "-"}</TableCell>
              <TableCell>{issue.fields.summary || "-"}</TableCell>
              <TableCell>
                {issue.fields.assignee?.displayName || "Unassigned"}
              </TableCell>
              <TableCell>
                {issue.fields.customfield_10020?.[0]?.name || "-"}
              </TableCell>
              <TableCell>{issue.fields.customfield_10030 ?? "-"}</TableCell>
              <TableCell>{issue.fields.status?.name || "-"}</TableCell>
              <TableCell>
                <Link
                  href={`https://sirisoftth.atlassian.net/browse/${issue.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  เปิดการ์ด
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}