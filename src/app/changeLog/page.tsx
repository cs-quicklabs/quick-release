import { Navbar } from "@/components/Navbar";
import { db } from "@/lib/db";

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

export default async function Home() {
  const posts = await getPosts();
  console.log(posts);

  console.log("Posts Data", posts);
  return (
    <>
      <Navbar />
      <main className="grid items-center justify-center md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {posts.map((post) => (
          //   <PostCard post={post}/>
          <h1>Hello</h1>
        ))}
      </main>
    </>
  );
}
