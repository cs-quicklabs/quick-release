import { db } from "@/lib/db";


const ChangeLogsReleaseCategories = {
  new: { value: "new", label: "New" },
  improvement: { value: "improvement", label: "Improvement" },
  bug_fix: { value: "bug_fix", label: "Bug Fix" },
  maintenance: { value: "maintenance", label: "Maintenance" },
  refactor: { value: "refactor", label: "Refactor" },
};

const ChangeLogsReleaseTags = {
  ios: { value: "ios", label: "iOS" },
  android: { value: "android", label: "Android" },
  web: { value: "web", label: "Web" },
};

async function main() {
  // Fetch all logs from the old schema
  const oldLogs = await db.log.findMany();

  // Insert release tags into the new schema
  for (const tag of Object.values(ChangeLogsReleaseTags)) {
    await db.releaseTags.create({
      data: {
        cuid: tag.value,
        name: tag.label,
        code: tag.value,
      },
    });
  }

  // Insert release categories into the new schema
  for (const category of Object.values(ChangeLogsReleaseCategories)) {
    await db.releaseCategories.create({
      data: {
        cuid: category.value,
        name: category.label,
        code: category.value,
      },
    });
  }

  // Insert logs into the new schema
  for (const log of oldLogs) {
    const newLog = await db.changelogs.create({
      data: {
        cuid: log.id,
        title: log.title,
        description: log.description,
        releaseVersion: log.releaseVersion,
        projectsId: log.projectId ? await db.projects.findUnique({ where: { cuid: log.projectId } }).then(p => p?.id) : null,
        scheduledTime: log.scheduledTime,
        status: log.status,
        createdById: await db.users.findUnique({ where: { cuid: log.createdById } }).then(u => u?.id),
        updatedById: await db.users.findUnique({ where: { cuid: log.updatedById } }).then(u => u?.id),
        createdAt: log.createdAt,
        updatedAt: log.updatedAt,
        deletedAt: log.deletedAt,
        archivedAt: log.archivedAt,
      },
    });

    // Insert release tags relationships
    for (const tagCode of log.releaseTags) {
      const tag = await db.releaseTags.findUnique({ where: { code: tagCode } });
      if (tag) {
        await db.changelogReleaseTags.create({
          data: {
            logId: newLog.id,
            releaseTagId: tag.id,
          },
        });
      }
    }

    // Insert release categories relationships
    for (const categoryCode of log.releaseCategories) {
      const category = await db.releaseCategories.findUnique({ where: { code: categoryCode } });
      if (category) {
        await db.changelogReleaseCategories.create({
          data: {
            logId: newLog.id,
            releaseCategoryId: category.id,
          },
        });
      }
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
