import { dummyConversationsData } from "@/assets/assets";
import { ConversationCard } from "../components/conversation-card";

export const ConversationsPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Conversations</h1>

            <div className="grid gap-2 
                      grid-cols-1 
                      sm:grid-cols-1 
                      md:grid-cols-2 
                      lg:grid-cols-2">
                {dummyConversationsData.map((conversation) => (
                    <ConversationCard
                        key={conversation._id}
                        conversation={conversation}
                    />
                ))}
            </div>
        </div>
    );
};
