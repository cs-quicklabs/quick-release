import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  try {
    console.log('Seeding database...');
    const projects = await db.projects.findMany({
      select: {
        id: true
      }
    });

    const feedbackBoards = await db.feedbackBoards.findMany({
      where: {
        projectsId: {
          in: projects.map(project => project.id)
        },
        isDefault: true
      },
      select: {
        projectsId: true
      }
    });

    const feedbackBoardArray = feedbackBoards.map(feedbackBoard => feedbackBoard.projectsId);

    if(feedbackBoardArray.length > 0 && feedbackBoardArray.length === projects.length) {
      return;
    }

    const filterProjects = projects.filter(project => !feedbackBoardArray.includes(project.id));

    for(const project of filterProjects) {
      await db.feedbackBoards.create({
        data: {
          name: 'Feature Requests',
          projectsId: project.id,
          isDefault: true
        }
      });
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
