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
  showErrorDialog: boolean
  onCloseErrorDialog: (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => void
  closeErrorDialog: () => void
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  showErrorDialog,
  onCloseErrorDialog,
  closeErrorDialog,
}) => {
  return (
    <Dialog
      open={showErrorDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseErrorDialog}
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
          onClick={closeErrorDialog}
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
