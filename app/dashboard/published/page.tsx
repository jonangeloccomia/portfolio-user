import { Suspense } from "react";

import Published from "@/components/dashboard/published/published";

export default function PublishedPage() {
  return (
    <Suspense fallback={null}>
      <Published />
    </Suspense>
  );
}
