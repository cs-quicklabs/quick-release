"use client";

import * as React from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";

import Loader from "./Loader";
import Link from "next/link";
import axios from "axios";

const navigation = [
  { name: "Quick Release", href: "/allLogs", current: true },
  // { name: "Projects", href: "/projects", current: true },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Navbar() {
  const router = useRouter();
  const { data } = useSession();
  const pathname = usePathname();
  const params = useParams();
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const userId = (data?.user as { id: string })?.id;
  console.log(data, "data");

  const getProjects = async () => {
    setLoading(true);
    try {
      const projects = await axios.get(`/api/get-projects/${userId}`);
      setProjects(projects.data);
    } catch (err) {
      console.log(err, "error");
    }
    setLoading(false);
  };
  console.log(projects, "projects");
  React.useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        await getProjects();
      }
    };

    fetchData();
  }, [userId]);

  const [loader, setLoader] = React.useState(false);
  const handleLogout = async () => {
    setLoader(true);
    try {
      const data = await signOut({
        redirect: false,
      });
      setLoader(false);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  };
  return (
    <>
      {pathname === "/" ||
      pathname === "/register" ||
      pathname === "/forget-password" ||
      pathname === `/reset-password/${params.token}` ? null : (
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }: any) => (
            <>
              <div className="px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-around">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                <div className="font-medium truncate">
                                  {data?.user?.email}
                                </div>
                              </div>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            <Link
                              href="/create-project"
                              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 border-t border-gray-200 bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"
                            >
                              <svg
                                className="w-4 h-4 me-1"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M12 7.8v8.4M7.8 12h8.4m4.8 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                ></path>
                              </svg>
                              Add new project
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <ul
                              className="py-2 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="dropdownInformationButton"
                            >
                              {projects.map((item: any) => {
                                return (
                                  <li>
                                    <a
                                      href="#"
                                      className="flex  px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                      {item.name}
                                    </a>
                                  </li>
                                );
                              })}{" "}
                            </ul>
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={handleLogout}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                )}
                              >
                                {loader ? (
                                  <div className="flex  items-center gap-4">
                                    <span className="text-l font-bold">
                                      Sign out
                                    </span>
                                    <Loader width="w-6" color="border-black" />
                                  </div>
                                ) : (
                                  <div className="flex  items-center">
                                    <span className="text-l font-bold">
                                      Sign out
                                    </span>
                                  </div>
                                )}
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      )}
    </>
  );
}
