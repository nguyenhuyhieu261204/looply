import { useState } from 'react';
import { Tab, Tabs } from "@components/tabs.jsx";
import { Pencil, MapPin, CalendarDays, X, Camera } from "lucide-react";
import Verified from "../../../assets/verified.svg";
import { dummyPostsData, dummyUserData } from "@assets/assets.js";
import { timeAgo } from "@utils/time.js";
import { FeedCard } from "@features/feed/components/feed-card.jsx";
import { useModal } from '@/hooks/use-modal';
import { Modal } from '@components/modal/modal';
import { ModalBody } from '@components/modal/modal-body';
import { ModalFooter } from '@components/modal/modal-footer';

export const Profile = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const currentUser = dummyUserData;
    const feeds = dummyPostsData;

    const { isOpen, open, close } = useModal();

    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase();
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverPhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeProfilePicture = () => {
        setProfilePicturePreview(null);
    };

    const removeCoverPhoto = () => {
        setCoverPhotoPreview(null);
    };

    const handleCloseModal = () => {
        setProfilePicturePreview(null);
        setCoverPhotoPreview(null);
        close();
    };

    const displayProfilePicture = profilePicturePreview || currentUser.profile_picture;
    const displayCoverPhoto = coverPhotoPreview || currentUser.cover_photo;

    return (
        <div className="h-full overflow-y-auto">
            <div className="w-full max-w-2xl mx-auto p-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div
                        className={`h-40 relative bg-center bg-cover ${
                            !currentUser.cover_photo
                                ? "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"
                                : ""
                        }`}
                        style={
                            currentUser.cover_photo
                                ? { backgroundImage: `url(${currentUser.cover_photo})` }
                                : {}
                        }
                    />

                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        <div className="relative flex justify-between items-start -mt-16">
                            {/* Avatar */}
                            <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-teal-500 to-teal-700">
                                {currentUser.profile_picture ? (
                                    <img
                                        src={currentUser.profile_picture}
                                        alt={currentUser.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white text-4xl font-medium">
                                        {getInitials(currentUser.full_name)}
                                    </span>
                                )}
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={open}
                                className="mt-16 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
                            >
                                <Pencil size={16} />
                                Edit Profile
                            </button>
                        </div>

                        {/* User Details */}
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-gray-900">{currentUser.full_name}</h1>
                                <img src={Verified} alt="Verified" title="Verified Account" className="w-5 h-5" />
                            </div>
                            <p className="text-gray-500 font-medium">@{currentUser.username}</p>

                            {currentUser.bio && (
                                <p className="text-gray-700 leading-relaxed">{currentUser.bio}</p>
                            )}

                            {/* Location & Join Date */}
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span>{currentUser.location || "Add location"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays size={16} className="text-gray-400" />
                                    <span>Joined {timeAgo(currentUser.createdAt, 'en')}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <div className="font-bold text-gray-900 text-lg">{feeds.length}</div>
                                    <div className="text-gray-500 text-sm">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-gray-900 text-lg">{currentUser.followers.length}</div>
                                    <div className="text-gray-500 text-sm">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-gray-900 text-lg">{currentUser.following.length}</div>
                                    <div className="text-gray-500 text-sm">Following</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="border-t border-gray-100 px-1">
                        <Tabs defaultActiveKey="posts" onTabChange={handleTabChange} scrollable={false}>
                            <Tab tabKey="posts" label="Posts">
                                <div className="max-h-[600px] overflow-y-auto py-4">
                                    {feeds.length > 0 ? (
                                        <div className="space-y-4 px-2">
                                            {feeds.map((feedItem) => (
                                                <FeedCard key={feedItem.id} feed={feedItem} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center">
                                            <div className="text-gray-400 mb-2">📝</div>
                                            <p className="text-gray-500 font-medium">No posts yet</p>
                                            <p className="text-gray-400 text-sm mt-1">Start sharing your thoughts!</p>
                                        </div>
                                    )}
                                </div>
                            </Tab>
                            <Tab tabKey="medias" label="Medias">
                                <div className="max-h-[600px] overflow-y-auto py-4">
                                    <div className="py-12 text-center">
                                        <div className="text-gray-400 mb-2">🖼️</div>
                                        <p className="text-gray-500 font-medium">No media files yet</p>
                                        <p className="text-gray-400 text-sm mt-1">Your photos and videos will appear here</p>
                                    </div>
                                </div>
                            </Tab>
                            <Tab tabKey="likes" label="Likes">
                                <div className="max-h-[600px] overflow-y-auto py-4">
                                    <div className="py-12 text-center">
                                        <div className="text-gray-400 mb-2">❤️</div>
                                        <p className="text-gray-500 font-medium">No liked posts yet</p>
                                        <p className="text-gray-400 text-sm mt-1">Posts you like will show up here</p>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={isOpen} onClose={handleCloseModal} title="Edit Profile" size="lg">
                <ModalBody>
                    <div className="space-y-6">
                        {/* Cover Photo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Cover Photo
                            </label>
                            <div className="relative">
                                <div
                                    className={`h-40 rounded-xl relative bg-center bg-cover flex items-center justify-center ${
                                        !displayCoverPhoto
                                            ? "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"
                                            : ""
                                    }`}
                                    style={
                                        displayCoverPhoto
                                            ? { backgroundImage: `url(${displayCoverPhoto})` }
                                            : {}
                                    }
                                >
                                    {/* Nút X xóa cover photo */}
                                    {coverPhotoPreview && (
                                        <button
                                            onClick={removeCoverPhoto}
                                            className="absolute top-2 left-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors z-10"
                                        >
                                            <X size={18} className="text-white" />
                                        </button>
                                    )}

                                    {/* Upload overlay */}
                                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-black/30 hover:bg-black/40 transition-colors rounded-xl">
                                        <Camera size={24} className="text-white mb-2" />
                                        <span className="text-white text-sm font-medium">
                                            {displayCoverPhoto ? 'Change cover photo' : 'Upload cover photo'}
                                        </span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleCoverPhotoChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Profile Picture */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Profile Picture
                            </label>
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-28 h-28 rounded-full border-4 border-white flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-teal-500 to-teal-700">
                                        {displayProfilePicture ? (
                                            <img
                                                src={displayProfilePicture}
                                                alt={currentUser.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-white text-4xl font-medium">
                                                {getInitials(currentUser.full_name)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Nút X xóa profile picture */}
                                    {profilePicturePreview && (
                                        <button
                                            onClick={removeProfilePicture}
                                            className="absolute -top-1 -left-1 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors z-10"
                                        >
                                            <X size={16} className="text-white" />
                                        </button>
                                    )}

                                    {/* Camera overlay */}
                                    <label className="absolute inset-0 rounded-full flex items-center justify-center cursor-pointer bg-black/30 hover:bg-black/40 transition-colors">
                                        <Camera size={24} className="text-white" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                        />
                                    </label>
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">
                                        Click on the avatar to upload a new profile picture.
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        PNG, JPG up to 5MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    defaultValue={currentUser.full_name}
                                    type="text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    defaultValue={currentUser.username}
                                    type="text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                                    rows="3"
                                    defaultValue={currentUser.bio}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    placeholder="Enter your location"
                                    defaultValue={currentUser.location}
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button
                        onClick={handleCloseModal}
                        className="px-6 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors border-2 border-solid border-gray-300 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCloseModal}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-700 to-pink-500 text-white font-medium rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        Save Changes
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
};