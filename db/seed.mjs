import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  try {
    // Check if data already exists
    const changelogReleaseTags = await db.changelogReleaseTags.findMany();
    if (changelogReleaseTags && changelogReleaseTags.length > 0) {
      console.log('Data already seeded.');
      return;
    }

    // Fetch all logs from the old schema
    const oldLogs = await db.log.findMany();

    for (const log of oldLogs) {
      // Insert release tags relationships
      for (const tagCode of log.releaseTags) {
        const tag = await db.releaseTags.findFirst({ where: { code: tagCode } });
        const newLog = await db.changelogs.findUnique({ where: { cuid: log.id } });
        if (tag && newLog) {
          await db.changelogReleaseTags.create({
            data: {
              logId: newLog.id,
              releaseTagId: tag.id,
            },
          });
        } else {
          console.log(`Tag ${tagCode} not found`);
        }
      }

      // Insert release categories relationships
      for (const categoryCode of log.releaseCategories) {
        const category = await db.releaseCategories.findFirst({ where: { code: categoryCode } });
        const newLog = await db.changelogs.findUnique({ where: { cuid: log.id } });
        if (category && newLog) {
          await db.changelogReleaseCategories.create({
            data: {
              logId: newLog.id,
              releaseCategoryId: category.id,
            },
          });
        } else {
          console.log(`Category ${categoryCode} not found`);
        }
      }
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
