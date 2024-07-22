"use client";

import React, { useMemo, useRef } from "react";
import { useChangeLogContext } from "@/app/context/ChangeLogContext";
import { ChangeLogType } from "@/types";
import moment from "moment";
import Link from "next/link";
import { classNames } from "@/lib/utils";
import { IReleaseCategory, IReleaseTag } from "@/interfaces";

const ChangeLogListItem: React.FC<{ id: string; }> = ({ id }) => {
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  const { map } = useChangeLogContext();
  const changeLog = useMemo<ChangeLogType | null | undefined>(() => map[id], [map, id]);

  const showReadMoreBtn = useMemo(() => {
    if (!contentContainerRef.current) return false;

    const { scrollHeight, clientHeight } = contentContainerRef.current;
    return scrollHeight > clientHeight;
  }, [contentContainerRef.current]);

  if (!changeLog) return null;

  const { title, description, createdBy, releaseVersion, projects } = changeLog;
  const fullName = `${createdBy?.firstName || ""} ${createdBy?.lastName || ""}`.trim();
  const releaseCategories = (changeLog.releaseCategories as IReleaseCategory[]).map(category => ({ value: category.code, label: category.name }));
  // const releaseTags = changeLog.releaseTags.map((id) => ChangeLogsReleaseTags[id!]);
  const releaseTags = (changeLog.releaseTags as IReleaseTag[]).map(tag => ({ value: tag.code, label: tag.name }));
  const scheduledTime = changeLog.scheduledTime ? moment(changeLog.scheduledTime).format("MMMM DD, yyyy") : "-";
  const publicLink = `/${projects?.name}/changelogs/${id}`;

  return (
    <main className="max-w-2xl border-b border-gray-100">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <Link href={publicLink}>
            <h2 className="hover:underline text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {title}
            </h2>
          </Link>

          <p className="mt-1 truncate text-sm text-gray-500">
            {fullName} published on {scheduledTime} as Version {releaseVersion}
          </p>

          <div className="mt-1">
            {releaseCategories.map(({ value, label }) => (
              <span
                key={value}
                className={classNames(
                  "inline-flex items-center bg-gray-100 rounded px-2 py-0.5 text-xs font-medium text-gray-800 mr-1"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="content-container space-y-6 text-sm text-gray-800 py-12 ql-snow">
        <div
          ref={contentContainerRef}
          className="ql-editor relative text-clamp line-clamp-6"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {
          showReadMoreBtn &&
          <Link
            className="text-sm"
            href={publicLink}
          >
            Read More <span aria-hidden="true">→</span>
          </Link>
        }

        {
          !!releaseTags.length &&
          <div className="text-sm text-gray-800">
            {releaseTags.map(({ value, label }) => (
              <span
                key={value}
                className={classNames(
                  "inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 mr-1"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        }
      </div>

    </main>
  );
};

export default ChangeLogListItem;
