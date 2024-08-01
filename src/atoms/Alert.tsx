"use client";

import React from "react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

import { classNames } from "@/lib/utils";

export type AlertPropsType = {
  containerClassName?: string;
  iconClassName?: string;
  messageClassName?: string;
  actionClassName?: string;

  message: string;

  actionText: string;
  actionLink?: string;
  onClickAction?: React.MouseEventHandler<HTMLAnchorElement>;
};

const Alert: React.FC<AlertPropsType> = ({
  containerClassName = "",
  iconClassName = "",
  messageClassName = "",
  actionClassName = "",
  message = "",
  actionText,
  actionLink = "#",
  onClickAction,
}) => {
  return (
    <li className={classNames("rounded-md p-4 shadow-sm", containerClassName)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className={classNames("h-5 w-5", iconClassName)} />
        </div>

        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className={classNames("text-sm", messageClassName)}>
            {message}
          </p>

          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            <Link
              className={classNames(
                "whitespace-nowrap font-medium",
                actionClassName
              )}
              href={actionLink}
              onClick={onClickAction}
            >
              {actionText} <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </div>
    </li>
  );
};

export default Alert;
