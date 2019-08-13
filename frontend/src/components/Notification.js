import React from "react";

const Notification = ({ message }) => {
  if (message.type === "hidden") {
    return null;
  }

  const className = `message message-${message.type}`;
  return <div className={className}>{message.content}</div>;
};

export default Notification;
