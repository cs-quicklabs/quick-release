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
  const response = await db.logs.findFirst({
    where: {
      log_id: id,
    },
    select: {
      log_id: true,
      title: true,
      description: true,
      releaseVersion: true,
      releaseCategory: true,
      createdAt: true,
    },
  });
  return response;
};

const BlogDetail: FC<BlogDetailProp> = async ({ params }) => {
  const changelog = await getPost(params.id);
  console.log("Change Log", changelog?.title);

  return (
    <div>
      <Navbar />
      <MaxWidthWrapper>
        <TypographyH1 children={`${changelog?.title}`} />
        <TypographyP
          children={`Published on ${dayjs(changelog?.createdAt).format(
            DateFormat.LONG
          )} as Version ${changelog?.releaseVersion}`}
        />
        <div className="py-12">{parse(changelog?.description as any)}</div>
        <h1>{changelog?.releaseCategory}</h1>
      </MaxWidthWrapper>
    </div>
  );
};

export default BlogDetail;
