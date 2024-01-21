import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";



const app = express();
const PORT = 5000;


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// Import and use the users route
import Routes from './routes/index.js';
app.use('/', Routes);




// // Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});