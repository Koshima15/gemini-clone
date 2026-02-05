import React, { useState } from "react";
import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useChat } from "../../context/ChatContext";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { chats, newChat, openChat, activeChatId } = useChat();

  return (
    <div className="sidebar">
      <div className="top">
        <img
          className="menu"
          src={assets.menu_icon}
          alt=""
          onClick={() => setExtended((prev) => !prev)}
        />

        {/* New Chat */}
        <div className="new-chat" onClick={newChat}>
          <img src={assets.plus_icon} alt="" />
          {extended && <p>New Chat</p>}
        </div>

        {/* Recent Chats */}
        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>

            {chats.length === 0 && (
              <p style={{ fontSize: "13px", color: "#888" }}>
                No chats yet
              </p>
            )}

            {chats.map((chat) => (
              <div
                key={chat.id}
                className="recent-entry"
                onClick={() => openChat(chat.id)}
                style={{
                  background:
                    chat.id === activeChatId ? "#e6eaf1" : "transparent",
                }}
              >
                <img src={assets.message_icon} alt="" />
                <p>
                  {chat.title.length > 20
                    ? chat.title.slice(0, 20) + "..."
                    : chat.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended && <p>Help</p>}
        </div>

        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended && <p>Activity</p>}
        </div>

        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
