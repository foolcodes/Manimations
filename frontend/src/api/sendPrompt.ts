import axios from "axios";

const sendPrompt = async (prompt: string): Promise<any> => {
  try {
    const response = await axios.post("http://localhost:5050/api/manim", {
      prompt,
    });
    return response.data;
  } catch (error) {
    console.log("Error while fetching the result", error);
    throw error; // optionally re-throw so it can be handled upstream
  }
};

export default sendPrompt;
