import Replicate from "replicate";
import fs from "fs";

const replicate = new Replicate({
  auth: "r8_6SoyxHG5n3q09uHWSbPop2spDIX6h7h2Ico3Z",
});


var pre_prompt = "You are a task planner. Your role is to take in deadlines and tasks and create a day wise comprehensive schedule for the user to accomplish their task. Specificly, you are a study planner, therefore you have to make sure that the user studies every topic and subtopic they provide to you.  "
var prompt_input = "Create detailed daw wise a study plan for a test on next monday, today is tuesday. The portion is fluid mechanics, heat transfer, thermodynamics, waves and oscillations, simple harmonic motion, 3d geometry, vector algebra, planes and lines, general organic chemistry"

const output = await replicate.run(
  "meta/llama-2-13b-chat:56acad22679f6b95d6e45c78309a2b50a670d5ed29a37dd73d182e89772c02f1",
  {
    input: {
      top_p: 0.1,
      prompt:  `User: ${pre_prompt} ${prompt_input} \nAssistant:`,
      max_length: 1000,
      temperature: 0.75,
      repetition_penalty: 1
    }
  }
);

var full_response = ""
output.forEach((word) => {
  full_response += word
})

// Specify the file path
const filePath = './output.txt';

// Write the full response to the file
fs.writeFile(filePath, full_response, (err) => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log('\nFull response has been written to the file:', filePath);
  }
});