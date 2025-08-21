import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchAllSubtasks } from "../api/jira";
import {
  cachedSummary,
  cachedAssigneeOptions,
  cachedDone,
  cachedLoading,
  setCache,
} from "../cache";
import AllProjectSummaryChart from "../components/AllProjectSummaryChart";

export default function AssigneeSummaryPage() {
  const [data, setData] = useState<any[]>(cachedSummary || []);
  const [loading, setLoading] = useState(cachedLoading);
  const [done, setDone] = useState(cachedDone);

  const [assigneeOptions, setAssigneeOptions] = useState<any[]>(
    cachedAssigneeOptions || []
  );
  const [selectedAssignee, setSelectedAssignee] = useState<any | null>({
    id: "all",
    name: "All Assignees",
  });

  // ✅ Project filter
  const [projectOptions, setProjectOptions] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>({
    id: "all",
    name: "All Projects",
  });

  // ✅ Sort mode (point or name) — เริ่มจาก point ก่อน
  const [sortMode, setSortMode] = useState<"point" | "name">("point");

  useEffect(() => {
    if (cachedSummary.length > 0) {
      const allProjects = Array.from(
        new Set(cachedSummary.flatMap((d) => Object.keys(d.projects)))
      ).map((p) => ({ id: p, name: p }));
      setProjectOptions(allProjects);
      return;
    }

    setLoading(true);

    fetchAllSubtasks((chunk) => {
      setData((prev) => {
        const summaryMap = new Map<string, Map<string, number>>();

        prev.forEach(
          (item: { assignee: string; projects: { [x: string]: any } }) => {
            const projectMap = new Map(Object.entries(item.projects));
            summaryMap.set(item.assignee, projectMap);
          }
        );

        chunk.forEach((issue: any) => {
          const assignee = issue.fields.assignee?.displayName || "Unassigned";
          const project = issue.fields.project?.name || "Unknown Project";
          const points = issue.fields.customfield_10030 || 0;

          if (!summaryMap.has(assignee)) {
            summaryMap.set(assignee, new Map());
          }
          const projectMap = summaryMap.get(assignee)!;
          projectMap.set(project, (projectMap.get(project) || 0) + points);
        });

        const formatted = Array.from(summaryMap.entries()).map(
          ([assignee, projectMap]) => ({
            assignee,
            projects: Object.fromEntries(projectMap.entries()),
          })
        );

        setAssigneeOptions((prevOpts) => {
          const names = new Set(prevOpts.map((o) => o.name));
          formatted.forEach((f) => {
            if (!names.has(f.assignee)) {
              prevOpts.push({ id: f.assignee, name: f.assignee });
            }
          });
          return [...prevOpts];
        });

        const allProjects = Array.from(
          new Set(formatted.flatMap((d) => Object.keys(d.projects)))
        ).map((p) => ({ id: p, name: p }));
        setProjectOptions(allProjects);

        // setCache({
        //   summary: formatted,
        //   options: assigneeOptions,
        //   done,
        //   loading,
        // });

        return formatted;
      });
    }).finally(() => {
      setLoading(false);
      setDone(true);

    //   setCache({
    //     summary: data,
    //     options: assigneeOptions,
    //     done: true,
    //     loading: false,
    //   });
    });
  }, []);

  // ✅ filter
  let filteredData = data;
  if (selectedAssignee && selectedAssignee.id !== "all") {
    filteredData = filteredData.filter(
      (d) => d.assignee === selectedAssignee.name
    );
  }
  if (selectedProject && selectedProject.id !== "all") {
    filteredData = filteredData.map((d) => ({
      ...d,
      projects: {
        [selectedProject.name]: d.projects[selectedProject.name] || 0,
      },
    }));
  }

  // ✅ sort
  filteredData = [...filteredData].sort((a, b) => {
    if (sortMode === "name") {
      return a.assignee.localeCompare(b.assignee);
    } else {
      const sumA = Object.values(a.projects).reduce(
        (acc: number, v: any) => acc + (typeof v === "number" ? v : 0),
        0
      );
      const sumB = Object.values(b.projects).reduce(
        (acc: number, v: any) => acc + (typeof v === "number" ? v : 0),
        0
      );
      return sumB - sumA;
    }
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography variant="h5">
          Assignee Summary (Projects & Story Points)
        </Typography>
        {loading && <CircularProgress size={20} color="success" />}

        {/* ✅ Toggle Sort */}
        <ToggleButtonGroup
          value={sortMode}
          exclusive
          onChange={(_, val) => val && setSortMode(val)}
          size="small"
        >
          <ToggleButton value="point">Sort by Point</ToggleButton>
          <ToggleButton value="name">Sort by Name</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* ✅ Filters */}
      <Box display="flex" gap={2} mb={2}>
        <Autocomplete
          options={[{ id: "all", name: "All Assignees" }, ...assigneeOptions]}
          getOptionLabel={(option) => option.name}
          value={selectedAssignee}
          onChange={(_, val) => setSelectedAssignee(val)}
          renderInput={(params) => (
            <TextField {...params} label="Filter by Assignee" />
          )}
          sx={{ flex: 1 }}
        />

        <Autocomplete
          options={[{ id: "all", name: "All Projects" }, ...projectOptions]}
          getOptionLabel={(option) => option.name}
          value={selectedProject}
          onChange={(_, val) => setSelectedProject(val)}
          renderInput={(params) => (
            <TextField {...params} label="Filter by Project" />
          )}
          sx={{ flex: 1 }}
        />
      </Box>

      <>
        {done && <Typography sx={{ mt: 2 }}>✅ Loaded all subtasks</Typography>}

        <AllProjectSummaryChart data={filteredData} sortMode={sortMode} />

        {filteredData.map((item) => (
          <Paper key={item.assignee} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{item.assignee}</Typography>
            <ul>
              {Object.entries(item.projects).map(([project, points]) => (
                <li key={project}>
                  <b>{project}</b>: {String(points)} points
                </li>
              ))}
            </ul>
          </Paper>
        ))}
      </>
    </Container>
  );
}