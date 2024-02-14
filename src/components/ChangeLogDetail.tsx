"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

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
  // More posts...
];

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function ChangeLogDetail() {
  return (
    <div className="">
      <div className="border-b bg-white border-gray-200 p-5">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <div className="sm:w-0 sm:flex-1">
            <h1
              id="message-heading"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              {posts[0].title}
            </h1>
            <p className="mt-1 truncate text-sm text-gray-500">
              {posts[0].date}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between sm:ml-6 sm:mt-0 sm:flex-shrink-0 sm:justify-start">
            <span className="text-gray-600 text-sm">Version 3.1.0</span>

            <span className=" rounded-full bg-green-50 px-3 py-1.5 font-medium text-xs text-green-600 hover:bg-gray-100 ml-2">
              {posts[0].category.title}
            </span>
            <Menu as="div" className="relative ml-3 inline-block text-left">
              <div>
                <Menu.Button className="-my-2 flex items-center rounded-full bg-white p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex justify-between px-4 py-2 text-sm"
                          )}
                        >
                          <span>Edit</span>
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex justify-between px-4 py-2 text-sm"
                          )}
                        >
                          <span>Delete</span>
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      <div className="max-w-7xl px-4 py-2 m-4 bg-white rounded">
        <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16  border-gray-200 pt-1  lg:mx-0 lg:max-w-none lg:grid-cols-1">
          <article
            key={posts[0].id}
            className="flex flex-col items-start justify-between"
          >
            <div className="group relative">
              <div className="flex gap-2 my-2">
                <span className="items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  Improvements
                </span>
                <span className="items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                  Bug Fixes
                </span>
                <span className="items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                  Refactor
                </span>
                <span className="items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  New
                </span>
                <span className="items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  Maintainence
                </span>
              </div>

              <h3 className="text-md font-semibold leading-6 mt-4">
                This is rich text description of release notes
              </h3>

              <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                {posts[0].description}
              </p>
           
            </div>
          </article>
        </div>
      </div>
      <div className="max-w-7xl px-4 py-2 m-4 bg-white rounded">
        <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16  border-gray-200 pt-1  lg:mx-0 lg:max-w-none lg:grid-cols-1">
          <article
            key={posts[0].id}
            className="flex flex-col items-start justify-between"
          >
            <div className="group relative">

              <h3 className="text-md font-semibold leading-6">
                Release Tags
              </h3>


              <div className="flex gap-2 my-2">
                <span className="items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  Ios
                </span>
                <span className="items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  Android
                </span>
                <span className="items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  Web
                </span>
               
              </div>
             
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
