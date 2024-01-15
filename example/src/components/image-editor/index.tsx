import { Box, Container, Grid, useTheme } from "@mui/material"
import Header from "@src/components/header"
import { useEffect, useState } from "react"
import { CanvasImageEdit } from "../../../../dist"
import TabsVerticalComponent from "../ui/tabs/tabs-vertical"

export default function ImageEditor() {
  const [canvasImage, setCanvasImage] = useState<CanvasImageEdit | null>(null)
  useEffect(() => {
    const loader = new CanvasImageEdit()
    const canvas = document.getElementById("canvas") as HTMLCanvasElement

    loader.ImageLoader(canvas, "/input.jpeg")
    loader.result?.render(canvas)

    setCanvasImage(loader)
  }, [])

  const [_, setSelectedFile] = useState<File | null>(null) // Define selectedFile type

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])

      const canvas = document.getElementById("canvas") as HTMLCanvasElement
      let fr = new FileReader()
      fr.onload = function () {
        canvasImage?.ImageLoader(canvas, fr.result as string)
        canvasImage?.result?.render(canvas)
      }
      fr.readAsDataURL(event.target.files[0])
    }
  }

  const theme = useTheme()
  return (
    <Box
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.palette.neutral.neutral200,
      }}
    >
      <Container>
        <Header handleImage={handleCapture} />

        <Grid container>
          <Grid
            item
            md={9}
            container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
          >
            <div id="ubersnap-editor"></div>
            <canvas id="canvas" height={500} width={400} />
          </Grid>
          <Grid
            item
            md={3}
            sx={{
              height: "90vh",
              overflow: "auto",
              // scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                background: "#000",
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "10px",
                backgroundColor: "#252525",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}
          >
            <TabsVerticalComponent cvs={canvasImage} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
