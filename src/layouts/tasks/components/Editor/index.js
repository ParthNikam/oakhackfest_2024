// React Components
import { React, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getLlamaResponse } from "actions/lmao";

// React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDProgress from "components/MDProgress";
import MDTypography from "components/MDTypography";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { Grid, Checkbox, Card, Chip } from "@mui/material";
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

import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { setDefaultLocale } from "react-datepicker";

function Editor({ taskId }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([{ text: "", checked: false }]);
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");

  // Date picker

  // priority picker

  // progressbar
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    // Calculate the percentage of checked items
    const checkedCount = content.filter((item) => item.checked).length;
    const totalCount = content.length;
    const newProgressPercentage = Math.floor((checkedCount / totalCount) * 100);

    // Update the progress percentage in the state
    setProgressPercentage(newProgressPercentage);
  }, [content]);

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );

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
        console.log("fetching data bro please work");

        // Listen for changes to the document
        const unsubscribe = onSnapshot(taskDoc, (snapshot) => {
          if (snapshot.exists()) {
            const {
              title: taskTitle,
              content: taskContent,
              emoji: taskEmoji,
              priority: taskPriority,
              status: taskStatus,
              dueDate: taskDueDate,
            } = snapshot.data();
            setTitle(taskTitle);
            setContent(taskContent);
            setSelectedEmoji(taskEmoji);
            setPriority(taskPriority);
            setStatus(taskStatus);
            setDueDate(taskDueDate);
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
          status: status,
          emoji: selectedEmoji,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error updating task data", error);
        // Handle the error
      }
    };
    updateTaskData();
  }, [title, content]);

  // Send Data to Llama
  const sendDatatoLlama = async (inputText, modelType) => {
    try {
      const data = await dispatch(getLlamaResponse(inputText, modelType));
      console.log("data aaya bhaai!!~ ", data);
      return data;
    } catch (e) {
      console.error("Error getting data", e);
    }
  };

  const [loadingStates, setLoadingStates] = useState(
    Array(content.length).fill(false)
  );

  const handleAssistantClick = async (index, modelType) => {
    try {
      console.log(index);
      const updatedLoadingStates = [...loadingStates];
      updatedLoadingStates[index] = true; // Set loading to true for the specific button
      setLoadingStates(updatedLoadingStates);

      const llamaResponse = await sendDatatoLlama(content[index].text, modelType);
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

  // AI Assistant
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const open = Boolean(anchorMenuEl);

  const handleMenuClick = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorMenuEl(null);
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
            <MDInput
                    id="standard-basic"
                    variant="outlined"
                    fontSize="large"
                    fontWeigh="medium"
                    style={{ fontSize: "1.5em", width:"65px" }}
                    inputProps={{ style: { fontSize: 30 } }}
                    value={selectedEmoji}
                    onChange={(e) => setSelectedEmoji(e.target.value)}
                  />
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

                {/* <Grid item xs={12} lg={12}>
                  <Grid container>
                    <Grid item xs={12} lg={2}>
                      <Chip label={dueDate} />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                      <Chip label={priority} />

                    </Grid>
                    <Grid item xs={12} lg={2}>
                      <Chip label={status} />

                    </Grid>
                    <Grid item xs={12} lg={2}>
                    <Progress color="info" value={progressPercentage} />
                    </Grid>
                  </Grid>
                </Grid> */}
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
                        <CircularProgress color="info" />
                      ) : (
                        <MDButton
                          variant="outlined"
                          color="info"
                          iconOnly
                          onClick={() => handleAssistantClick(index, 'planner')}
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