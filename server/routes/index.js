import express from 'express';
import {spawn} from "child_process";
import getLlamaResponse from '../LLM/assistant.js';

const router = express.Router();


router.post('/tasks', async (req, res) => {
  const {inputText, modelType} = req.body;

  try {
    // Spawn a child process to run the Python script
    const pythonProcess = spawn('python', ['./LLM/Mistral.py', inputText, modelType]);

   // Collect data from the Python script
   let full_response = '';
   pythonProcess.stdout.on('data', (data) => {
     full_response += data.toString();
   });


    // Handle the end of the Python script execution
    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      res.status(200).json(full_response);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
