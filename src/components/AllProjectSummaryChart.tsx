import { Paper, Typography, Box, IconButton } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type Props = {
  data: {
    assignee: string;
    projects: { [key: string]: number };
  }[];
  sortMode: "point" | "name";
};

export default function AllProjectSummaryChart({ data, sortMode }: Props) {
  if (!data || data.length === 0) return null;

  // ✅ จัดเรียงตามโหมด
  const sortedData = [...data].sort((a, b) => {
    if (sortMode === "name") {
      return a.assignee.localeCompare(b.assignee);
    } else {
      const sumA = Object.values(a.projects).reduce(
        (acc, v) => acc + (typeof v === "number" ? v : 0),
        0
      );
      const sumB = Object.values(b.projects).reduce(
        (acc, v) => acc + (typeof v === "number" ? v : 0),
        0
      );
      return sumB - sumA;
    }
  });

  const assignees = sortedData.map((d) => d.assignee);

  const allProjects = Array.from(
    new Set(sortedData.flatMap((d) => Object.keys(d.projects)))
  );

  const series = allProjects.map((project) => ({
    label: project,
    data: sortedData.map((d) => d.projects[project] || 0),
  }));

  const chartWidth = Math.max(800, assignees.length * 120);

  const scrollChart = (dir: "left" | "right") => {
    const el = document.getElementById("chart-container");
    if (el) {
      el.scrollBy({
        left: dir === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 3, mb: 3, position: "relative" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        📊 Assignee Summary Chart
      </Typography>

      {/* ✅ ปุ่มเลื่อนซ้าย */}
      <IconButton
        onClick={() => scrollChart("left")}
        sx={{
          position: "absolute",
          top: "50%",
          left: 8,
          transform: "translateY(-50%)",
          bgcolor: "white",
          boxShadow: 1,
          "&:hover": { bgcolor: "grey.200" },
        }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>

      {/* ✅ Scroll ได้เมื่อ chart กว้าง */}
      <Box
        id="chart-container"
        sx={{
          overflowX: "auto",
          scrollBehavior: "smooth",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <BarChart
            xAxis={[{ scaleType: "band", data: assignees }]}
            series={series}
            height={400}
            width={chartWidth}
            margin={{ top: 20, right: 20, bottom: 80, left: 40 }}
          />
        </Box>
      </Box>

      {/* ✅ ปุ่มเลื่อนขวา */}
      <IconButton
        onClick={() => scrollChart("right")}
        sx={{
          position: "absolute",
          top: "50%",
          right: 8,
          transform: "translateY(-50%)",
          bgcolor: "white",
          boxShadow: 1,
          "&:hover": { bgcolor: "grey.200" },
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}