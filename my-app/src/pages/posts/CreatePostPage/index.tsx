import React, { useState } from "react";
import TextPostForm from "../../../components/forms/post/TextPostForm";
import LinkPostForm from "../../../components/forms/post/LinkPostForm";
import MediaPostForm from "../../../components/forms/post/MediaPostForm.tsx";
import BaseButton from "../../../components/buttons/BaseButton.tsx";

const tabs = [
    { key: "text", label: "✏️ Text" },
    { key: "link", label: "🔗 Link" },
    { key: "media", label: "📸 Media" },
];

const CreatePostPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState("text");

    return (
        <div className="p-5 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-[650px] w-full rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-gray-800 bg-white dark:bg-gray-800">
                <div className="p-6 md:p-10 flex flex-col justify-center">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                            Create a Post
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Choose the type of content you want to share
                        </p>
                    </div>

                    <div className="flex justify-center gap-2 mb-6">
                        {tabs.map((tab) => (
                            <BaseButton
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
                                ${
                                    activeTab === tab.key
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}
                            >
                                {tab.label}
                            </BaseButton>
                        ))}
                    </div>

                    {activeTab === "text" && <TextPostForm />}
                    {activeTab === "link" && <LinkPostForm />}
                    {activeTab === "media" && <MediaPostForm />}
                </div>
            </div>
        </div>
    );
};

export default CreatePostPage;