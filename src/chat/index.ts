import { settings } from "@elizaos/core";
import readline from "readline";
import { initializeDatabase, storeMessage } from "../database";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const db = initializeDatabase("data"); // Initialize your database

rl.on("SIGINT", () => {
  rl.close();
  process.exit(0);
});

async function handleUserInput(input, agentId) {
  if (input.toLowerCase() === "exit") {
    rl.close();
    process.exit(0);
  }

  try {
    const serverPort = parseInt(settings.SERVER_PORT || "3000");
    const user = "User"; // Replace with actual user identifier

    // Check if the user wants to create a database entry
    if (input.toLowerCase().startsWith("create entry")) {
      // For example, you can prompt the user for their trade data or any information to store
      console.log("Please provide the trade data you want to store.");
      // Assuming you take user input for trade data
      rl.question("Trade Data: ", async (tradeData) => {
        // Store the trade data in the database
        await storeMessage(db, user, tradeData);
        console.log("Trade data has been stored successfully.");
      });
    } else {
      storeMessage(db, user, input); // Store the main message
    }

    const response = await fetch(
      `http://localhost:${serverPort}/${agentId}/message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          userId: "user",
          userName: "User",
        }),
      },
    );

    const data = await response.json();
    data.forEach((message) => console.log(`${"Agent"}: ${message.text}`));
  } catch (error) {
    console.error("Error fetching response:", error);
  }
}

export function startChat(characters) {
  function chat() {
    const agentId = characters[0].name ?? "Agent";
    rl.question("You: ", async (input) => {
      await handleUserInput(input, agentId);
      if (input.toLowerCase() !== "exit") {
        chat(); // Loop back to ask another question
      }
    });
  }

  return chat;
}
