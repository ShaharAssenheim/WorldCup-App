import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import swal from "sweetalert";


const useStyles = makeStyles((theme) => ({
  btnImg: {
    margin: theme.spacing(3, 0, 0),
  },
}));

const ModalStyle = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AddTeam = ({ItsOpen, Email, handleClose}) => {
  const [name, setName] = React.useState("");
  const [img, setImg] = useState(null);
  const classes = useStyles();

  const SaveTeam = async () => {
    if (name === "") {
      swal("You Must Fill Team NAame", "", "warning");
      return;
    }
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/UserTeam/newTeam", {
      method: "POST",
      body: JSON.stringify({
        Name: name,
        Img_Url: img,
        Admin: Email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          handleClose();
          window.location.reload(false);
        } else {
          swal("Team Name Is Already Exist.", "", "warning");
        }
      })
      .catch((err) => console.error(err));
  };

  const uploadPicture = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onloadend = function () {
        var base64data = reader.result;
        setImg(base64data);
      };
    }
  };

  return (

      <Modal
        open={ItsOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Team
          </Typography>
          <TextField
            autoComplete="fname"
            name="teamName"
            variant="outlined"
            fullWidth
            id="teamName"
            label="Team Name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={classes.btnImg}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            className={classes.btnImg}
          >
            Team Image
            <input type="file" hidden onChange={uploadPicture} />
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => SaveTeam()}
            className={classes.btnImg}
          >
            Save
          </Button>
        </Box>
      </Modal>
  );
};

export default AddTeam;
