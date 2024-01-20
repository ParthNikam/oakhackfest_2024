

// React Components
import { React, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getLlamaResponse } from "actions/lmao";

// React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
// import MDTypography from "components/MDTypography";


// Firebase Actions
import { db } from "config/firebase";
import {
  updateDoc,
  onSnapshot,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import {
  Grid,
  Checkbox,
  Card,
  Chip,
  Select,
  Menu,
  MenuItem,
  Button,
  IconButton,
  InputLabel,
  FormControl,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Popover from "@mui/material/Popover";
import EmojiPicker from "emoji-picker-react";

// Firebase Actions
import { db } from "config/firebase";
import {
  updateDoc,
  onSnapshot,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import MDTypography from "components/MDTypography";

import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from '@mui/material/CircularProgress';


function Editor({ taskId }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([{ text: "", checked: false }]);
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  // priority picker
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  const handlePriorityChange = (selectedPriority) => {
    setPriority(selectedPriority);
    console.log(priority);
    handleMenuClose();
  };

  // progressbar
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    // Calculate the percentage of checked items
    const checkedCount = content.filter((item) => item.checked).length;
    const totalCount = content.length;
    const newProgressPercentage = (checkedCount / totalCount) * 100;

    // Update the progress percentage in the state
    setProgressPercentage(newProgressPercentage);
  }, [content]);


  // Emoji Picker
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState("");

  const handleEmojiClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onEmojiClick = (event, emojiObject) => {
    setSelectedEmoji(emojiObject.emoji);
    handleClose();
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (anchorEl && !anchorEl.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [anchorEl]);

  // Task Box
  const handleKeyPress = (e, index) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      // Check if the box is empty
      if (content[index].text === "") {
        const newContent = [...content];

        // Prevent removing the only box
        if (newContent.length > 1) {
          newContent.splice(index, 1); // Remove the empty box
          setContent(newContent);
        }
      }
    } else if (e.ctrlKey && e.shiftKey && e.key === "N") {
      const newContent = [...content];
      newContent.splice(index + 1, 0, { text: "" });
      setContent(newContent);
    }
  };

  const handleInputChange = (e, index) => {
    const newContent = [...content];
    newContent[index] = {
      ...newContent[index], // Preserve the existing properties of the object
      text: e.target.value, // Update the 'text' property
    };
    setContent(newContent);
  };

  const handleCheckboxChange = (index) => {
    const newContent = [...content];
    newContent[index] = {
      text: content[index].text,
      checked: !content[index].checked,
    };
    setContent(newContent);
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskDoc = doc(db, "tasks", taskId);

        // Listen for changes to the document
        const unsubscribe = onSnapshot(taskDoc, (snapshot) => {
          if (snapshot.exists()) {
            const { title: taskTitle, content: taskContent } = snapshot.data();
            setTitle(taskTitle);
            setContent(taskContent);
          } else {
            console.error("Task does not exist");
            // Handle the case where the task does not exist
          }
        });

        return () => {
          // Unsubscribe from the snapshot listener when the component unmounts
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching task data", error);
        // Handle the error
      }
    };

    fetchData();
  }, [taskId]);

  // Push Data
  useEffect(() => {
    const updateTaskData = async () => {
      try {
        const taskDoc = doc(db, "tasks", taskId);
        await updateDoc(taskDoc, {
          title: title,
          content: content,
          dueDate: dueDate,
          priority: priority,
        });
      } catch (error) {
        console.error("Error updating task data", error);
        // Handle the error
      }
    };
    updateTaskData();
  }, [title, content, dueDate, priority]);

  // Send Data to Llama
  const sendDatatoLlama = async (inputText) => {
    try {
      const data = await dispatch(getLlamaResponse(inputText));
      console.log("data aaya bhaai!!~ ", data);
      return data;
    } catch (e) {
      console.error("Error getting data", e);
    }
  };

  const [loadingStates, setLoadingStates] = useState(
    Array(content.length).fill(false)
  );

  const handleButtonClick = async (index) => {
    try {
      const updatedLoadingStates = [...loadingStates];
      updatedLoadingStates[index] = true; // Set loading to true for the specific button
      setLoadingStates(updatedLoadingStates);

      const llamaResponse = await sendDatatoLlama(content[index].text);
      const newContent = [...content];
      newContent[index] = {
        ...newContent[index],
        text: `${newContent[index].text}\n${llamaResponse}`,
      };
      setContent(newContent);
    } catch (error) {
      console.error("Error fetching data from Llama:", error);
      // Handle error if necessary
    } finally {
      const updatedLoadingStates = [...loadingStates];
      updatedLoadingStates[index] = false; // Set loading back to false when data fetching is complete
      setLoadingStates(updatedLoadingStates);
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox alignItems="center" pt={5} px={2}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDBox display="flex" alignItems="center" ml={{ lg: 10 }}>
            <MDBox mr={2}>
              <MDButton
                variant="outlined"
                color="info"
                size="large"
                iconOnly
                onClick={handleEmojiClick}
              >
                {selectedEmoji || "😊"}
              </MDButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <EmojiPicker onSelect={onEmojiClick} />
              </Popover>
            </MDBox>
            <MDBox display="flex" flexDirection="column">
              <Grid container spacing={2}>
                <Grid item xs={10} lg={12}>
                  <MDInput
                    id="standard-basic"
                    variant="standard"
                    fontSize="large"
                    fontWeigh="medium"
                    placeholder="Title"
                    inputProps={{ style: { fontSize: 30 } }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} lg={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} lg={3}>
                      {/* Date Picker */}

                      <Chip
                        label={`Due Date: ${
                          dueDate ? dueDate.toDateString() : "Not set"
                        }`}
                        // onClick={handleMenuOpen}
                      />
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        // onClose={handleMenuClose}
                      >
                        Date
                        {/* <DatePicker
                          value={dueDate}
                          onChange={handleDueDateChange}
                          renderInput={(params) => <TextField {...params} />}
                        /> */}
                      </Menu>
                    </Grid>
                    <Grid item xs={6} lg={4}>
                      {/* Priority Picker */}
                      <Chip
                        label={`Priority: ${priority || "Not set"}`}
                        onClick={handleMenuOpen}
                      />
                      <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() => handlePriorityChange("critical")}
                        >
                          Critical
                        </MenuItem>
                        <MenuItem onClick={() => handlePriorityChange("high")}>
                          High
                        </MenuItem>
                        <MenuItem
                          onClick={() => handlePriorityChange("inprogress")}
                        >
                          In Progress
                        </MenuItem>
                        <MenuItem onClick={() => handlePriorityChange("low")}>
                          Low
                        </MenuItem>
                        <MenuItem
                          onClick={() => handlePriorityChange("medium")}
                        >
                          Medium
                        </MenuItem>
                      </Menu>
                    </Grid>
                    <Grid item xs={6} lg={4}>
                      <LinearProgress
                        variant="determinate"
                        value={progressPercentage}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        </MDBox>

        <MDBox>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={12} my={2}>
              {content &&
                content.map((item, index) => (
                  <Grid container spacing={1} key={index}>
                    <Grid
                      item
                      xs={12}
                      lg={11}
                      my={1}
                      key={index}
                      display="flex"
                      alignItems="center"
                    >
                      <Checkbox
                        checked={content[index].checked}
                        onChange={() => handleCheckboxChange(index)}
                      />
                      <MDInput
                        id="standard-basic"
                        variant="outlined"
                        fontSize="large"
                        fontWeight="medium"
                        placeholder={`Task ${index + 1}`}
                        margin="normal"
                        border="none"
                        fullWidth
                        multiline
                        value={content[index].text}
                        style={{
                          textDecoration: content[index].checked
                            ? "line-through"
                            : "none",
                          textDecorationThickness: content[index].checked
                            ? "2px"
                            : "initial",
                          color: content[index].checked ? "red" : "black",
                        }}
                        onChange={(e) => handleInputChange(e, index)}
                        onKeyDown={(e) => handleKeyPress(e, index)}
                      />
                    </Grid>
                    <Grid item xs={2} lg={1} my={3}>
                      {loadingStates[index] ? (
                        <CircularProgress color="info"/>
                      ) : (
                        <MDButton
                          variant="outlined"
                          color="info"
                          size="medium"
                          iconOnly
                          onClick={() => handleButtonClick(index)}
                        >
                          <AutoAwesomeRoundedIcon
                            sx={{ width: "20px", height: "20px" }}
                          />
                        </MDButton>
                      )}
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Editor;
