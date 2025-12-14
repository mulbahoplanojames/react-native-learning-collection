import React, { createContext, ReactNode, useContext, useState } from "react";

interface OnboardingData {
  demographic: {
    ageRange: string;
    gender: string;
  };
  healthGoals: string[];
  privacySettings: {
    heartRate: boolean;
    sleep: boolean;
    location: boolean;
  };
  additionalInfo: {
    topics: string[];
    notes: string;
  };
  medical: {
    age: string;
    gender: string;
    bloodType: string;
    allergies: string;
    medicalConditions: string;
    medications: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
}

interface OnboardingContextType {
  data: OnboardingData;
  updateDemographic: (data: Partial<OnboardingData["demographic"]>) => void;
  updateHealthGoals: (goals: string[]) => void;
  updatePrivacySettings: (
    settings: Partial<OnboardingData["privacySettings"]>
  ) => void;
  updateAdditionalInfo: (
    info: Partial<OnboardingData["additionalInfo"]>
  ) => void;
  updateMedical: (data: Partial<OnboardingData["medical"]>) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>({
    demographic: {
      ageRange: "",
      gender: "",
    },
    healthGoals: [],
    privacySettings: {
      heartRate: true,
      sleep: false,
      location: false,
    },
    additionalInfo: {
      topics: [],
      notes: "",
    },
    medical: {
      age: "",
      gender: "",
      bloodType: "",
      allergies: "",
      medicalConditions: "",
      medications: "",
      emergencyContact: "",
      emergencyPhone: "",
    },
  });

  const updateDemographic = (
    newData: Partial<OnboardingData["demographic"]>
  ) => {
    setData((prev) => ({
      ...prev,
      demographic: { ...prev.demographic, ...newData },
    }));
  };

  const updateHealthGoals = (goals: string[]) => {
    setData((prev) => ({ ...prev, healthGoals: goals }));
  };

  const updatePrivacySettings = (
    newSettings: Partial<OnboardingData["privacySettings"]>
  ) => {
    setData((prev) => ({
      ...prev,
      privacySettings: { ...prev.privacySettings, ...newSettings },
    }));
  };

  const updateAdditionalInfo = (
    newInfo: Partial<OnboardingData["additionalInfo"]>
  ) => {
    setData((prev) => ({
      ...prev,
      additionalInfo: { ...prev.additionalInfo, ...newInfo },
    }));
  };

  const updateMedical = (newData: Partial<OnboardingData["medical"]>) => {
    setData((prev) => ({
      ...prev,
      medical: { ...prev.medical, ...newData },
    }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateDemographic,
        updateHealthGoals,
        updatePrivacySettings,
        updateAdditionalInfo,
        updateMedical,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
