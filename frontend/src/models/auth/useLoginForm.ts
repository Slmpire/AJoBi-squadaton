"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export const loginSchema = yup.object().shape({
  identifier: yup
    .string()
    .required("Phone number or email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  rememberMe: yup.boolean().default(false),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const useLoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // --- API INTEGRATION READY ---
      // Uncomment the lines below to use the real API instead of the simulation
      
      // const response = await authService.login(data);
      // console.log("Login successful:", response);
      // localStorage.setItem("token", response.token);

      // --- SIMULATION (Remove when backend is ready) ---
      console.log("Submitting Login Payload:", data);
      await new Promise((resolve) => setTimeout(resolve, 800));
      // ----------------------------------------------

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Authentication failed", error);
      
      // Set a form-level error to be displayed in the UI
      setError("root", {
        type: "server",
        message: error?.message || "Invalid credentials. Please try again.",
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
