import React, { ReactElement, useEffect } from "react"
import { Box, Grid, Typography } from "@mui/material"
import AccordionComponent from "@src/components/ui/accordion"
import { ItemAdjust, defaultValueAdjust } from "@src/data/constant"
import { CanvasImageEdit } from "../../../../../dist"
import { AdjustProps } from "./types"
import SliderComponent from "./components/slider"
import TextFieldComponent from "./components/textfield"

interface AdjustMainProps {
  cvs: CanvasImageEdit | null
}

export default function AdjustMain(props: AdjustMainProps) {
  const { cvs } = props
  const [value, setValue] = React.useState<AdjustProps>(defaultValueAdjust)
  const [isEdit, setEdit] = React.useState<boolean>(false)

  let timeOut: NodeJS.Timeout

  const onChange = async (name: string, newValue: number) => {
    clearTimeout(timeOut)
    setEdit(true)
    setValue((pre) => ({
      ...pre,
      [name]: newValue,
    }))
    timeOut = setTimeout(() => {
      setEdit(false)
      console.log("test")
    }, 1100)
  }

  useEffect(() => {
    if (cvs) {
      let I = cvs.result
      if (I) {
        I.adjustOpenCV({
          brightness: value.brightness,
          exposure: value.exposure,
          contrast: -100,
          temperature: value.temperature,
          hightlight: value.hightlight,
          black: value.blacks,
          shadow: value.shadows,
          white: value.whites,
          cvsId: "canvas",
        })
      }
    }
  }, [value])

  return (
    <>
      {ItemAdjust.map((item) => {
        let details: ReactElement[] | null = null
        const nameContent = item.title.toLowerCase()

        details = item.content.map((itemContent) => {
          const nameItemContent: number | string =
            itemContent.name.toLowerCase()
          return (
            <Box key={itemContent.name}>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item md={8}>
                  <Typography>{itemContent.name}</Typography>
                </Grid>
                <Grid item md={4}>
                  <TextFieldComponent
                    onChange={onChange}
                    name={nameItemContent}
                    value={value}
                  />
                </Grid>
              </Grid>

              <SliderComponent
                onChange={onChange}
                name={nameItemContent}
                value={value}
              />
            </Box>
          )
        })

        // details.push(<pre>{JSON.stringify(value, null, 2)}</pre>)

        return (
          <AccordionComponent
            key={item.title}
            summary={<Typography variant="titleSmall">{item.title}</Typography>}
            details={details}
            idTagAccordion={nameContent}
          />
        )
      })}
    </>
  )
}
