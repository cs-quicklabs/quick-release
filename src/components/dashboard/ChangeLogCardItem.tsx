import { ChangeLogsStatus } from "@/Utils/constants";
import { useChangeLogContext } from "@/app/context/ChangeLogContext";
import { classNames } from "@/lib/utils";
import { ChangeLogType } from "@/types";
import moment from "moment";
import React, { useMemo } from "react";

const ChangeLogCardItem: React.FC<{ id?: string | null; }> = ({ id = null }) => {
  const { activeChangeLogId, map, setActiveChangeLogId } = useChangeLogContext();
  const changeLog = useMemo<ChangeLogType | null | undefined>(() => map[id!], [map, id]);

  if (!changeLog) return null;

  const { createdBy, releaseVersion, isArchived, status, scheduledTime } = changeLog;
  const fullName = `${createdBy?.firstName || ""} ${createdBy?.lastName || ""}`.trim();
  const changeLogStatus = isArchived ? ChangeLogsStatus.archived : ChangeLogsStatus[status];

  const description = changeLog.description.replace(/(<([^>]+)>)/gi, "");

  return (
    <li className={classNames(
      "relative py-5 px-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50",
      id === activeChangeLogId ? "bg-gray-50" : "bg-white"
    )}
      onClick={() => setActiveChangeLogId(id!)}
    >
      <div className="flex justify-between space-x-3">
        <div className="min-w-0 flex-1">
          <a href="#" className="block focus:outline-none">
            <span
              className="absolute inset-0"
              aria-hidden="true"
            />
            <p className="truncate text-sm font-medium text-gray-900">
              {changeLog.title}
            </p>
            <p className="flex truncate text-sm text-gray-500">
              <span className="truncate flex-shrink mr-1">
                {fullName}
              </span>

              <span>
                {` on ${scheduledTime ? moment(scheduledTime).format("MMMM DD, yyyy") : ""}`}
              </span>
            </p>
          </a>
        </div>
        <p className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
          {releaseVersion}
        </p>
      </div>

      <div className="mt-1">
        <p
          className="text-sm text-gray-600 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      {
        changeLogStatus && (
          <span className={classNames(
            `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`,
            changeLogStatus.bgColor,
            changeLogStatus.textColor
          )}>
            {changeLogStatus.title}
          </span>
        )
      }
    </li>
  );
};

export default ChangeLogCardItem;
