import { MessageCard } from "../components/message-card";
import { MessageInputBox } from "../components/message-input-box";
import { Loading } from "@/components/loading";
import { useConversation } from "../hooks/use-conversation";

export const ConversationPage = () => {
    const currentUserId = 'user_2zdFoZib5lNr614LgkONdD8WG32';

    const { conversation, sender, loading, error } = useConversation();

    if (loading) return <Loading />;
    if (error)
        return (
            <div className="flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );

    return (
        <>
            <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center space-x-4 max-w-4xl mx-auto">
                    <div className="relative">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center font-bold text-white text-xl">
                            {sender?.username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-gray-900">{sender?.full_name}</h1>
                        <p className="text-sm text-gray-500">@{sender?.username}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col h-screen w-4/5 mx-auto">
                {/* Messages */}
                <div className="flex flex-col flex-1">
                    <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
                        {conversation.messages.length > 0 ? (
                            conversation.messages.map((message) => {
                                const isOwnMessage = message.from_user_id === currentUserId;
                                return (
                                    <MessageCard
                                        key={message._id}
                                        message={message}
                                        isOwnMessage={isOwnMessage}
                                    />
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 mt-4">No messages</p>
                        )}
                    </div>
                </div>

                {/* Input */}
                <div className="flex-shrink-0">
                    <MessageInputBox />
                </div>
            </div>
        </>
    );
};
