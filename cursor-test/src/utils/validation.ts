/**
 * Validation Schemas using Zod
 */

import { z } from "zod";
import { UserRole } from "../types/enums";

// Email validation
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

// Password validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

// Phone validation (optional)
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
  .optional()
  .or(z.literal(""));

// Sign up schema
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    phone: phoneSchema,
    role: z.nativeEnum(UserRole, {
      message: "Please select a role",
    }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Sign in schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  email: emailSchema,
});

// Update password schema
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Onboarding schema (role-specific)
export const onboardingSchema = z.object({
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  // Provider-specific fields
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  bio: z.string().max(500).optional(),
});

// Health Profile schemas
export const healthProfileSchema = z.object({
  bloodType: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  allergies: z.array(z.string()).default([]),
  emergencyContact: z
    .object({
      name: z.string().min(1, "Name is required"),
      relationship: z.string().min(1, "Relationship is required"),
      phone: z.string().min(1, "Phone is required"),
      email: z.string().email().optional(),
      address: z.string().optional(),
    })
    .optional(),
});

export const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  prescribedBy: z.string().optional(),
  notes: z.string().optional(),
});

export const medicalHistorySchema = z.object({
  conditions: z
    .array(
      z.object({
        name: z.string().min(1, "Condition name is required"),
        diagnosedDate: z.string().optional(),
        status: z.enum(["active", "resolved", "chronic"]),
        notes: z.string().optional(),
      })
    )
    .default([]),
  surgeries: z
    .array(
      z.object({
        name: z.string().min(1, "Surgery name is required"),
        date: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .default([]),
  familyHistory: z
    .array(
      z.object({
        condition: z.string().min(1, "Condition is required"),
        relation: z.string().min(1, "Relation is required"),
        notes: z.string().optional(),
      })
    )
    .default([]),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type HealthProfileFormData = z.infer<typeof healthProfileSchema>;
export type MedicationFormData = z.infer<typeof medicationSchema>;
export type MedicalHistoryFormData = z.infer<typeof medicalHistorySchema>;
