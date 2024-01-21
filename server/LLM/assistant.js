import Replicate from "replicate";

const replicate = new Replicate({
  auth: "r8_6SoyxHG5n3q09uHWSbPop2spDIX6h7h2Ico3Z",
});

const getLlamaResponse = async (prompt_input) => {
  const pre_prompt =
    "You are a task planner. Your role is to take in deadlines and tasks and create a day-wise comprehensive schedule for the user to accomplish their task. Specifically, you are a study planner, therefore you have to make sure that the user studies every topic and subtopic they provide to you.";

  const output = await replicate.run(
    "meta/llama-2-13b-chat:56acad22679f6b95d6e45c78309a2b50a670d5ed29a37dd73d182e89772c02f1",
    {
      input: {
        top_p: 0.1,
        prompt: `User: ${pre_prompt} ${prompt_input}\nAssistant:`,
        max_length: 1000,
        temperature: 0.75,
        repetition_penalty: 1,
      },
    }
  );

  const full_response = output.join(""); // Join the words into a string
  console.log("done fetching response from Llama.");
  return full_response;
};

export default getLlamaResponse;
