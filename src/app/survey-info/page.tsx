import type { Metadata } from "next";
import { SurveyInfoPage } from "@/components/survey-info/SurveyInfoPage";

export const metadata: Metadata = {
  title: "Survey Info",
  description: "Survey feedback and completion overview",
};

export default function SurveyInfoRoute() {
  return <SurveyInfoPage />;
}
