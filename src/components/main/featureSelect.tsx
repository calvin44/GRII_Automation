import { MenuItem, Select, SelectChangeEvent } from "@mui/material"

export interface FeatureSelectProps {
  feature: Feature
  handleFeatureSelect: (event: SelectChangeEvent<Feature>) => void
}

export const FeatureSelect: React.FC<FeatureSelectProps> = ({
  feature,
  handleFeatureSelect,
}) => {
  return (
    <Select
      value={feature}
      onChange={handleFeatureSelect}
      sx={{
        borderRadius: 3,
      }}
    >
      <MenuItem value="lineUserList">Reminder</MenuItem>
      <MenuItem value="createTemplate">Add next month table</MenuItem>
      <MenuItem value="laguKU">Download Lagu KU</MenuItem>
    </Select>
  )
}
