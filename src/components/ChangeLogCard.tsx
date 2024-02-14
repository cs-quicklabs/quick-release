import { FC } from "react";

const posts = [
  {
    id: 1,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 1,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 1,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 1,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  // More posts...
];

type JsonArray = JSON[];

interface ChangeLogCardProps {
  changeLogs: {
    id: string;
    title: string;
    description: string;
    releaseTags: any;
    releaseVersion: string;
    createdAt: Date;
  }[];
}

const ChangeLogCard: FC<ChangeLogCardProps> = async ({ changeLogs }) => {
  console.log(changeLogs);
  return (
    <div className="max-w-7xl bg-white">
      <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-6 border-gray-200 pt-1  lg:mx-0 lg:max-w-none lg:grid-cols-1">
        {changeLogs.map((changeLog) => (
          <article
            key={changeLog.id}
            className="flex max-w-xl flex-col items-start justify-between border-b px-4 py-2"
          >
            <div className="group relative w-full">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold leading-6 group-hover:text-gray-600">
                  {/* <span className="absolute inset-0" /> */}
                  {changeLog?.title}
                </h3>
                <p className="text-gray-600 text-sm">3.1.0</p>
              </div>
              <div className="w-full gap-x-4 text-xs">
                {/* <time dateTime={changeLog.createdAt} className="text-gray-500">
                  {changeLog.createdAt}
                </time> */}
              </div>
              <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                {changeLog.description}
              </p>
            </div>
            <span className=" rounded-full bg-green-50 px-3 py-1.5 font-medium text-xs text-green-600 hover:bg-gray-100">
              Published
            </span>
          </article>
        ))}
      </div>
    </div>
  );
};
export default ChangeLogCard;
