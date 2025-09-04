import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import IssuesTable from "../components/IssuesTable";
import SummaryTable from "../components/SummaryTable";
import { fetchProjects, fetchSubtasks } from "../api/jira";
import SummaryChartByProject from "../components/SummaryChartByProject";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [allSubtasks, setAllSubtasks] = useState<any[]>([]);
  const [filteredSubtasks, setFilteredSubtasks] = useState<any[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [assignees, setAssignees] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [selectedSprint, setSelectedSprint] = useState<any | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<any | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"detail" | "summary">("detail");

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const handleProjectChange = async (_: any, project: any | null) => {
    setSelectedProject(project);
    setSelectedSprint(null);
    setSelectedAssignee(null);
    setSelectedStatus(null);

    if (project) {
      setLoading(true);
      try {
        const issues = (await fetchSubtasks(project.key)) || [];
        setAllSubtasks(issues);
        setFilteredSubtasks(issues);

        // ✅ Extract sprint list
        const sprintSet = new Map<number, any>();
        issues.forEach((issue) => {
          issue.fields.customfield_10020?.forEach((sprint: any) => {
            sprintSet.set(sprint.id, sprint);
          });
        });

        const sprintOptions = [
          { id: "all", name: "All Sprints" },
          { id: "nosprint", name: "No Sprint" },
          ...Array.from(sprintSet.values()),
        ];
        setSprints(sprintOptions);

        // ✅ Extract assignee list
        const assigneeSet = new Map<string, any>();
        issues.forEach((issue) => {
          const a = issue.fields.assignee;
          if (a) {
            assigneeSet.set(a.accountId, {
              id: a.accountId,
              name: a.displayName,
            });
          }
        });
        const assigneeOptions = [
          { id: "all", name: "All Assignees" },
          ...Array.from(assigneeSet.values()),
        ];
        setAssignees(assigneeOptions);

        // ✅ Extract status list
        const statusSet = new Map<string, any>();
        issues.forEach((issue) => {
          const st = issue.fields.status;
          if (st) {
            statusSet.set(st.name, { id: st.name, name: st.name });
          }
        });
        const statusOptions = [
          { id: "all", name: "All Statuses" },
          ...Array.from(statusSet.values()),
        ];
        setStatuses(statusOptions);
      } finally {
        setLoading(false);
      }
    } else {
      setAllSubtasks([]);
      setFilteredSubtasks([]);
      setSprints([]);
      setAssignees([]);
      setStatuses([]);
    }
  };

  const handleSprintChange = (_: any, sprint: any | null) => {
    setSelectedSprint(sprint);
    filterData(sprint, selectedAssignee, selectedStatus);
  };

  const handleAssigneeChange = (_: any, assignee: any | null) => {
    setSelectedAssignee(assignee);
    filterData(selectedSprint, assignee, selectedStatus);
  };

  const handleStatusChange = (_: any, status: any | null) => {
    setSelectedStatus(status);
    filterData(selectedSprint, selectedAssignee, status);
  };

  const filterData = (sprint: any, assignee: any, status: any) => {
    let filtered = allSubtasks;

    // ✅ Filter sprint
    if (sprint && sprint.id !== "all") {
      if (sprint.id === "nosprint") {
        filtered = filtered.filter((issue) => !issue.fields.customfield_10020);
      } else {
        filtered = filtered.filter((issue) =>
          issue.fields.customfield_10020?.some((s: any) => s.id === sprint.id)
        );
      }
    }

    // ✅ Filter assignee
    if (assignee && assignee.id !== "all") {
      filtered = filtered.filter(
        (issue) => issue.fields.assignee?.accountId === assignee.id
      );
    }

    // ✅ Filter status
    if (status && status.id !== "all") {
      filtered = filtered.filter(
        (issue) => issue.fields.status?.name === status.id
      );
    }

    setFilteredSubtasks(filtered);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ flexGrow: 1, mb: 2 }}>
        <Grid container spacing={2}>
          {/* Select Project */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Autocomplete
              options={projects}
              getOptionLabel={(option) => option.name}
              onChange={handleProjectChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Project"
                  variant="outlined"
                />
              )}
              fullWidth
            />
          </Grid>

          {selectedProject && !loading && (
            <>
              {/* Select Sprint */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  options={sprints}
                  getOptionLabel={(option) => option.name}
                  value={selectedSprint}
                  onChange={handleSprintChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Sprint"
                      variant="outlined"
                    />
                  )}
                  fullWidth
                />
              </Grid>

              {/* Select Assignee */}
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

              {/* Select Status */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  options={statuses}
                  getOptionLabel={(option) => option.name}
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Status"
                      variant="outlined"
                    />
                  )}
                  fullWidth
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      <Typography variant="h6" gutterBottom>
        Sub-tasks in {selectedProject?.name || "-"}
      </Typography>

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
        <IssuesTable issues={filteredSubtasks} />
      ) : (
        <>
          <SummaryTable issues={filteredSubtasks} />
          <SummaryChartByProject
            issues={filteredSubtasks}
            projectName={selectedProject?.name}
          />
        </>
      )}
    </Container>
  );
}
