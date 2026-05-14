"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { loginUser } from "@/store/slices/authSlice";
import { isAxiosError } from "axios";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  rememberMe: yup.boolean().default(false),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const useLoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await dispatch(loginUser(data)).unwrap();
      console.log("Login successful:", response);
      
      if (response.data.onboarding_complete === "false" || response.data.onboarding_complete === false) {
        router.push("/setup");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Authentication failed", error);
      
      let errorMessage = "Invalid credentials. Please try again.";
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (isAxiosError(error) && error.response?.data?.error) {
        const apiError = error.response.data.error;
        errorMessage = apiError.message || errorMessage;
      }

      // Set a form-level error to be displayed in the UI
      setError("root", {
        type: "server",
        message: errorMessage,
      });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
};
