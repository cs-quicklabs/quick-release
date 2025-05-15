import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationCuid } = body;

    const session = (await getServerSession(authOptions)) as any;

    const userId = session?.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const isSystemAdmin = await db.systemUsers.findFirst({
      where: {
        users: {
          cuid: userId,
        },
      },
      include: {
        users: true,
      },
    });

    if (!isSystemAdmin) {
      throw new ApiError(401, "Unauthorized request");
    }

    if (!organizationCuid) {
      return NextResponse.json(
        new ApiResponse(400, null, "Missing organizationId")
      );
    }

    const organization = await db.organizations.findUnique({
      where: { cuid: organizationCuid },
    });

    if (!organization) {
      return NextResponse.json(
        new ApiResponse(404, null, "Organization not found")
      );
    }

    const organizationId = organization.id;

    await db.$transaction(async (tx) => {
      const orgUsers = await tx.organizationsUsers.findMany({
        where: { organizationsId: organizationId },
        select: { usersId: true },
      });

      const userIds = orgUsers.map((u) => u.usersId);

      const systemUsersStillExist = await tx.systemUsers.findFirst({
        where: {
          usersId: { in: userIds },
        },
      });

      if (systemUsersStillExist) {
        throw new Error(
          `Cannot delete organization: one or more users are still marked as SystemUsers`
        );
      }

      // FeedbackPostVotes (via Boards → Projects → Org)
      await tx.feedbackPostVotes.deleteMany({
        where: {
          feedbackPost: {
            feedbackBoards: {
              projects: {
                organizationsId: organizationId,
              },
            },
          },
        },
      });

      // FeedbackPostReleaseTags
      await tx.feedbackPostReleaseTags.deleteMany({
        where: {
          feedbackPost: {
            feedbackBoards: {
              projects: {
                organizationsId: organizationId,
              },
            },
          },
        },
      });

      // FeedbackPosts
      await tx.feedbackPosts.deleteMany({
        where: {
          feedbackBoards: {
            projects: {
              organizationsId: organizationId,
            },
          },
        },
      });

      // FeedbackBoards
      await tx.feedbackBoards.deleteMany({
        where: {
          projects: {
            organizationsId: organizationId,
          },
        },
      });

      // ChangelogReleaseTags
      await tx.changelogReleaseTags.deleteMany({
        where: {
          log: {
            projects: {
              organizationsId: organizationId,
            },
          },
        },
      });

      // ChangelogReleaseCategories
      await tx.changelogReleaseCategories.deleteMany({
        where: {
          log: {
            projects: {
              organizationsId: organizationId,
            },
          },
        },
      });

      // Changelogs
      await tx.changelogs.deleteMany({
        where: {
          projects: {
            organizationsId: organizationId,
          },
        },
      });

      // ProjectsUsers
      await tx.projectsUsers.deleteMany({
        where: {
          projects: {
            organizationsId: organizationId,
          },
        },
      });

      // Projects
      await tx.projects.deleteMany({
        where: {
          organizationsId: organizationId,
        },
      });

      // OrganizationsUsers
      await tx.organizationsUsers.deleteMany({
        where: {
          organizationsId: organizationId,
        },
      });

      // ReleaseTags
      await tx.releaseTags.deleteMany({
        where: {
          organizationsId: organizationId,
        },
      });

      // ReleaseCategories
      await tx.releaseCategories.deleteMany({
        where: {
          organizationsId: organizationId,
        },
      });

      const orgExists = await tx.organizations.findUnique({
        where: { id: organizationId },
      });

      if (orgExists) {
        await tx.organizations.delete({
          where: { id: organizationId },
        });
      } else {
        console.warn(
          "Organization not found. Skipping delete id:",
          organizationId
        );
      }

      for (const userId of userIds) {
        const stillInOtherOrgs = await tx.organizationsUsers.findFirst({
          where: {
            usersId: userId,
            organizationsId: { not: organizationId },
          },
        });

        const inOtherProjects = await tx.projectsUsers.findFirst({
          where: {
            usersId: userId,
          },
        });

        if (!stillInOtherOrgs && !inOtherProjects) {
          await tx.users.delete({
            where: { id: userId },
          });
        }
      }
    });

    return NextResponse.json(
      new ApiResponse(200, null, "Organization and related data deleted")
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(
        500,
        null,
        error?.message ?? "Failed to delete organization"
      )
    );
  }
}
