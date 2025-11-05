import BestOfTheMonthCard from "@/src/components/home-screen/best-of-month-card";
import PopularActorSection from "@/src/components/home-screen/popular-actor-section";
import { Link } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GamesScreen() {
  return (
    <SafeAreaView className="px-4 bg-primaryBackground flex-1">
      <BestOfTheMonthCard />
      <PopularActorSection />

      <Link href="/" className="text-3xl text-blue-500 pt-20">
        Back home
      </Link>
    </SafeAreaView>
  );
}
