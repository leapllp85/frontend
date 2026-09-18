import type { Metadata } from "next";
import { ActionItemPage } from "@/components/action-item/ActionItemPage";

export const metadata: Metadata = {
  title: "Action Items",
  description: "Action item timeline and completion overview",
};

export default function ActionItemRoute() {
  return <ActionItemPage />;
}
