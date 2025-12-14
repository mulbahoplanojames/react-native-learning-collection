import React from "react";
import { Image } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import AdditionalInfoForm from "./AdditionalInfoForm";
import DemographicInfoForm from "./DemographicInfoForm";
import HealthGoalsForm from "./HealthGoalsForm";
import PrivacySettingsForm from "./PrivacySettingsForm";

export default function OnboardingComponent() {
  return (
    <Onboarding
      pages={[
        {
          backgroundColor: "#FDCA5D",
          image: (
            <Image source={require("../assets/onboard/popcorn-large.png")} />
          ),
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        {
          backgroundColor: "#BEE6FF",
          image: (
            <Image source={require("../assets/onboard/popcorn-large.png")} />
          ),
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        {
          backgroundColor: "#00B388",
          image: (
            <Image source={require("../assets/onboard/popcorn-large.png")} />
          ),
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        {
          backgroundColor: "#F8F8F8",
          image: <PrivacySettingsForm />,
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "#F5F5F5",
          image: <DemographicInfoForm />,
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "#FFFFFF",
          image: <HealthGoalsForm />,
          title: "",
          subtitle: "",
        },

        {
          backgroundColor: "#F8F8F8",
          image: <AdditionalInfoForm />,
          title: "",
          subtitle: "",
        },
      ]}
    />
  );
}
