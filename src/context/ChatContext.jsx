import { createContext, useContext, useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ChatContext = createContext();

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// helpers
const cleanText = (text) =>
  text.replace(/[#*_`>-]/g, "").replace(/\s+/g, " ").trim();

const limitWords = (text, max = 70) =>
  text.split(" ").slice(0, max).join(" ");

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]); // ALL chats
  const [activeChatId, setActiveChatId] = useState(null); // current chat
  const [loading, setLoading] = useState(false);

  // derived active chat
  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // create new blank chat
  const newChat = () => {
    const id = Date.now();
    const chat = {
      id,
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [chat, ...prev]);
    setActiveChatId(id);
  };

  // open existing chat
  const openChat = (id) => {
    setActiveChatId(id);
  };

  // send prompt
  const sendPrompt = async (input) => {
    if (!input.trim()) return;

    let chatId = activeChatId;

    // if no chat exists, create one
    if (!chatId) {
      const id = Date.now();
      const chat = {
        id,
        title: input.split(" ").slice(0, 4).join(" "),
        messages: [],
      };
      setChats((prev) => [chat, ...prev]);
      setActiveChatId(id);
      chatId = id;
    }

    // add user message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title:
                chat.messages.length === 0
                  ? input.split(" ").slice(0, 4).join(" ")
                  : chat.title,
              messages: [
                ...chat.messages,
                { role: "user", text: input },
              ],
            }
          : chat
      )
    );

    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Answer clearly in 50 to 70 words only. ${input}`,
      });

      const aiText = limitWords(cleanText(response.text));

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "ai", text: aiText },
                ],
              }
            : chat
        )
      );
    } catch (err) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "ai",
                    text: "Something went wrong. Please try again.",
                  },
                ],
              }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        activeChatId,
        loading,
        newChat,
        openChat,
        sendPrompt,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
