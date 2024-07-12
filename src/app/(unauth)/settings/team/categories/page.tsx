"use client";
import React, { useState } from "react";
import AddReleaseCategory from "./components/AddReleaseCategory";
import ReleaseCategoriesTable from "./components/ReleaseCategoriesTable";

const CategoriesPage = () => {
  const [selectedReleaseCategoryId, setSelectedReleaseCategoryId] = useState<
    number | null
  >(null);

  return (
    <main className="h-full overflow-y-auto max-w-xl pb-12 px-4 lg:col-span-6 no-scrollbar">
      <h1 className="text-lg font-semibold">Categories</h1>

      <p className="text-gray-500 text-sm">
        Categories can be assigned to changelogs or posts to define the categories
        they belong to.
      </p>

      <AddReleaseCategory
        selectedReleaseCategoryId={selectedReleaseCategoryId}
        setSelectedReleaseCategoryId={setSelectedReleaseCategoryId}
      />

      <ReleaseCategoriesTable />
    </main>
  );
};

export default CategoriesPage;
