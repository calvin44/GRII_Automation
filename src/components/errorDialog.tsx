import Image from "next/image"
import { forwardRef } from "react"
import { TransitionProps } from "@mui/material/transitions"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
} from "@mui/material"

const Transition = forwardRef<
  HTMLDivElement,
  TransitionProps & { children: React.ReactElement }
>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface ErrorDialogProps {
  showDialog: boolean
  onCloseDialog: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
  closeDialog: () => void
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  showDialog,
  onCloseDialog,
  closeDialog,
}) => {
  return (
    <Dialog
      open={showDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseDialog}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 5,
          padding: 3,
        },
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Image
          src="/consultation-animated.gif"
          alt="Loading"
          width={150}
          height={150}
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <DialogContentText sx={{ textAlign: "center" }}>
          Something went wrong, please contact the developer!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            paddingLeft: 4,
            paddingRight: 4,
          }}
          onClick={closeDialog}
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
