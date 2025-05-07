import { db } from "@/lib/db";
import { ApiResponse } from "@/Utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json(
        new ApiResponse(400, null, "Missing organizationId")
      );
    }

    await db.$transaction(async (tx) => {
      const orgUsers = await tx.organizationsUsers.findMany({
        where: { organizationsId: organizationId },
        select: { usersId: true },
      });

      const userIds = orgUsers.map((u) => u.usersId);
      console.log("User IDs:", userIds);

      // FeedbackPostVotes (via Boards → Projects → Org)
      const deletedVotes = await tx.feedbackPostVotes.deleteMany({
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

      console.log("Deleted FeedbackPostVotes:", deletedVotes.count);

      // FeedbackPostReleaseTags
      const feedbackPostReleaseTags =
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

      console.log(
        "Deleted FeedbackPostReleaseTags:",
        feedbackPostReleaseTags.count
      );

      // FeedbackPosts
      const feedbackPosts = await tx.feedbackPosts.deleteMany({
        where: {
          feedbackBoards: {
            projects: {
              organizationsId: organizationId,
            },
          },
        },
      });
      console.log("Deleted FeedbackPosts:", feedbackPosts.count);

      // FeedbackBoards
      const feedbackBoards = await tx.feedbackBoards.deleteMany({
        where: {
          projects: {
            organizationsId: organizationId,
          },
        },
      });

      console.log("Deleted FeedbackBoards:", feedbackBoards.count);

      // ChangelogReleaseTags
      const changelogReleaseTags = await tx.changelogReleaseTags.deleteMany({
        where: {
          log: {
            projects: {
              organizationsId: organizationId,
            },
          },
        },
      });

      console.log("Deleted ChangelogReleaseTags:", changelogReleaseTags.count);

      // ChangelogReleaseCategories
      const changelogReleaseCategories =
        await tx.changelogReleaseCategories.deleteMany({
          where: {
            log: {
              projects: {
                organizationsId: organizationId,
              },
            },
          },
        });

      console.log(
        "Deleted ChangelogReleaseCategories:",
        changelogReleaseCategories.count
      );

      // Changelogs
      const Changelogs = await tx.changelogs.deleteMany({
        where: {
          projects: {
            organizationsId: organizationId,
          },
        },
      });
      console.log("Deleted Changelogs:", Changelogs.count);

      // ProjectsUsers
      const projectsUsers = await tx.projectsUsers.deleteMany({
        where: {
          projects: {
            organizationsId: organizationId,
          },
        },
      });
      console.log("Deleted ProjectsUsers:", projectsUsers.count);

      // Projects
      const projects = await tx.projects.deleteMany({
        where: {
          organizationsId: organizationId,
        },
      });

      console.log("Deleted Projects:", projects.count);

      // OrganizationsUsers
      const organizationsUsers = await tx.organizationsUsers.deleteMany({
        where: {
          organizationsId: organizationId,
        },
      });
      console.log("Deleted OrganizationsUsers:", organizationsUsers.count);

      // ReleaseTags
      const releaseTags = await tx.releaseTags.deleteMany({
        where: {
          organizationsId: organizationId,
        },
      });
      console.log("Deleted ReleaseTags:", releaseTags.count);

      // ReleaseCategories
      const releaseCategories = await tx.releaseCategories.deleteMany({
        where: {
          organizationsId: organizationId,
        },
      });
      console.log("Deleted ReleaseCategories:", releaseCategories.count);

      const orgExists = await tx.organizations.findUnique({
        where: { id: organizationId },
      });

      if (orgExists) {
        await tx.organizations.delete({
          where: { id: organizationId },
        });
        console.log("Deleted Organization:", organizationId);
      } else {
        console.warn(
          "Organization not found. Skipping delete:",
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
          console.log("Deleted userId:", userId);
        }
      }
    });

    return NextResponse.json(
      new ApiResponse(200, null, "Organization and related data deleted")
    );
  } catch (error: any) {
    console.error("Delete Org Error:", error);
    return NextResponse.json(
      new ApiResponse(500, null, "Failed to delete organization")
    );
  }
}
