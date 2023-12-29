import { DateFormat } from "@/Utils/date-format";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Navbar } from "@/components/Navbar";
import { TypographyH3, TypographyP } from "@/components/Typography";
import { db } from "@/lib/db";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

const getPosts = async () => {
  const response = await db.logs.findMany({
    select: {
      log_id: true,
      title: true,
      description: true,
      releaseCategory: true,
      releaseVersion: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return response;
};

export default async function AllLogs() {
  const changeLogs = await getPosts();
  return (
    <>
      <Navbar />
      <MaxWidthWrapper>
        <div className="flex justify-between ">
          <TypographyH3>Change Logs</TypographyH3>
          <Link
            href="/changeLog/add"
            className="bg-primary p-1 rounded-md text-black text-md font-medium"
          >
            Create Logs
          </Link>
        </div>
        <main className="grid items-center justify-center md:grid-cols-4 lg:grid-cols-4 gap-4 mt-10">
          {changeLogs.map((logs) => (
            <Link href={`/changeLog/${logs.log_id}`} key={logs.log_id}>
              <div className="border p-4 onhover rounded-md">
                <TypographyH3>{logs.title}</TypographyH3>
                <TypographyP>
                  {dayjs(logs.createdAt).format(DateFormat.LONG)}
                </TypographyP>
              </div>
            </Link>
          ))}
        </main>
      </MaxWidthWrapper>
    </>
  );
}
