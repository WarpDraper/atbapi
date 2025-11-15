import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { Upload, Modal, Slider, Button } from "antd";
import { InboxOutlined, RotateLeftOutlined, RotateRightOutlined } from "@ant-design/icons";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { useRegisterMutation } from "../../services/userService.ts";
import { setTokens } from "../../store/authSlice.ts";
import InputField from "../inputs/InputField.tsx";
import BaseButton from "../buttons/BaseButton.tsx";
import type { IUserRegister } from "../../types/users/IUserRegister.ts";
import type { UploadFile } from "antd/es/upload/interface";

const { Dragger } = Upload;

async function getCroppedImg(
    imageSrc: string,
    croppedAreaPixels: Area,
    rotation = 0
): Promise<Blob> {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Could not get canvas context");
    }

    const TODEGREES = 180 / Math.PI;
    const TOAADIANS = Math.PI / 180;
    const rotatedWidth =
        Math.abs(Math.cos(rotation * TOAADIANS)) * image.width +
        Math.abs(Math.sin(rotation * TOAADIANS)) * image.height;
    const rotatedHeight =
        Math.abs(Math.sin(rotation * TOAADIANS)) * image.width +
        Math.abs(Math.cos(rotation * TOAADIANS)) * image.height;

    canvas.width = rotatedWidth;
    canvas.height = rotatedHeight;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation * TOAADIANS);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");
    if (!croppedCtx) {
        throw new Error("Could not get cropped canvas context");
    }

    croppedCanvas.width = croppedAreaPixels.width;
    croppedCanvas.height = croppedAreaPixels.height;

    croppedCtx.drawImage(
        canvas,
        croppedAreaPixels.x - (canvas.width - image.width) / 2,
        croppedAreaPixels.y - (canvas.height - image.height) / 2
    );

    return new Promise((resolve, reject) => {
        croppedCanvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error("Failed to create blob"));
            }
        }, "image/jpeg");
    });
}

const RegisterForm: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const [register, { isLoading }] = useRegisterMutation();
    const [formValues, setFormValues] = useState<IUserRegister>({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        image: null,
        recaptcha_token: undefined,
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageError, setImageError] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const validationChange = (isValid: boolean, fieldKey: string) => {
        if (isValid && errors.includes(fieldKey)) {
            setErrors(errors.filter((x) => x !== fieldKey));
        } else if (!isValid && !errors.includes(fieldKey)) {
            setErrors((state) => [...state, fieldKey]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (fileList.length === 0 || !fileList[0]?.originFileObj) {
            setImageError(true);
            return;
        }

        if (!executeRecaptcha) return;
        const token = await executeRecaptcha("register");

        const payload: IUserRegister = {
            ...formValues,
            image: fileList[0].originFileObj,
            recaptcha_token: token,
        };

        try {
            const result = await register(payload).unwrap();
            dispatch(setTokens(result));
            navigate("/");
        } catch (err: any) {
            console.error(err?.data?.errors);
        }
    };

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleModalCancel = () => {
        setModalOpen(false);
        setImageSrc(null);
        setOriginalFile(null);
        setZoom(1);
        setRotation(0);
    };

    const handleModalSave = async () => {
        if (!imageSrc || !croppedAreaPixels || !originalFile) return;

        try {
            const croppedImageBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            );

            const croppedFile = new File([croppedImageBlob], originalFile.name, {
                type: croppedImageBlob.type,
                lastModified: Date.now(),
            });

            const croppedUploadFile: UploadFile = {
                uid: croppedFile.name + Date.now(),
                name: croppedFile.name,
                originFileObj: croppedFile,
                thumbUrl: URL.createObjectURL(croppedFile),
                status: "done",
            };

            setFileList([croppedUploadFile]);
            setImageError(false);
            handleModalCancel();
        } catch (e) {
            console.error("Помилка обрізання:", e);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="First name"
                        name="first_name"
                        placeholder="Pedro"
                        value={formValues.first_name}
                        onChange={handleChange}
                        onValidationChange={validationChange}
                        rules={[{ rule: "required", message: "First name is required" }]}
                    />

                    <InputField
                        label="Last name"
                        name="last_name"
                        placeholder="Timchuk"
                        value={formValues.last_name}
                        onChange={handleChange}
                        onValidationChange={validationChange}
                        rules={[{ rule: "required", message: "Last name is required" }]}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Username"
                        name="username"
                        placeholder="pedro"
                        value={formValues.username}
                        onChange={handleChange}
                        onValidationChange={validationChange}
                        rules={[{ rule: "required", message: "Username is required" }]}
                    />

                    <InputField
                        label="Email"
                        name="email"
                        placeholder="pedro@example.com"
                        value={formValues.email}
                        onChange={handleChange}
                        onValidationChange={validationChange}
                        rules={[
                            { rule: "required", message: "Email is required" },
                            { rule: "regexp", value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', message: "Email is invalid" },
                        ]}
                    />
                </div>
                <InputField
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="********"
                    value={formValues.password}
                    onChange={handleChange}
                    onValidationChange={validationChange}
                    rules={[{ rule: "required", message: "Password is required" }]}
                />

                <div className="w-full text-center">
                    <Dragger
                        name="image"
                        multiple={false}
                        listType="picture"
                        fileList={fileList}
                        beforeUpload={(file) => {
                            setOriginalFile(file);
                            setImageSrc(URL.createObjectURL(file));
                            setModalOpen(true);
                            return false;
                        }}
                        onRemove={() => {
                            setFileList([]);
                            setImageError(true);
                        }}
                        className="bg-white dark:bg-gray-700"
                    >
                        <p className="ant-upload-drag-icon text-gray-700 dark:text-gray-300">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text text-gray-900 dark:text-white">
                            Натисні... або перетягніть файл у цю зону
                        </p>
                        <p className="ant-upload-hint text-gray-500 dark:text-gray-400">
                            Виберіть зображення, яке потім можна буде обрізати.
                        </p>
                    </Dragger>
                    {imageError && <p className="text-red-500 text-sm mt-1">Image is required</p>}
                </div>

                <BaseButton
                    type="submit"
                    className="w-full rounded-xl !bg-blue-600 hover:!bg-blue-700 dark:!bg-blue-500 dark:hover:!bg-blue-600 text-white font-medium py-2"
                >
                    {isLoading ? "Loading..." : "Register"}
                </BaseButton>
            </form>

            <Modal
                title="Редагувати зображення"
                open={modalOpen}
                onCancel={handleModalCancel}
                onOk={handleModalSave}
                okText="Зберегти"
                cancelText="Скасувати"
                width={700}
            >
                <div style={{ height: 400, position: "relative" }}>
                    <Cropper
                        image={imageSrc || ""}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className="space-y-4 mt-4">
                    <div>
                        <p>Зум</p>
                        <Slider
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={setZoom}
                        />
                    </div>
                    <div>
                        <p>Поворот</p>
                        <div className="flex items-center gap-4">
                            <Button onClick={() => setRotation(r => r - 90)} icon={<RotateLeftOutlined />} />
                            <Slider
                                min={-180}
                                max={180}
                                step={1}
                                value={rotation}
                                onChange={setRotation}
                            />
                            <Button onClick={() => setRotation(r => r + 90)} icon={<RotateRightOutlined />} />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RegisterForm;