/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom

// Firebase Actions
import { db, auth } from "config/firebase";
import { collection, where, query, onSnapshot } from "firebase/firestore";

// @mui material components
import Icon from "@mui/material/Icon";

// React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import Chip from "@mui/material/Chip";
import SellIcon from "@mui/icons-material/Sell";

export default function ProjectData() {
  const Navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newestTasks, setNewestTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [progressPercentages, setProgressPercentages] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]); 


  const Project = ({ emoji, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar name={name} size="sm" variant="rounded">
        <span style={{ fontSize: "1.5em" }}>{emoji}</span>
      </MDAvatar>
      <MDTypography
        display="block"
        variant="button"
        fontWeight="medium"
        ml={1}
        lineHeight={1}
      >
        {name}
      </MDTypography>
    </MDBox>
  );

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

  // Fetch all tasks
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

      const now = new Date();
      const sixHoursAgo = new Date(now - 6 * 60 * 60 * 1000); // 6 hours ago

      // Separate tasks into categories
      const categorizedTasks = fetchedTasks.reduce(
        (categories, task) => {
          const allChecked = task.content.every((item) => item.checked);
          const allNotChecked = task.content.every((item) => !item.checked);
          const updatedAt = new Date(task.updatedAt); // Assuming you have an 'updatedAt' field in your task object

          if (allChecked) {
            categories.completed.push(task);
          } else if (allNotChecked) {
            categories.upcoming.push(task);
          } else if (updatedAt > sixHoursAgo) {
            categories.recent.push(task);
          }

          return categories;
        },
        { completed: [], upcoming: [], recent: [] }
      );

      setTasks(fetchedTasks);
      setCompletedTasks(categorizedTasks.completed);
      setUpcomingTasks(categorizedTasks.upcoming);
      setRecentTasks(categorizedTasks.recent);
    });

    return () => unsubscribe();
  }, []);

  // progress percentage

  useEffect(() => {
    // Calculate progress percentage for each task
    const newProgressPercentages = tasks.map((task) => {
      const checkedCount = task.content.filter((item) => item.checked).length;
      const totalCount = task.content.length;
      const progressPercentage = (checkedCount / totalCount) * 100;
      return Math.floor(progressPercentage);
    });

    // Update progress percentages in the state
    setProgressPercentages(newProgressPercentages);
  }, [tasks]);

  const mapTasksToRows = () => {
    return tasks.map((task, index) => ({
      project: (
        <Link key={task.id} to={`/tasks/${task.id}`}>
          <Project emoji={task.emoji} name={task.title} />
        </Link>
      ),
      priority: (
        <Chip
          icon={<SellIcon />}
          label={task.priority}
          variant="outlined"
          size="medium"
        />
      ),
      status: (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          {task.status}
        </MDTypography>
      ),
      completion: <Progress color="info" value={progressPercentages[index]} />,
      action: (
        <MDTypography component="a" href="#" color="text">
          <Icon>more_vert</Icon>
        </MDTypography>
      ),
      // Add more properties as needed
    }));
  };

  const crows = mapTasksToRows();
  console.log("crows: ", crows);

  const cols = [
    { Header: "project", accessor: "project", width: "30%", align: "left" },
    { Header: "priority", accessor: "priority", align: "left" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "completion", accessor: "completion", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  return {
    columns: cols,
    rows: crows,
  };
}
