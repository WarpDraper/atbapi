export interface IPostCreate {
    title: string;
    body?: string;
    image?: File | null;
    video?: File | null;
    video_url?: string;
    user_id: number;
    topic_id: number;
}