import { dummyPostsData } from "@/assets/assets";
import { StoriesBar } from "../../story/components/stories-bar";
import { FeedCard } from "../components/feed-card";

export const FeedPage = () => {
  return (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      <div>
        <StoriesBar />
        <div className="p-4 space-y-6">
          {dummyPostsData.map((post) => (
            <FeedCard key={post._id} feed={post} />
          ))}
        </div>
      </div>
    </div>
  );
};
