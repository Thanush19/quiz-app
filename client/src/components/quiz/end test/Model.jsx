import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const Modal = ({ open, handleClose, handleEndTest }) => {
  const handleConfirmEndTest = () => {
    handleEndTest(); // Call the function to end the test if user confirms
    handleClose(); // Close the modal after handling end test action
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>End Test Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your scores will not be calculated if you leave the test early. Are
          you sure you want to end the test?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Confirm to Go Back
        </Button>
        <Button onClick={handleConfirmEndTest} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
