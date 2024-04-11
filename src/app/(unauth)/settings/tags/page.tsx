"use client";

import React, { useState } from "react";
import Link from "next/link";
import BaseTemplate from "@/templates/BaseTemplate";
import ReleaseTagsTable from "./components/ReleaseTagsTable";
import AddReleaseTag from "./components/AddReleaseTag";

const TagsPage = () => {
  const [selectedReleaseTagId, setSelectedReleaseTagId] = useState<number | null>(null);

  return (
    <BaseTemplate >
      <main className="h-full w-screen max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8 overflow-hidden">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="px-2 py-6 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              <Link
                href="#"
                className="bg-gray-200 text-gray-900 hover:bg-gray-200 rounded px-3 py-2 flex items-center text-sm font-medium"
              >
                Tags
              </Link>
            </nav>
          </aside>

          <main className="h-full overflow-y-auto max-w-xl pb-12 px-4 lg:col-span-6 no-scrollbar">
            <h1 className="text-lg font-semibold">Tags</h1>

            <p className="text-gray-500 text-sm">
              Tags can be assigned to changelogs or posts to define the categories they belong to.
            </p>

            <AddReleaseTag
              selectedReleaseTagId={selectedReleaseTagId}
              setSelectedReleaseTagId={setSelectedReleaseTagId}
            />

            <ReleaseTagsTable
              onEdit={setSelectedReleaseTagId}
            />
          </main>
        </div>
      </main>
    </BaseTemplate>
  );
};

export default TagsPage;
