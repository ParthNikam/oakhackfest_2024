

import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom

// @mui material components
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Firebase Actions
import { db, auth } from "config/firebase";
import {
  getDoc,
  addDoc,
  collection,
  where,
  query,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

// Billing page components
import Task from "layouts/tasks/components/Task";

function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const handleNewButtonClick = async () => {
    try {
      if (auth.currentUser) {
        // Create a new document in Firestore
        const newTaskRef = await addDoc(collection(db, "tasks"), {
          title: "",
          content: [{"text":"", "checked":false}],
          emoji: "🙂",
          userId: auth.currentUser.uid,
          dueDate: null,
          timestamp: serverTimestamp(),
        });
  
        // Get the newly assigned taskId
        const newTaskDocSnapshot = await getDoc(newTaskRef);
        const newTaskId = newTaskDocSnapshot.id;
  
        // Navigate to the newly created task
        console.log("navigating to the task");
        navigate(`/tasks/${newTaskId}`);

      }
    } catch (e) {
      console.error(e);
    }
  };

  // useEffect(() => {
  //   const userId = auth.currentUser?.uid;
  
  //   if (!userId) {
  //     console.log("User not logged in.");
  //     return;
  //   }
  
  //   const q = query(collection(db, "tasks"), where("userId", "==", userId));
  
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     const fetchedTasks = [];
  //     querySnapshot.forEach((doc) => {
  //       fetchedTasks.push({ id: doc.id, ...doc.data() });
  //     });
  
  //     setTasks(fetchedTasks); // Update the state with the new data
  //   });
  
  //   // Clean up the listener when the component unmounts or when you want to stop listening
  //   return () => unsubscribe();
  // }, []);  

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
      console.log("User not logged in.");
      return;
    }
  
    const q = query(collection(db, "tasks"), where("userId", "==", userId));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTasks = [];
      querySnapshot.forEach((doc) => {
        fetchedTasks.push({ id: doc.id, ...doc.data() });
      });
  
      setTasks(fetchedTasks); // Update the state with the new data
    });
  
    // Clean up the listener when the component unmounts or when you want to stop listening
    return () => unsubscribe();
  }, []);
  
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pt={3}
        px={2}
      >
        <MDTypography
          variant="h6"
          fontWeight="medium"
          textTransform="capitalize"
        >
          Your Tasks
        </MDTypography>
        <MDButton
          variant="outlined"
          color="info"
          size="small"
          onClick={handleNewButtonClick}
        >
          + new task
        </MDButton>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            1 - 30 January
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox pt={3} pb={2} px={2}>
        <MDBox mb={2}>
          <MDTypography
            variant="caption"
            color="text"
            fontWeight="bold"
            textTransform="uppercase"
          >
            newest
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          {tasks.map((task) => (
            <Link key={task.id} to={`/tasks/${task.id}`}>
              <Task
                key={task.id}
                taskId={task.id}
                name={task.title}
                emoji={task.emoji}
                description={task.content[0].text.slice(0, 20)} 
              />
            </Link>
          ))}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Tasks;
