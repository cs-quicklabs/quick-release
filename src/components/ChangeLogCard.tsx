"use client";
import { FC } from "react";
import parse from "html-react-parser";

type JsonArray = JSON[];

interface ChangeLogCardProps {
  changeLogs: {
    id: string;
    title: string;
    description: string;
    releaseTags: any;
    releaseVersion: string;
    createdAt: Date;
  }[];
}

const ChangeLogCard: FC<ChangeLogCardProps> = ({ changeLogs }) => {
  return (
    <div className="max-w-7xl bg-white">
      <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-6 border-gray-200 pt-1  lg:mx-0 lg:max-w-none lg:grid-cols-1">
        {changeLogs.map((changeLog) => (
          <article
            key={changeLog.id}
            className="flex max-w-xl flex-col items-start justify-between border-b px-4 py-2"
          >
            <div className="group relative w-full">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold leading-6 group-hover:text-gray-600">
                  {changeLog?.title}
                </h3>
                <p className="text-gray-600 text-sm">3.1.0</p>
              </div>
              <div className="w-full gap-x-4 text-xs"></div>
              <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                {parse(changeLog.description)}
              </p>
            </div>
            <span className=" rounded-full bg-green-50 px-3 py-1.5 font-medium text-xs text-green-600 hover:bg-gray-100">
              Published
            </span>
          </article>
        ))}
      </div>
    </div>
  );
};
export default ChangeLogCard;
