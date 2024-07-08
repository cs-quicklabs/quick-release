"use client";

import AddReleaseTag from "./components/AddReleaseTag";
import ReleaseTagsTable from "./components/ReleaseTagsTable";
import BaseTemplate from "@/templates/BaseTemplate";
import Link from "next/link";
import React, { useState } from "react";

const TagsPage = () => {
  const [selectedReleaseTagId, setSelectedReleaseTagId] = useState<
    number | null
  >(null);

  return (
    <main className="h-full overflow-y-auto max-w-xl pb-12 px-4 lg:col-span-6 no-scrollbar">
      <h1 className="text-lg font-semibold">Tags</h1>

      <p className="text-gray-500 text-sm">
        Tags can be assigned to changelogs or posts to define the categories
        they belong to.
      </p>

      <AddReleaseTag
        selectedReleaseTagId={selectedReleaseTagId}
        setSelectedReleaseTagId={setSelectedReleaseTagId}
      />

      <ReleaseTagsTable onEdit={setSelectedReleaseTagId} />
    </main>
  );
};

export default TagsPage;
