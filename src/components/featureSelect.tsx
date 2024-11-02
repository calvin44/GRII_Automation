import { ToggleButton, ToggleButtonGroup } from "@mui/material"

export interface FeatureSelectProps {
  feature: Feature
  handleFeatureSelect: (feat: FeatureSelectProps["feature"]) => void
}

export const FeatureSelect: React.FC<FeatureSelectProps> = ({
  feature,
  handleFeatureSelect,
}) => {
  return (
    <ToggleButtonGroup fullWidth exclusive color="standard" value={feature}>
      <ToggleButton
        onClick={() => handleFeatureSelect("reminder")}
        value="reminder"
      >
        Reminder
      </ToggleButton>
      <ToggleButton
        onClick={() => handleFeatureSelect("laguKU")}
        value="laguKU"
      >
        Lagu KU
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
