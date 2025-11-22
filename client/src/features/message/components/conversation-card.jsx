import { dummyUsersData } from "@/assets/assets";
import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ConversationCard = ({ conversation }) => {

    const navigate = useNavigate();
    const currentUserId = 'user_2zdFoZib5lNr614LgkONdD8WG32';
    const targetUserId = conversation.messages[0].from_user_id === currentUserId ? conversation.messages[0].to_user_id : conversation.messages[0].from_user_id;
    const targetUser = dummyUsersData.find(user => user._id === targetUserId);
    console.log(conversation);
    console.log("Target userID", targetUserId);

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    return (
        <div className="bg-background-light p-6 rounded-lg shadow-sm w-full max-w-xl flex items-start justify-between space-x-6">
            <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-stone-500 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-2xl font-medium">S</span>
                </div>
                <div>
                    <div className="flex items-baseline space-x-2">
                        <p className="text-lg font-semibold text-slate-800">{targetUser.full_name}</p>
                    </div>
                    <p className="text-sm text-slate-500">@{targetUser.username}</p>
                    <p className="mt-2 text-slate-700">{lastMessage.text}</p>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                <button className="w-10 h-10 flex items-center justify-center bg-slate-200 cursor-pointer hover:bg-slate-300 rounded-md transition-colors"
                    onClick={() => {
                        navigate(`/conversation/${conversation._id}`);
                    }}>
                    <MessageSquare />
                    <span className="sr-only">Message User</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-slate-200 cursor-pointer hover:bg-slate-300 rounded-md transition-colors">
                    <Eye />
                    <span className="sr-only">View Profile</span>
                </button>
            </div>
        </div>
    )
}