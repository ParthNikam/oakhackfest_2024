
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import { db, auth } from 'config/firebase';
import { getDocs, deleteDoc, collection, where, query, doc } from 'firebase/firestore';

function Task({ taskId, name, emoji, description }) {
  const handleDeleteButtonClick = async () => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        
        // Replace 'yourCollection' with the actual name of your collection
        const q = query(
          collection(db, 'tasks'),
          where('userId', '==', userId)
        );

        const querySnapshot = await getDocs(q);

        console.log("taskId: ", taskId)
        if (!querySnapshot.empty) {
          const keyToDelete = taskId; // Replace 'your-key' with the actual key you want to delete
          const documentToDelete = querySnapshot.docs.find(doc => doc.id === keyToDelete);
        
          if (documentToDelete) {
            await deleteDoc(doc(db, 'tasks', documentToDelete.id));
            console.log(`Document with ID ${documentToDelete.id} deleted successfully.`);
          } else {
            console.error(`Document with ID ${keyToDelete} not found.`);
          }
        } 
      } 
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  return (
    <MDBox key={name} component="li" py={1} pr={2} mb={1}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDBox display="flex" alignItems="center">
          <MDBox mr={1}>
            <MDButton variant="outlined" color={"none"} iconOnly circular>
            <span style={{ fontSize: "2em" }}>{emoji || "😊"}</span>
            </MDButton>
          </MDBox>
          <MDBox display="flex" flexDirection="column">
            <MDTypography variant="button" fontWeight="medium" gutterBottom>
              {name}
            </MDTypography>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              {description}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDButton
          variant="outlined"
          color={"error"}
          
          iconOnly
          circular
          onClick={handleDeleteButtonClick}
        >
          <Icon sx={{ fontSize: "1em", fontWeight: "light" }}>close</Icon>
        </MDButton>
      </MDBox>
    </MDBox>
  );
}

// Typechecking props of the Transaction
Task.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]).isRequired,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Task;
