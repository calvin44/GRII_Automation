import { MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useRouter } from "next/router"
import { useCallback } from "react"

export interface FeatureSelectProps {
  feature: Feature
  handleFeatureSelect: (event: SelectChangeEvent<Feature>) => void
}

export const FeatureSelect: React.FC<FeatureSelectProps> = ({
  feature,
  handleFeatureSelect,
}) => {
  const { push } = useRouter()
  const navigateToAdmin = useCallback(() => {
    push("/admin")
  }, [])
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

      {/* Page navigation */}
      <MenuItem onClick={navigateToAdmin} value="admin">
        Admin Page
      </MenuItem>
    </Select>
  )
}
