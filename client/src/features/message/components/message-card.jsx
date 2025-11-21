import React from "react";

export const MessageCard = ({ message, isOwnMessage }) => {
    const isImage = message.message_type === "image";

    return (
        <div className={`flex w-full mb-4 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[50%] px-4 py-2 rounded-2xl relative shadow-sm ${isOwnMessage
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-black rounded-bl-none border border-gray-200"
                    }`}
            >
                {message.text && <p className="text-sm sm:text-base">{message.text}</p>}

                {isImage && message.media_url && (
                    <img
                        src={message.media_url}
                        alt="media"
                        className="mt-2 rounded-lg max-w-full object-cover"
                    />
                )}
            </div>
        </div>
    );
};
