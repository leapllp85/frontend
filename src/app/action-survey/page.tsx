import type { Metadata } from "next";
import { ActionSurveyPage } from "@/components/action-survey/ActionSurveyPage";

export const metadata: Metadata = {
  title: "Manager Surveys Dashboard",
};

export default function Page() {
  return <ActionSurveyPage />;
}
