from huggingface_hub import InferenceClient
import sys
import re



client = InferenceClient("mistralai/Mixtral-8x7B-Instruct-v0.1")

def format_prompt(prePrompt, promptInput):
  prompt = f"</s> [INST] {prePrompt} [/INST] </s> [INST] {promptInput} [/INST]"
  return prompt

def generate(prePrompt, promptInput, history=[], temperature=0.2, max_new_tokens=1000, top_p=0.95, repetition_penalty=1.0):
    temperature = float(temperature)
    if temperature < 1e-2:
        temperature = 1e-2
    top_p = float(top_p)

    generate_kwargs = dict(
        temperature=temperature,
        max_new_tokens=max_new_tokens,
        top_p=top_p,
        repetition_penalty=repetition_penalty,
        do_sample=True,
        seed=42,
    )

    formatted_prompt = format_prompt(prePrompt, promptInput)
    stream = client.text_generation(formatted_prompt, **generate_kwargs, stream=True, details=True, return_full_text=False)
    
    output_list = []

    for response in stream:
        output_list.append(response.token.text)

    return output_list



if __name__ == "__main__":
    input_text = sys.argv[1]
    model_type = sys.argv[2]

    pre_prompt = ""
    if model_type == "planner":
      pre_prompt = "You are a study planner. Your role is to take in deadlines and tasks and create a day wise and time wise comprehensive schedule for the user to accomplish their task. You have to make sure that the user studies every topic and subtopic they provide to you. You have to ensure that you cover all possible subtopics within the topics they provide, be specific with the subtopics because there may be several of them."
    elif model_type == "analyzer":
      pre_prompt = "You are a question subtopic identifier. Your role is to take in a list of math, physics and chemistry questions and find out the subtopics in them. You have to consider a subtopic for each of the given questions, and list then in a bullet point list. Don't say anything else like 'sure, note that, please note' or anything else at the end, I just want the bullet point list of the subtopics of all the given questions. once you figure out the subtopics, just give a brief suggestion on what to focus upon to improve this. you have to find subtopics to all given questions.that is your job."
    
    prompt_input = input_text
    
    output = generate(prePrompt=pre_prompt, promptInput=prompt_input)
    full_response = "".join(output)
    formatted_response = re.sub(r'\*{2,}', '*', re.sub(r'\n{2,}', '\n\n', full_response.replace('*', '\n*')))

    print(formatted_response)




