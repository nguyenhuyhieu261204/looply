import { useCallback, useState } from "react";

export const useSendMessage = () => {
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async (payload) => {
        if (status === "pending") return;

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setStatus("success");
        } catch (error) {
            setStatus("error");
            setError(error.message || "Failed to send message");
        }
    }, [status]);

    return {
        sendMessage,
        status,
        error,
    }

}