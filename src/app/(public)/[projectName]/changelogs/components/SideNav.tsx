"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "flowbite-react";
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation";
import { useChangeLogContext } from "@/app/context/ChangeLogContext";
import { classNames } from "@/lib/utils";
import { ReleaseTagType } from "@/types";

type SideNavProps = {
  releaseTags?: ReleaseTagType[];
  releaseCategories?: ReleaseTagType[];
};

const SideNav: React.FC<SideNavProps> = ({ releaseTags = [], releaseCategories = [] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { projectName } = useParams();

  const searchParams = useSearchParams();
  const { isLoading: isFetchingChangeLogs, list: changeLogsList, getAllPublicChangeLogs } = useChangeLogContext();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchAllChangesLogs = (categories: string | null, tags: string | null) => {
    const query: { [key: string]: any; } = { projectName };

    if (categories) query.releaseCategories = categories;
    if (tags) query.releaseTags = tags;

    getAllPublicChangeLogs(query);
  };

  const updateQueryParams = (categories: string | null, tags: string | null) => {
    if (!categories && !tags) {
      fetchAllChangesLogs(null, null);
      return router.push(pathname);
    }

    let queryParams = "";
    if (categories) {
      queryParams += `releaseCategories=${categories}`;
    }

    if (tags) {
      if (queryParams) queryParams += "&";
      queryParams += `releaseTags=${tags}`;
    }

    fetchAllChangesLogs(categories, tags);
    router.push(`${pathname}?${queryParams}`);
  };

  const onSelectCategories = (value: string) => {
    let categories = [...selectedCategories];
    if (categories.includes(value)) {
      categories = categories.filter((item) => item !== value);
    } else {
      categories.push(value);
    }
    setSelectedCategories(categories);
    updateQueryParams(categories.toString(), selectedTags.toString());
  };

  const onSelectTags = (value: string) => {
    let tags = [...selectedTags];
    if (tags.includes(value)) {
      tags = tags.filter((item) => item !== value);
    } else {
      tags.push(value);
    }
    setSelectedTags(tags);
    updateQueryParams(selectedCategories.toString(), tags.toString());
  };

  useEffect(() => {
    const searchedCategories = searchParams.get("releaseCategories");
    setSelectedCategories(searchedCategories?.split(",") ?? []);

    const searchedTags = searchParams.get("releaseTags");
    setSelectedTags(searchedTags?.split(",") ?? []);

    fetchAllChangesLogs(searchedCategories, searchedTags);
  }, [projectName]);

  return (
    <aside className="flex lg:flex-col lg:justify-start gap-4 py-4 px-2 sm:px-4 lg:col-span-3 lg:py-0 lg:px-0">
      <div className="px-2 py-2 sm:p-4">
        <label className="text-base font-semibold text-gray-900">Select Categories</label>
        <p className="text-sm text-gray-500">Chose Release Categories</p>

        <fieldset className="mt-4">
          <div className="space-y-2">
            {
              releaseCategories.map(category => (
                <div
                  key={category.value}
                  className="flex items-center"
                  onClick={() => onSelectCategories(category.value)}
                >
                  <Checkbox
                    className={
                      "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    }
                    name={category.value}
                    checked={selectedCategories.includes(category.value)}
                    onChange={() => onSelectCategories(category.value)}
                    readOnly
                  />

                  <label
                    htmlFor={category.value}
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    {category.label}
                  </label>
                </div>
              ))
            }
          </div>
        </fieldset>
      </div>
      {
        !!releaseTags.length &&
        <div className="px-2 py-2 sm:p-4">
          <label className="text-base font-semibold text-gray-900">Select Release tags</label>
          <p className="text-sm text-gray-500">Chose Release tags</p>

          <fieldset className="mt-4">
            <div className="space-y-2">
              {
                releaseTags.map(tag => (
                  <div
                    key={tag.value}
                    className="flex items-center"
                    onClick={() => onSelectTags(tag.value)}
                  >
                    <Checkbox
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      name={tag.value}
                      checked={selectedTags.includes(tag.value)}
                      readOnly
                    />

                    <label
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                      htmlFor={tag.value}
                    >
                      {tag.label}
                    </label>
                  </div>
                ))
              }
            </div>
          </fieldset>
        </div>
      }
    </aside>
  );
};

export default SideNav;
