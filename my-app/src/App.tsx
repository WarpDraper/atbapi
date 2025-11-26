import './App.css'
import UsersListPage from "./pages/users/UsersListPage";
import {Route, Routes} from "react-router";
import UserRegisterPage from "./pages/users/UserRegisterPage";
import UserLoginPage from "./pages/users/UserLoginPage";
import ForgotPasswordPage from './pages/users/UserResetPasswordPAge/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/users/UserResetPasswordPAge/ResetPasswordPage.tsx';
import SuccessPage from './pages/users/UserResetPasswordPAge/SuccessPage.tsx';
import UserLayout from "./layout/UserLayout.tsx";
import NotFoundPage from "./pages/additional/NotFoundPage.tsx";
import CreatePostPage from "./pages/posts/CreatePostPage";
import ListPostPage from "./pages/posts/ListPostPage";


function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<UserLayout />}>
                    <Route index element={<ListPostPage />}/>
                    <Route path={"register"} element={<UserRegisterPage />}/>
                    <Route path={"login"} element={<UserLoginPage />}/>
                    <Route path={"forgot-password"} element={<ForgotPasswordPage />} />
                    <Route path="reset-password/:uid/:token" element={<ResetPasswordPage />} />
                    <Route path={"success-confirm"} element={<SuccessPage />} />

                    <Route path="/posts">
                        <Route path={"create"} element={<CreatePostPage />}></Route>
                    </Route>

                    <Route path={"users"}>
                        <Route index element={<UsersListPage />}></Route>
                    </Route>

                </Route>

                <Route path="*" element={<NotFoundPage/>} />
            </Routes>

        </>
    )
}

export default App