import { db } from "@/lib/db";
import React, { FC } from "react";
import parse from "html-react-parser";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { TypographyH1, TypographyP } from "@/components/Typography";
import dayjs from "dayjs";
import { DateFormat } from "@/Utils/date-format";
import { Navbar } from "@/components/Navbar";

interface BlogDetailProp {
  params: {
    id: string;
  };
}

const getPost = async (id: string) => {
  const response = await db.log.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      releaseVersion: true,
      releaseTags: true,
      createdAt: true,
    },
  });
  return response;
};

const BlogDetail: FC<BlogDetailProp> = async ({ params }) => {
  const changelog = await getPost(params.id);

  return (
    <div>
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center py-4">
          <TypographyH1
            children={`${changelog?.title}`}
            className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
          />
          <TypographyP
            children={`Published on ${dayjs(changelog?.createdAt).format(
              DateFormat.LONG
            )} as Version ${changelog?.releaseVersion}`}
          />
          <p className="py-12">{parse(changelog?.description as any)}</p>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default BlogDetail;
