import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";

export const FeedCard = ({ feed }) => {
  const postsWithHastags = feed.content.replace(
    /(#\w+)/g,
    "<span class='text-indigo-600'>$1</span>"
  );

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      <Link className="inline-flex items-center gap-3 cursor-pointer">
        <img
          src={feed?.user.profile_picture}
          className="w-10 h-10 rounded-full shadow"
        />
        <div>
          <div className="flex items-center space-x-1">
            <span>{feed?.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-sm text-gray-500">
            @{feed?.user.username} ● {moment(feed.createdAt).fromNow()}
          </div>
        </div>
      </Link>

      {feed.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postsWithHastags }}
        />
      )}

      <div className="grid grid-cols-2 gap-2">
        {feed.image_urls.map((img, index) => (
          <img
            src={img}
            key={index}
            className={` w-full h-48  object-cover rounded-lg ${
              feed.image_urls.length === 1 && "col-span-2 h-auto"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
        <div className="flex items-center gap-1 cursor-pointer">
          <Heart className={`w-4 h-4 cursor-pointer`} />
          <span>10</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{12}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          <span>{7}</span>
        </div>
      </div>
    </div>
  );
};
