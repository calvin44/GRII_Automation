import { forwardRef, useCallback } from "react"
import { TransitionProps } from "@mui/material/transitions"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
} from "@mui/material"

export enum Response {
  YES = "YES",
  NO = "NO",
}

const Transition = forwardRef<
  HTMLDivElement,
  TransitionProps & { children: React.ReactElement }
>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface ConfirmSendDialogProps {
  onResolve: (r: Response) => void
}

export const ConfirmSendDialog: React.FC<ConfirmSendDialogProps> = ({
  onResolve,
}) => {
  const handleOk = useCallback(() => {
    onResolve(Response.YES)
  }, [onResolve, close])

  const handleCancel = useCallback(() => {
    onResolve(Response.NO)
  }, [onResolve, close])

  return (
    <Dialog
      TransitionComponent={Transition}
      keepMounted
      open
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
        <DialogContentText sx={{ textAlign: "center" }}>
          Send Notification?
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
          onClick={handleCancel}
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            paddingLeft: 4,
            paddingRight: 4,
          }}
          onClick={handleOk}
          variant="contained"
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  )
}
