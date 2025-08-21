import { 
  Box, 
  IconButton, 
  Tooltip, 
  // Avatar 
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeFilled,
  // Star,
  // Search,
  // ListAlt,
  // People,
  // Settings,
  // Notifications,
  // Info,
} from "@mui/icons-material";

const menuItems = [
  { icon: <HomeFilled />, label: "Home", path: "/" },
  //   { icon: <Search />, label: "Search", path: "/search" },
  //   { icon: <ListAlt />, label: "Logs", path: "/logs" },
  //   { icon: <People />, label: "Users", path: "/users" },
  //   { icon: <Settings />, label: "Settings", path: "/settings" },
  //   { icon: <Notifications />, label: "Notifications", path: "/notifications" },
  //   { icon: <Info />, label: "About", path: "/about" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 80,
        height: "100vh",
        borderRadius: "16px 16px 16px 16px",
        bgcolor: "#111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,
        gap: 1,
      }}
    >
      {menuItems.map((item) => (
        <Tooltip title={item.label} placement="right" key={item.path}>
          <IconButton
            onClick={() => navigate(item.path)}
            sx={{
              color: location.pathname === item.path ? "#fff" : "#888",
              bgcolor: location.pathname === item.path ? "#333" : "transparent",
              "&:hover": { bgcolor: "#222" },
              width: 48,
              height: 48,
            }}
          >
            {item.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}
