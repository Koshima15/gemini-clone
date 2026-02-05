import React, { useState, useEffect } from "react";
import "./main.css";
import { assets } from "../../assets/assets";
import { useChat } from "../../context/ChatContext";

// speech recognition
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Main = () => {
  const [input, setInput] = useState("");
  const { activeChat, sendPrompt, loading } = useChat();

  // speech recognition hooks
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleSend = () => {
    if (!input.trim()) return;
    sendPrompt(input);
    setInput("");
    resetTranscript();
  };

  const handleCardClick = (text) => {
    sendPrompt(text);
  };

  // const handleMic = () => {
  //   if (!browserSupportsSpeechRecognition) {
  //     alert("Speech recognition not supported in this browser");
  //     return;
  //   }
  //   resetTranscript();
  //   SpeechRecognition.startListening({ continuous: false });
  // };

  const handleMic = () => {
  if (!browserSupportsSpeechRecognition) {
    alert("Speech recognition not supported in this browser");
    return;
  }

  resetTranscript();

  SpeechRecognition.startListening({
    continuous: false,
    language: "en-US",
  });
};


  // // when speech stops → put text into input
  // useEffect(() => {
  //   if (!listening && transcript) {
  //     setInput(transcript);
  //   }
  // }, [listening, transcript]);

  useEffect(() => {
  if (!listening && transcript) {
    setInput(transcript);
    SpeechRecognition.stopListening();
  }
}, [listening, transcript]);


  // show greeting + cards when no chat OR empty chat
  const showHome =
    !activeChat || activeChat.messages.length === 0;

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="User" />
      </div>

      <div className="main-container chat-container">
        {/* Greeting + Cards */}
        {showHome && (
          <>
            <div className="greet">
              <p>
                <span>Hello, Koshu!</span>
              </p>
              <p>How can I help you today?</p>
            </div>

            <div className="cards">
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Suggest beautiful places to see on an upcoming road trip."
                  )
                }
              >
                <p>Suggest beautiful places to see on an upcoming road trip.</p>
                <img src={assets.compass_icon} alt="" />
              </div>

              <div
                className="card"
                onClick={() =>
                  handleCardClick("Briefly explain what HTML is.")
                }
              >
                <p>Briefly explain what HTML is.</p>
                <img src={assets.bulb_icon} alt="" />
              </div>

              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Brainstorm team bonding activities for a work retreat."
                  )
                }
              >
                <p>Brainstorm team bonding activities.</p>
                <img src={assets.message_icon} alt="" />
              </div>

              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Improve the readability of a JavaScript code snippet."
                  )
                }
              >
                <p>Improve the readability of code.</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        )}

        {/* Chat Messages */}
        {!showHome && (
          <div className="chat-messages">
            {activeChat.messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-row ${
                  msg.role === "user" ? "user" : "ai"
                }`}
              >
                {msg.role === "ai" && (
                  <img
                    src={assets.gemini_icon}
                    className="chat-avatar"
                    alt="ai"
                  />
                )}

                <div
                  className={`chat-bubble ${
                    msg.role === "user" ? "right" : "left"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.role === "user" && (
                  <img
                    src={assets.user_icon}
                    className="chat-avatar"
                    alt="user"
                  />
                )}
              </div>
            ))}

            {loading && (
              <div className="loader">
                <hr />
                <hr />
                <hr />
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter prompt here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div>
              <img src={assets.gallery_icon} alt="" className="disabled" />

              {/* Mic */}
              <img
                src={assets.mic_icon}
                alt="mic"
                onClick={handleMic}
                style={{
                  cursor: "pointer",
                  opacity: listening ? 0.6 : 1,
                }}
              />

              <img
                src={assets.send_icon}
                alt="send"
                onClick={handleSend}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div className="bottom-info">
            <p>
              Gemini may display inaccurate information. Double-check responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
