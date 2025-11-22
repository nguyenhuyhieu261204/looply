import { Image, X } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export const CreateFeedPage = () => {
  const [content, setContent] = React.useState("");
  const [medias, setMedias] = React.useState([]);

  console.log("medias", medias);

  const { user } = useSelector((state) => state.auth);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);

    if (Array.isArray(medias) && medias.length + files.length > 5) {
      toast.error("You can only upload 5 files at a time");
      return;
    }

    const validFiles = [];

    files.forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        toast.error(`File type ${file.type} is not supported`);
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast.error(`File size ${file.size} is too large`);
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      validFiles.push({
        id: `file_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        file,
        type: isImage ? "image" : "video",
        src: blobUrl,
      });
    });

    if (validFiles.length + medias.length > 5) {
      toast.error("You can only upload 5 files at a time");
      return;
    }

    if (validFiles.length > 0) {
      setMedias([...medias, ...validFiles]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Post
          </h1>
          <p className="text-slate-600">Share your thoughts with the World</p>
        </div>
        <div className="max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={user.profilePicture}
              alt=""
              className="w-12 h-12 rounded-full shadow"
            />
            <div>
              <h1 className="font-semibold">{user.fullName}</h1>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          <textarea
            className="w-full resize-none max-h-20 mt-4 text-sm  outline-none 
        placeholder-gray-400"
            placeholder="What's happening ?"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />

          {medias.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {medias
                .sort((a, b) => (a.type === "video") - (b.type === "video"))
                .map((media, i) => {
                  if (media.type === "image") {
                    return (
                      <div key={i} className="h-20 relative group">
                        <img src={media.src} className="h-20 rounded-md" />
                        <div
                          onClick={() => {
                            setMedias(medias.filter((_, index) => index !== i));
                            URL.revokeObjectURL(media.src);
                          }}
                          className="absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer"
                        >
                          <X className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    );
                  } else if (media.type === "video") {
                    return (
                      <div className="relative group">
                        <video
                          src={media.src}
                          className="max-h-40 aspect-video object-cover"
                          controls
                        />
                        <div
                          onClick={() => {
                            setMedias(medias.filter((_, index) => index !== i));
                            URL.revokeObjectURL(media.src);
                          }}
                          className="absolute hidden group-hover:flex justify-center items-center top-1 right-1 bg-black/40 rounded-md cursor-pointer"
                        >
                          <X className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-300">
            <label
              htmlFor="images"
              className="flex items-center gap-2 text-sm text-gray-500
            hover:text-gray-700 transition cursor-pointer"
            >
              <Image className="size-6" />
            </label>
            <input
              type="file"
              id="images"
              accept="image/*,video/*"
              hidden
              multiple
              onChange={(e) => handleMediaUpload(e)}
            />
            <button
              className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 
             hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white 
             font-medium px-8 py-2 rounded-md cursor-pointer"
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
