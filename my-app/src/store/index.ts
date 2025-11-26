import {configureStore} from "@reduxjs/toolkit";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {userService} from "../services/userService";
import authSlice from "./authSlice.ts";
import {topicService} from "../services/topicService.ts";
import {postService} from "../services/postService.ts";

export const store = configureStore({
    reducer: {
        [userService.reducerPath]: userService.reducer,
        [topicService.reducerPath]: topicService.reducer,
        [postService.reducerPath]: postService.reducer,
        auth: authSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(userService.middleware)
        .concat(topicService.middleware)
        .concat(postService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;