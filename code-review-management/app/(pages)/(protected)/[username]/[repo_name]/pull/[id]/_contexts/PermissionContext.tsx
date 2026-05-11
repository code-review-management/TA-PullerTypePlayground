import { createContext, ReactNode, useContext } from "react";
import { useParams } from "next/navigation";
import { StatusError } from "@/lib/api/errors/statusError";
import { usePermissionQuery } from "@/lib/api/queries/usePermissionQuery";
import { CollaboratorPerms } from "@/types/github.types";
import { PullParams } from "@/types/routing.types";

const PermissionContext = createContext<{
  data: CollaboratorPerms | undefined;
  error: StatusError | null;
  isPending: boolean;
} | null>(null);

export const usePermissionContext = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error(
      "usePermissionContext has to be used within <PermissionContext>",
    );
  }
  return context;
};

export default function PermissionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { username, repo_name } = useParams<PullParams>();
  const { data, error, isPending } = usePermissionQuery(username, repo_name);

  return (
    <PermissionContext
      value={{
        data,
        error,
        isPending,
      }}
    >
      {children}
    </PermissionContext>
  );
}
