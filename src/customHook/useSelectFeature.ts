import { useState, useEffect } from "react"

type FeatureType = Feature

export const useFeatureSelect = () => {
  const [selectedFeature, setSelectedFeature] =
    useState<FeatureType>("reminder")

  useEffect(() => {
    // This will only run on the client side
    const savedFeature = localStorage.getItem("feature") as FeatureType | null
    if (savedFeature) {
      setSelectedFeature(savedFeature)
    }
  }, [])

  const handleFeatureSelect = (newFeature: FeatureType) => {
    setSelectedFeature(newFeature)
    localStorage.setItem("feature", newFeature)
  }

  return { selectedFeature, handleFeatureSelect }
}
