"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { isAxiosError } from "axios";


export const registrationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^(\+234|0)[789][01]\d{8}$/, "Must be a valid Nigerian phone number"),
  email: yup
    .string()
    .email("Must be a valid email address")
    .nullable()
    .defined()
    .transform((value) => (value === "" ? null : value)),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export type RegistrationFormValues = yup.InferType<typeof registrationSchema>;

export const useRegistrationForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: yupResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      const response = await authService.register(data);
      console.log("Registration successful:", response);
      
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      router.push("/setup");
    } catch (error: any) {
      console.error("Registration process aborted", error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (isAxiosError(error) && error.response?.data?.error) {
        const apiError = error.response.data.error;
        errorMessage = apiError.message || errorMessage;
        
        if (apiError.code === "PHONE_EXISTS") {
          setError("phoneNumber", {
            type: "server",
            message: errorMessage,
          });
          return;
        } else if (apiError.code === "VALIDATION_ERROR") {
          // If the message specifically mentions phone number
          if (errorMessage.toLowerCase().includes("phone")) {
             setError("phoneNumber", {
               type: "server",
               message: errorMessage,
             });
             return;
          }
        }
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
