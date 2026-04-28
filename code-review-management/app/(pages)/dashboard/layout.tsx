"use client";

import { ReactNode } from "react";
import ProtectedLayout from "../_components/ProtectedLayout/ProtectedLayout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
