import axios from "axios";

const sendPrompt = async (prompt) => {
  try {
    const response = await axios.post("http://localhost:5000/api/manim", {
      prompt,
    });
    return response.data;
  } catch (error) {
    console.log("Error while fetching the result", error);
  }
};

export default sendPrompt;
