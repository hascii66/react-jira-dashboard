import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResponsiveDrawer from "./components/SidebarResponsive";
import Home from "./pages/Home";
import AssigneePage from "./pages/AssigneePage";
import AssigneeSummaryPage from "./pages/AssigneeSummaryPage";

function Reports() {
  return <div>Reports Page</div>;
}

function Settings() {
  return <div>Settings Page</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ResponsiveDrawer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assignees" element={<AssigneePage />} />
          <Route path="/summary" element={<AssigneeSummaryPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </ResponsiveDrawer>
    </BrowserRouter>
  );
}