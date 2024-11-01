import { FeatureSelectProps } from "@/components/featureSelect"
import { useCallback, useState } from "react"

export const useSelectFeature = () => {
  const [selectedFeature, setSelectedFeature] =
    useState<FeatureSelectProps["feature"]>("reminder")

  const handleFeatureSelect = useCallback(
    (feat: FeatureSelectProps["feature"]) => {
      if (selectedFeature === feat) return
      setSelectedFeature(feat)
    },
    [selectedFeature]
  )

  return {
    selectedFeature,
    handleFeatureSelect,
  }
}
