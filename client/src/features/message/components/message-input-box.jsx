import React, { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import { useSendMessage } from "../hooks/use-send-message";

export const MessageInputBox = () => {
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { sendMessage, status } = useSendMessage();

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setSelectedImage(file);
                const previewUrl = URL.createObjectURL(file);
                setImagePreview(previewUrl);
            } else {
                alert('Please select an image file only.');
                e.target.value = '';
            }
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() && !selectedImage) return;

        const formData = new FormData();
        if (message.trim()) {
            formData.append('message', message);
        }
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        const res = await sendMessage(formData);

        if (res.ok) {
            setMessage("");
            handleRemoveImage();
        }
    };

    return (
        <div className="w-full p-4 bg-white border-t border-gray-200">
            {imagePreview && (
                <div className="mb-3 relative inline-block">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Selected preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center bg-gray-100 rounded-3xl px-4 py-2">
                <input
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-gray-900"
                    placeholder="Send a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={status === "pending"}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />

                <div className="flex items-center gap-3 ml-2">
                    {!imagePreview ? (
                        <button
                            onClick={handleImageClick}
                            disabled={status === "pending"}
                            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                            <Image size={20} />
                        </button>
                    ) : (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Selected"
                                className="w-8 h-8 object-cover rounded-md cursor-pointer"
                                onClick={handleImageClick}
                            />
                        </div>
                    )}

                    <button
                        onClick={handleSendMessage}
                        disabled={status === "pending" || (!message.trim() && !selectedImage)}
                        className={`transition-colors cursor-pointer ${status === "pending" || (!message.trim() && !selectedImage)
                            ? "opacity-50 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-700"
                            }`}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    );
};