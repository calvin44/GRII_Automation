import { Box } from "@mui/material"
import {
  CreateTemplate,
  FeatureSelect,
  Header,
  ListLagu,
  RemindUser,
  Scripture,
} from "@/components"
import { useFeatureSelect } from "@/customHook"

export default function Home() {
  const { selectedFeature, handleFeatureSelect } = useFeatureSelect()
  return (
    <Box
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        gap={5}
        maxWidth={430}
        bgcolor="white"
        padding={4}
        height="100%"
      >
        <Header />
        <Scripture />
        <FeatureSelect
          feature={selectedFeature}
          handleFeatureSelect={handleFeatureSelect}
        />
        {selectedFeature === "reminder" && <RemindUser />}
        {selectedFeature === "createTemplate" && <CreateTemplate />}
        {selectedFeature === "laguKU" && <ListLagu />}
      </Box>
    </Box>
  )
}
