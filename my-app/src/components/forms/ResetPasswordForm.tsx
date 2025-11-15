import { Form, Input, Button, type FormProps, message, Card, Typography, Flex } from "antd";
import { useResetPasswordMutation } from "../../services/userService.ts";
import { useNavigate, useParams } from "react-router";
import type { IResetPasswordConfirm } from "../../types/users/IResetPasswordConfirm.ts";

const ResetPasswordForm: React.FC = () => {
    const [form] = Form.useForm();
    const [reset, { isLoading }] = useResetPasswordMutation();
    const navigate = useNavigate();
    const { uid, token } = useParams<{ uid: string; token: string }>();
    const onFinish: FormProps<IResetPasswordConfirm>["onFinish"] = async (values) => {
        if (!uid || !token) {
            message.error("Невірне або неповне посилання для скидання паролю");
            return;
        }
        try {
            const payload = {
                uid,
                token,
                new_password: values.new_password,
            };
            await reset(payload).unwrap();
            message.success("Пароль успішно змінено. Тепер ви можете увійти.");
            navigate("/login");
        } catch (err: any) {
            console.error(err);
            const detail = err?.data?.detail;
            const tokenError = err?.data?.token?.[0];
            const uidError = err?.data?.uid?.[0];
            message.error(detail || tokenError || uidError || "Помилка при зміні паролю");
        }
    };
    return (
        <Flex align="center" justify="center" style={{ minHeight: "80vh" }}>
            <Card
                title={
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Встановіть новий пароль
                    </Typography.Title>
                }
                style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Новий пароль"
                        name="new_password"
                        rules={[{ required: true, message: "Введіть новий пароль" }]}
                    >
                        <Input.Password placeholder="********" />
                    </Form.Item>
                    <Form.Item
                        label="Підтвердження паролю"
                        name="confirm_password"
                        dependencies={["new_password"]}
                        rules={[
                            { required: true, message: "Підтвердіть пароль" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("new_password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Паролі не співпадають"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="********" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            block
                            size="large"
                        >
                            Змінити пароль
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    );
};
export default ResetPasswordForm;