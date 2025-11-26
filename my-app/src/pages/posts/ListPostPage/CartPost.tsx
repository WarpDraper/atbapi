import React from "react";
import type { IPostItem } from "../../../types/posts/IPostItem.ts";
import { Link } from "react-router";
import {APP_ENV} from "../../../env/index.ts";
import StylishVideoPlayer from "../../../components/media/StylishVideoPlayer.tsx";

interface CardPostProps {
    post: IPostItem;
}

const CardPost: React.FC<CardPostProps> = ({ post }) => {
    const isExternalLink = post.video_url?.startsWith("http");

    const imageSrc = post.image ? APP_ENV.IMAGE_BASE_URL + post.image : null;
    const videoSrc = post.video ? APP_ENV.VIDEO_BASE_URL + post.video : null;

    return (
        <div className="
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900
            rounded-md p-4 mb-4
            hover:bg-gray-50 dark:hover:bg-gray-800
            transition-colors
        ">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                    u/{post.user_name}
                </span>
                {" • "}
                <span>{post.topic_name}</span>
                {" • "}
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            <Link
                to={`/post/${post.id}`}
                className="
                  block text-lg font-semibold text-gray-900 dark:text-gray-100
                  hover:text-blue-600 dark:hover:text-blue-400
                  transition-colors mb-2
                "
            >
                {post.title}
            </Link>

            {post.body && (
                <p className="text-gray-700 dark:text-gray-300 mb-2">{post.body}</p>
            )}

            {imageSrc && (
                <img
                    src={imageSrc}
                    alt={post.title}
                    className="mb-2 max-w-full rounded"
                />
            )}

            {videoSrc && (
                <StylishVideoPlayer
                    src={videoSrc}
                />
            )}

            {post.video_url && (
                <>
                    {isExternalLink ? (
                        <a
                            href={post.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Переглянути відео
                        </a>
                    ) : (
                        <Link
                            to={post.video_url}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Переглянути відео
                        </Link>
                    )}
                </>
            )}
        </div>
    );
};

export default CardPost;