import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Link,
} from "@mui/material";

type Props = {
  issues: any[];
};

export default function IssuesTable({ issues }: Props) {
  if (!Array.isArray(issues) || issues.length === 0) {
    return <div>No issues found</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Project</TableCell>
            <TableCell>ชื่อการ์ด</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Sprint</TableCell>
            <TableCell>Story Point</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Link</TableCell> {/* ✅ เพิ่ม column Link */}
          </TableRow>
        </TableHead>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>{issue.fields.project?.name}</TableCell>
              <TableCell>{issue.fields.summary}</TableCell>
              <TableCell>
                {issue.fields.assignee?.displayName || "Unassigned"}
              </TableCell>
              <TableCell>
                {issue.fields.customfield_10020?.[0]?.name || "-"}
              </TableCell>
              <TableCell>{issue.fields.customfield_10030 || 0}</TableCell>
              <TableCell>{issue.fields.status?.name}</TableCell>{" "}
              {/* ✅ Status */}
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
