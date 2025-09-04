import { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchUsers, fetchSubtasksByAssignee } from "../api/jira";
import TasksTable from "../components/TasksTable";
import SummaryTable from "../components/SummaryTable";
import SummaryChart from "../components/SummaryChart";

export default function AssigneePage() {
  const [assignees, setAssignees] = useState<any[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<any | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"detail" | "summary">("detail");

  // ✅ โหลด assignees ตอน mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const users = await fetchUsers();
        const formatted = users.map((u: any) => ({
          id: u.accountId,
          name: u.displayName,
        }));
        setAssignees(formatted);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAssigneeChange = async (_: any, assignee: any | null) => {
    setSelectedAssignee(assignee);
    if (!assignee) {
      setIssues([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchSubtasksByAssignee(assignee.id);
      setIssues(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ flexGrow: 1, mb: 2 }}>
        <Grid container spacing={2}>
          {/* ✅ Select Assignee */}

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Autocomplete
              options={assignees}
              getOptionLabel={(option) => option.name}
              value={selectedAssignee}
              onChange={handleAssigneeChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Assignee"
                  variant="outlined"
                />
              )}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>

      {/* ✅ Toggle View */}
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_, val) => val && setView(val)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="detail">Detail</ToggleButton>
        <ToggleButton value="summary">Summary</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <CircularProgress color="success" />
      ) : view === "detail" ? (
        <TasksTable
          issues={issues}
          title={`Sub-tasks for ${selectedAssignee?.name || ""}`}
        />
      ) : (
        <>
          <SummaryTable issues={issues} />
          {selectedAssignee && (
            <SummaryChart
              issues={issues}
              assigneeName={selectedAssignee.name}
            />
          )}
        </>
      )}
    </Container>
  );
}
