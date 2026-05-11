"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";


export const registrationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Name must be at least 3 characters"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[+]?[0-9]{10,15}$/, "Invalid phone number format"),
  email: yup
    .string()
    .email("Must be a valid email address")
    .nullable()
    .defined()
    .transform((value) => (value === "" ? null : value)),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
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
      // --- API INTEGRATION READY ---
      // Uncomment the lines below to use the real API instead of the simulation
      
      // const response = await authService.register(data);
      // console.log("Registration successful:", response);
      // localStorage.setItem("token", response.token);

      // --- SIMULATION (Remove when backend is ready) ---
      console.log("Submitting Registration Payload:", data);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      // ----------------------------------------------

      router.push("/setup");
    } catch (error: any) {
      console.error("Registration process aborted", error);
      
      // Set a form-level error to be displayed in the UI
      setError("root", {
        type: "server",
        message: error?.message || "Registration failed. Please try again.",
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
