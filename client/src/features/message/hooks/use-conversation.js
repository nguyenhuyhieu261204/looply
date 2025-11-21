import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { dummyConversationsData, dummyUsersData } from "@/assets/assets";

export const useConversation = () => {
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const conversationId = useLocation().pathname.split("/")[2];

    useEffect(() => {
        setLoading(true);
        setError(null);

        try {
            const foundConversation = dummyConversationsData.find(
                (c) => c._id === conversationId
            );

            if (!foundConversation) {
                throw new Error("Conversation not found");
            }

            setConversation(foundConversation);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [conversationId]);

    const senderId = conversation?.messages[0]?.from_user_id;
    const sender = dummyUsersData.find((user) => user._id === senderId);

    return { conversation, sender, loading, error };
};
