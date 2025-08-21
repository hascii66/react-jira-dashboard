import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

type Props = {
  projects: any[];
  onChange: (projectKey: string) => void;
};

export default function ProjectDropdown({ projects, onChange }: Props) {
  return (
    <FormControl fullWidth>
      <InputLabel>Select Project</InputLabel>
      <Select onChange={(e) => onChange(e.target.value)}>
        {projects.map((p) => (
          <MenuItem key={p.id} value={p.key}>
            {p.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}