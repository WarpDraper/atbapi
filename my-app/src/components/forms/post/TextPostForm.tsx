import { useState } from "react";
import { useNavigate } from "react-router";
import InputField from "../../inputs/InputField.tsx";
import BaseButton from "../../buttons/BaseButton.tsx";
import type {IPostCreate} from "../../../types/posts/IPostCreate.ts";
import {useCreatePostMutation} from "../../../services/postService.ts";
import {useGetTopicsQuery} from "../../../services/topicService.ts";
import SelectField from "../../inputs/SelectField.tsx";
import TextareaField from "../../inputs/TextareaField.tsx";

const TextPostForm: React.FC = () => {
    const navigate = useNavigate();
    const { data: topics = [] } = useGetTopicsQuery();

    const [createPost, { isLoading, error : createError }] = useCreatePostMutation();

    const [formValues, setFormValues] = useState<IPostCreate>({
        title: "",
        body: "",
        user_id: 14,
        topic_id: 0,
    });

    const [errors, setErrors] = useState<string[]>([]);

    const validationChange = (isValid: boolean, fieldKey: string) => {
        if (isValid) {
            setErrors((prev) => prev.filter((x) => x !== fieldKey));
        } else if (!errors.includes(fieldKey)) {
            setErrors((prev) => [...prev, fieldKey]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await createPost(formValues).unwrap();
        navigate("/");
    };

    const topicOptions = topics.map((t) => ({ value: t.id, label: t.name }));

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {createError &&
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                     role="alert">
                    <span className="font-medium">Data error</span>
                </div>
            }

            <InputField
                label="Title"
                name="title"
                placeholder="Lol"
                value={formValues.title}
                onChange={handleChange}
                onValidationChange={validationChange}
                rules={[{ rule: "required", message: "Title is required" }]}
            />

            <TextareaField
                label="Body"
                name="body"
                value={formValues.body}
                onChange={handleChange}
                rules={[{ rule: "required", message: "Text is required" }]}
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

export default TextPostForm;