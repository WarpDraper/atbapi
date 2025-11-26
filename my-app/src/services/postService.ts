import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utils/createBaseQuery";
import { serialize } from "object-to-formdata";
import type { IPostItem } from "../types/posts/IPostItem.ts";
import type { IPostCreate } from "../types/posts/IPostCreate.ts";

export const postService = createApi({
    reducerPath: 'postService',
    baseQuery: createBaseQuery('posts'),
    tagTypes: ['Posts'],

    endpoints: (builder) => ({
        getPosts: builder.query<IPostItem[], void>({
            query: () => ({
                url: '',
                method: 'GET',
            }),
            providesTags: ['Posts'],
        }),

        createPost: builder.mutation<void, IPostCreate>({
            query: (data) => {
                const formData = serialize(data, { indices: true });

                return {
                    url: '',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Posts'],
        }),
    }),
});

export const {
    useGetPostsQuery,
    useCreatePostMutation,
} = postService;