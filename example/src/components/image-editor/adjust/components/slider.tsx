import { Slider, ThemeProvider, createTheme, useTheme } from "@mui/material"
import React from "react"
import { AdjustProps, SliderProps } from "../types"
import { minMaxSlider } from "@src/data/constant"

export default function SliderComponent(props: SliderProps) {
  const theme = useTheme()
  const { onChange, name, value } = props
  const [slider, setSlider] = React.useState<number>(
    value[name as keyof AdjustProps]
  )

  const handleChange = (_event: Event, newValue: number | number[], ) => {
    if (typeof newValue === "number") {
      setSlider(newValue)
      onChange(name, newValue)
    }
  }
  const setWidthLinearGradien = () => {
    if (!slider) return

    const percent = (Math.abs(slider) / minMaxSlider[name].max) * 50
    const formatData = `${Math.abs(50 - percent)}%`
    return formatData
  }

  const customTheme = createTheme({
    components: {
      MuiSlider: {
        styleOverrides: {
          root: {
            color: "#363636",
          },
          thumb: {
            backgroundColor: "#666",
            border: "1px solid white",
            width: "15px",
            height: "15px",
          },
          active: {},
          valueLabel: {},
          track: {
            display: "none",
          },
          rail: {
            opacity: 0.7,
            background: `linear-gradient(
              to ${slider > 0 ? "left" : "right"}, 
              rgba(255, 255, 255, 0.4) 0%, 
              rgba(255, 255, 255, 0.4) ${setWidthLinearGradien()}, 
              ${theme.palette.neutral.neutral10} ${setWidthLinearGradien()}, 
              ${theme.palette.neutral.neutral10} 50%, 
              rgba(255, 255, 255, 0.4) 50%, 
              rgba(255, 255, 255, 0.4) 100%
              )`,
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={customTheme}>
      <Slider
        min={minMaxSlider[name].min}
        max={minMaxSlider[name].max}
        step={1}
        aria-labelledby="negative-slider"
        name={name}
        value={slider}
        onChange={handleChange}
      />
    </ThemeProvider>
  )
}
