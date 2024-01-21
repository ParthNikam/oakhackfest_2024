
import { useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";

// React components
import MDBox from "components/MDBox";

// React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Editor from "./components/Editor/index";
import UserTasks from "layouts/tasks/components/Tasks";

function Tasks() {
  const { taskId } = useParams();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Grid item xs={12} xl={12}>
              <Editor taskId={taskId} />
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4} md={4}>
            <UserTasks />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tasks;
