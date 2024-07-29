import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  return asyncHandler(async () => {
    const body = await request.json();
    if (body.token) {
      const user = await db.users.findUnique({
        where: {
          verificationToken: body.token,
        },
      });

      const org = await db.organizations.findFirst({
        where: {
          createdById: user?.id,
        },
      });

      if (!user) {
        throw new ApiError(400, "Link is expired");
      }

      if(user.isVerified){
        throw new ApiError(400, "Account already verified");
      }

      if (user.verificationTokenExpiry) {
        let tokenExpiryTimestamp = parseInt(user.verificationTokenExpiry);
        if (tokenExpiryTimestamp < Date.now())
          throw new ApiError(400, "Verification link has expired");
      }

      await db.users.update({
        where: {
          id: user?.id,
        },
        data: {
          isVerified: true,
        },
      });

      const releaseTags = [
        { name: 'Web', code: 'web' },
        { name: 'Android', code: 'android' },
        { name: 'IOS', code: 'ios' },
      ];
    
      const releaseCategories = [
        { name: 'New', code: 'new' },
        { name: 'Improvement', code: 'improvement' },
        { name: 'Bug Fix', code: 'bug_fix' },
        { name: 'Maintenance', code: 'maintenance' },
        { name: 'Refactor', code: 'refactor' },
      ];

      const existingReleaseTags = await db.releaseTags.findMany({
        where: {
          organizationsId: org?.id,
        },
      });

      const existingReleaseCategories = await db.releaseCategories.findMany({
        where: {
          organizationsId: org?.id,
        },
      });

      if(existingReleaseTags.length === 0 && existingReleaseCategories.length === 0){
        for (const tag of releaseTags) {
          await db.releaseTags.create({
            data: {
              name: tag.name,
              code: tag.code,
              organizationsId: org?.id,
            },
          });
        }
  
        for (const category of releaseCategories) {
          await db.releaseCategories.create({
            data: {
              name: category.name,
              code: category.code,
              organizationsId: org?.id,
            },
          });
        }
      }
      
      return NextResponse.json(
        new ApiResponse(200, null, "Your account has been verified"),
      )
    }
    else{
      throw new ApiError(400, "Link is invalid");
    }
  })
};