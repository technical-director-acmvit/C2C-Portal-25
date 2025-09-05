"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RegisterModal } from "@/components/register-modal";

type ParticipantType = "internal" | "external";

function RegisterPageContent() {
  const router = useRouter();
  const search = useSearchParams();

  const defaultType = useMemo<ParticipantType | undefined>(() => {
    const type = (search.get("type") || "").toLowerCase();
    const hasInt = search.has("int");
    const hasExt = search.has("ext");
    if (type === "int" || type === "internal" || hasInt) return "internal";
    if (type === "ext" || type === "external" || hasExt) return "external";
    return undefined;
  }, [search]);

  const handleClose = () => {
    router.push("/");
  };

  return <RegisterModal isOpen onClose={handleClose} defaultType={defaultType} />;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageContent />
    </Suspense>
  );
}
