import { response } from "express";
import User from "../models/user.model.js";
import moment from "moment";
import { v2 as cloudinary } from "cloudinary";
import geminiResponse from "../utils/gemini.js";

// Upload image to Cloudinary
const uploadCloudnary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "get current user error " });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadCloudnary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "updataAssistant error " });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    //console.log("command",command)

    if (!req.userId) {
      return res.status(401).json({ response: "Unauthorized: userId not set" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }
    user.history.push(command);
    user.save();
    const userName = user.name;
    const assistantName = user.assistantName;

    // ✅ Declare result once
    let result;
    try {
      result = await geminiResponse(command, assistantName, userName);
     // console.log("Gemini raw result:", result);
    } catch (err) {
      console.error("Gemini API error:", err);
      return res
        .status(500)
        .json({ response: "Failed to get response from assistant" });
    }

    // ✅ Validate that result is a string before using .match
    if (!result || typeof result !== "string") {
      console.error("Invalid Gemini response format:", result);
      return res
        .status(500)
        .json({ response: "Assistant returned invalid format." });
    }

    console.log("Gemini raw result:", result);
    const jsonMatch = result.match(/{[\s\S]*}/);
    console.log("jsonMatch", jsonMatch);
    if (!jsonMatch) {
      return res
        .status(400)
        .json({ response: "Sorry, I can't understand the result." });
    }

    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error("JSON Parse error:", parseErr);
      return res
        .status(400)
        .json({ response: "Invalid JSON format from assistant." });
    }

    const { type, userInput, response } = gemResult;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get-time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm:A")}`,
        });
      case "get-day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get-month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });

      // Dynamic command cases
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
      case "whattsapp":
      case "vscode-open":
        return res.json({ type, userInput: gemResult.userInput, response });

      default:
        if (type === "general") {
          return res.json({
            type,
            userInput: gemResult.userInput,
            response: gemResult.response || "I'm here to help you!",
          });
        }

        return res
          .status(400)
          .json({ response: "I didn't understand that command." });
    }
  } catch (error) {
    console.error("askToAssistant server error:", error);
    return res.status(500).json({ response: "ask assistant error" });
  }
};
