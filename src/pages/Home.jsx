import { React, useContext, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import aiImg from "../assets/image/ai.gif";
import userImg from "../assets/image/user.gif";
import { GrMenu } from "react-icons/gr";
import { RxCross1 } from "react-icons/rx";



//import { set } from 'mongoose';
function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
const [showMenu, setShowMenu] = useState(false);
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingonRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;

    const speakNow = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      isSpeakingonRef.current = true;

      utterance.onend = () => {
        setAiText("")
        isSpeakingonRef.current = false;
      };

      utterance.lang = "hi-IN"; // Set language to Hindi

      // ✅ Get all available voices
      const voices = synth.getVoices();

      // ✅ Try to find a female English voice
      const preferredVoice = voices.find(
        (v) =>
          (v.lang === "hi-IN" && v.name.toLowerCase().includes("female")) ||
          v.name.toLowerCase().includes("zira") || // Edge/Windows
          v.name.toLowerCase().includes("samantha") || // macOS
          v.name.toLowerCase().includes("google uk english female") // Chrome
      );

      // ✅ Fallback to first available voice
      utterance.voice = preferredVoice || voices[0];

      synth.speak(utterance);
    };

    // ✅ Handle Chrome's voice loading delay
    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = () => {
        speakNow();
      };
    } else {
      speakNow();
    }
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    //speak(response);

    if (type == "google-search") {
      const query = userInput.replace("google search", "").trim();
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        "_blank"
      );
    }
    if (type == "youtube-search") {
      const query = userInput.replace("youtube search", "").trim();
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          query
        )}`,
        "_blank"
      );
    }
    if (type == "youtube-play") {
      const query = userInput.replace("youtube play", "").trim();
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          query
        )}`,
        "_blank"
      );
    }
    if (type == "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type == "instagram-open") {
      window.open(`https://www.instagram.com`, "_blank");
    }
    if (type == "facebook-open") {
      window.open(`https://www.facebook.com`, "_blank");
    }
    if (type == "weather-show") {
      const query = userInput.replace("weather", "").trim();
      window.open(
        `https://www.google.com/search?q=weather+${encodeURIComponent(query)}`,
        "_blank"
      );
    }
    if (type == "vscode-open") {
      window.open(`https://code.visualstudio.com/`, "_blank");
    }

    if (type === "camera-open") {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          const video = document.getElementById("webcam");
          video.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err);
          alert("Camera permission denied or unavailable.");
        });
    }
  };
  useEffect(() => {
    if (!userData || !userData.assistantName) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;
    const isRecognizingRef = { current: false };
    let lastTranscript = ""; // avoid duplicate processing

    const safeRecognition = () => {
      if (!isSpeakingonRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition started safely");
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.error("Recognition start error:", err);
          }
        }
      }
    };

    recognition.onstart = () => {
      console.log("🎤 Recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("🔇 Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);

      // Auto-restart only if not speaking
      if (!isSpeakingonRef.current) {
        setTimeout(safeRecognition, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("⚠️ Speech recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && !isSpeakingonRef.current) {
        setTimeout(safeRecognition, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("🗣️ Heard:", transcript);

      // Ignore duplicate transcripts
      if (transcript === lastTranscript) return;
      lastTranscript = transcript;

      try {
        if (
          transcript
            .toLowerCase()
            .includes(userData.assistantName.toLowerCase())
        ) {
          setAiText("");
          setUserText(transcript);
          recognition.stop(); // pause recognition
          isRecognizingRef.current = false;
          setListening(false);

          const data = await getGeminiResponse(transcript);
          console.log("🤖 Gemini response:", data);
        
          if (data?.response) {
            speak(data.response);
            handleCommand(data);
          } else {
            console.warn("🤷‍♂️ No valid response from assistant");
            speak("Sorry, I didn't understand that.");
          }
          setAiText(data.response || "Sorry, I didn't understand that.");
          setUserText("");
        }
      } catch (error) {
        console.error("❌ Error handling voice command:", error);
      }
    };

    // Fallback restart every 10s if idle
    const fallbackInterval = setInterval(() => {
      if (!isSpeakingonRef.current && !isRecognizingRef.current) {
        console.log("🔁 Restarting recognition due to fallback");
        safeRecognition();
      }
    }, 10000);

    // Start recognition on load
    safeRecognition();

    // const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, What can I help you with?`);
    //     window.speechSynthesis.speak(greeting)
     
       
const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);

function speakWithFemaleVoice() {
  const voices = window.speechSynthesis.getVoices();

  // Print voices to console so you can see what is available
  console.log("Available voices:", voices);

  // Try to select a female voice (adjust names if needed)
  const femaleVoice = voices.find(voice =>
    voice.name.toLowerCase().includes("female") ||
    voice.name.toLowerCase().includes("zira") ||
    voice.name.toLowerCase().includes("samantha") ||
    voice.name.toLowerCase().includes("google") ||
    voice.name.toLowerCase().includes("karen")
  );

  if (femaleVoice) {
    greeting.voice = femaleVoice;
    //console.log("Selected voice:", femaleVoice.name);
  } else {
    console.warn("No female voice found. Using default.");
  }

  window.speechSynthesis.speak(greeting);
}

// Ensure voices are loaded before accessing them
if (speechSynthesis.getVoices().length === 0) {
  speechSynthesis.onvoiceschanged = speakWithFemaleVoice;
} else {
  speakWithFemaleVoice();
}


// Wait for voices to be loaded before speaking
if (speechSynthesis.getVoices().length === 0) {
  speechSynthesis.onvoiceschanged = speakWithFemaleVoice;
} else {
  speakWithFemaleVoice();
}

        

    return () => {
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
      clearInterval(fallbackInterval);
    };
  }, [userData]);

  return (
    <div className="w-full min-h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col gap-[3px]">
{/* Menu Toggle Icon (Hamburger) */}
<GrMenu
  className="text-white fixed top-5 right-5 w-7 h-7 z-50 cursor-pointer lg:hidden"
  onClick={() => setShowMenu(true)} // You'll need to manage this state
/>

{/* Overlay Menu */}
{showMenu && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center gap-6 z-40">
    
    {/* Close Icon */}
    <RxCross1
      className="text-white absolute top-5 right-5 w-7 h-7 cursor-pointer"
      onClick={() => setShowMenu(false)}
    />

    {/* Menu Buttons */}
    <button
      className="w-[160px] h-[50px] text-black font-semibold bg-white rounded-full text-[18px] px-5 py-2 transition hover:bg-gray-200"
      onClick={handleLogOut}
    >
      Log Out
    </button>

    <button
      className="w-[200px] h-[50px] text-black font-semibold bg-white rounded-full text-[18px] px-5 py-2 transition hover:bg-gray-200"
      onClick={() => {
        setShowMenu(false);
        navigate("/customize");
      }}
    >
      Customize Assistant
    </button>
  </div>
)}

{/* Desktop Buttons (Always visible on lg screens) */}
<div className="hidden lg:flex gap-4 absolute top-5 right-5 z-10">
  <button
    className="w-[150px] h-[45px] text-black font-semibold bg-white rounded-full text-[16px] hover:bg-gray-200"
    onClick={handleLogOut}
  >
    Log Out
  </button>
  <button
    className="w-[190px] h-[45px] text-black font-semibold bg-white rounded-full text-[16px] hover:bg-gray-200"
    onClick={() => navigate("/customize")}
  >
    Customize Assistant
  </button>
</div>

      
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover"
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>
      {/* {userText && <img src={userImg} alt="" className='w-[200px]'/>} */}
      {listening && !isSpeakingonRef.current && (
        <img src={userImg} alt="User speaking" className="w-[200px]" />
      )}
      {isSpeakingonRef.current && (
        <img src={aiImg} alt="AI speaking" className="w-[200px]" />
      )}
      <h1 className="text-lg md:text-xl lg:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-semibold text-center tracking-wide drop-shadow-md animate-fade-in">
  {userText || aiText || "Listening..."}
</h1>



      
    </div>
  );
}


export default Home;




