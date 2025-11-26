import { useState } from "react";
import { useNavigate } from "react-router";
import InputField from "../../inputs/InputField";
import SelectField from "../../inputs/SelectField";
import BaseButton from "../../buttons/BaseButton";
import { useCreatePostMutation } from "../../../services/postService";
import { useGetTopicsQuery } from "../../../services/topicService";
import type { IPostCreate } from "../../../types/posts/IPostCreate";

import { useSelector } from "react-redux";
import type { RootState } from "../../../store"; 

const LinkPostForm: React.FC = () => {
    const navigate = useNavigate();
    const [createPost, { isLoading, error }] = useCreatePostMutation();
    const { data: topics = [] } = useGetTopicsQuery();


    const userId = useSelector((state: RootState) => state.auth.user?.id);

    const [formValues, setFormValues] = useState<IPostCreate>({
        title: "",
        video_url: "",
        user_id: userId || 0,
        topic_id: 0,
    });

    const [errors, setErrors] = useState<string[]>([]);

    const validationChange = (isValid: boolean, fieldKey: string) => {
        if (isValid) setErrors((prev) => prev.filter((f) => f !== fieldKey));
        else if (!errors.includes(fieldKey)) setErrors((prev) => [...prev, fieldKey]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createPost(formValues).unwrap();
            navigate("/");
        } catch (err) {
            console.error("Помилка при створенні посту:", err);
        }

    };

    const topicOptions = topics.map((t) => ({ value: t.id, label: t.name }));

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md dark:bg-gray-800 dark:text-red-400">
                    Data error
                </div>
            )}

            <InputField
                label="Title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                onValidationChange={validationChange}
                rules={[{ rule: "required", message: "Title is required" }]}
            />

            <InputField
                label="Link"
                name="video_url"
                value={formValues.video_url}
                onChange={handleChange}
                onValidationChange={validationChange}
                rules={[{ rule: "required", message: "Link is required" }]}
            />

            <SelectField
                label="Topic"
                name="topic_id"
                value={formValues.topic_id}
                options={topicOptions}
                onChange={handleChange}
                onValidationChange={validationChange}
                rules={[{ rule: "required", message: "Topic is required" }]}
            />

            <BaseButton
                type="submit"
                className="w-full rounded-xl !bg-purple-500 dark:!bg-gray-900 text-white font-medium py-2"
            >
                {isLoading ? "Creating..." : "Create"}
            </BaseButton>
        </form>
    );
};

export default LinkPostForm;