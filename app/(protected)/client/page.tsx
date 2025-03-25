"use client";

import { ClientForm } from "@/components/client-form";
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = () => {
  const user = useCurrentUser();
  return (
    <ClientForm user={user} label="Travel Order Form" />
    // <UserInfo user={user} label="Client component" />;
  );
};

export default ClientPage;
