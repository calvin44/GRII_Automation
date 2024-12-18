import { SelectChangeEvent } from "@mui/material"
import { useState, useEffect } from "react"

type FeatureType = Feature

export const useFeatureSelect = () => {
  const [selectedFeature, setSelectedFeature] =
    useState<FeatureType>("lineUserList")

  useEffect(() => {
    // This will only run on the client side
    const savedFeature = localStorage.getItem("feature") as FeatureType | null
    if (savedFeature) {
      setSelectedFeature(savedFeature)
    }
  }, [])

  const handleFeatureSelect = (event: SelectChangeEvent<Feature>) => {
    const selectedFeature = event.target.value as Feature
    setSelectedFeature(selectedFeature)
    localStorage.setItem("feature", selectedFeature)
  }

  return { selectedFeature, handleFeatureSelect }
}
