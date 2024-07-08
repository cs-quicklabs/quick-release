"use client";

import AlertModal from "./AlertModal";
import Loader from "./Loader";
import { handleTrancate, requestHandler, showNotification } from "@/Utils";
import { useProjectContext } from "@/app/context/ProjectContext";
import { useUserContext } from "@/app/context/UserContext";
import { setActiveProjectRequest } from "@/fetchHandlers/project";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Tooltip } from "flowbite-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import * as React from "react";
import { Fragment } from "react";
import { Oval } from "react-loader-spinner";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [isLogOut, setIsLogOut] = React.useState(false);
  const { loggedInUser, logout } = useUserContext();
  const {
    activeProjectId,
    list: projectList,
    map: projectMap,
    setActiveProject,
  } = useProjectContext();

  const [loading, setLoading] = React.useState({
    projectLoading: false,
    activeProjectLoading: false as any,
    activeUserLoading: true,
  });

  const projects = projectList.map((projectId) => projectMap[projectId]);

  const activeProject = async (projectId: string) => {
    await requestHandler(
      async () => await setActiveProjectRequest(projectId),
      null,
      (res: any) => {
        router.refresh();
        setActiveProject(projectId);
      },
      (errMessage: any) => {
        showNotification("error", errMessage);
      }
    )
  };

  const navigation = useMemo(() => {
    const nav = [
      {
        name: "Quick Release",
        href: "/allLogs",
        current: true,
      },
    ];

    if (activeProjectId) {
      nav.push({
        name: projectMap[activeProjectId]?.name as string,
        href: "/allLogs",
        current: false,
      });
    }

    return nav;
  }, [activeProjectId]);

  const { fullName, email } = useMemo(() => {
    const { firstName, lastName } = loggedInUser || {};
    const fullName = `${firstName || ""} ${lastName || ""}`.trim();
    let email = `${loggedInUser?.email || ""}`.trim();
    return { fullName, email };
  }, [loggedInUser]);

  return (
    <>
      <AlertModal
        show={open}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        okBtnClassName="bg-red-600 hover:bg-red-800"
        spinClassName="!fill-red-600"
        onClickOk={() => logout(setIsLogOut)}
        onClickCancel={() => setOpen(false)}
        loading={isLogOut}
      />
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }: any) => (
          <>
            <div className="px-2 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-around">
                <div className="flex items-center lg:hidden py-4">
                  {/* Mobile menu button*/}

                  <div className="flex flex-shrink-0 items-center gap-2">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                    <span className="text-white text-base rounded-md px-3 py-2 text-sm font-medium">
                      Quick Release
                    </span>
                  </div>
                </div>
                <div className="hidden lg:flex flex-1 items-center justify-center lg:items-stretch lg:justify-start py-2">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden lg:ml-6 lg:block">
                    <div className="flex items-center space-x-4">
                      {loading.activeProjectLoading ? (
                        <Oval
                          height={20}
                          width={20}
                          color="black"
                          secondaryColor="white"
                        />
                      ) : (
                        navigation.map((item) =>
                          item.name ? (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "text-white text-base"
                                  : "text-gray-300 hover:text-white hover:bg-gray-700",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {handleTrancate(item.name, 50)}
                            </Link>
                          ) : null
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                  <div className="w-full max-w-lg lg:max-w-xs">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>{" "}
                    <div className="relative">
                      <div className="hidden  pointer-events-none absolute inset-y-0 left-0 lg:flex items-center pl-3">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>{" "}
                      <input
                        id="search"
                        name="search"
                        className=" hidden lg:block w-full rounded-md border border-transparent bg-gray-700 py-1.5 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-white sm:text-sm"
                        placeholder="Search"
                        type="search"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
                  <button
                    type="button"
                    className="hidden lg:block flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">View notifications</span>{" "}
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                      ></path>
                    </svg>
                  </button>
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Disclosure.Button className="relative lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
                      <Menu.Button className="relative hidden lg:block flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={
                            (loggedInUser?.profilePicture as string)
                              ? (loggedInUser?.profilePicture as string)
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7QTsB1-eV2UCwBXvN3pxHXSd2JpPFAclggWqhjex2dQ&s"
                          }
                          alt={fullName}
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
                            <div className="pr-4 py-3 text-sm text-gray-900 dark:text-white">
                              <div className="flex justify-center items-center">
                                <div className="flex flex-col">
                                  {fullName.length > 18 ? (
                                    <Tooltip
                                      placement="left"
                                      content={fullName}
                                    >
                                      <p>{handleTrancate(fullName, 18)}</p>
                                    </Tooltip>
                                  ) : (
                                    <p>{fullName}</p>
                                  )}
                                  {email.length > 18 ? (
                                    <Tooltip placement="left" content={email}>
                                      <p className="font-medium">
                                        {handleTrancate(email, 18)}
                                      </p>
                                    </Tooltip>
                                  ) : (
                                    <p className="font-medium">{fullName}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          <Link
                            href="/create-project"
                            className="flex border items-center px-4 py-2 text-sm font-medium text-blue-600  bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"
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
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 7.8v8.4M7.8 12h8.4m4.8 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              ></path>
                            </svg>
                            Add new project
                          </Link>
                        </Menu.Item>

                        {loading.projectLoading ? (
                          <div className="flex items-center justify-center py-2">
                            <Oval
                              height={25}
                              width={25}
                              color="black"
                              secondaryColor="white"
                            />
                          </div>
                        ) : (
                          <>
                            {projects.map((item: any) => {
                              return (
                                <Menu.Item
                                  key={item.id}
                                  as="div"
                                  onClick={() => activeProject(item.id)}
                                  className="hover:bg-gray-100  cursor-pointer pl-4"
                                >
                                  <div
                                    className={`text-sm ${
                                      item.id === activeProjectId
                                        ? "flex items-center"
                                        : "flex items-center"
                                    }`}
                                  >
                                    <div className="flex py-2 w-fit">
                                      {item.name.length > 20 ? (
                                        <Tooltip
                                          placement="left"
                                          content={item.name}
                                        >
                                          {handleTrancate(item.name, 20)}
                                        </Tooltip>
                                      ) : (
                                        <p>{item.name}</p>
                                      )}
                                    </div>

                                    {item.id === activeProjectId ? (
                                      <div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="green"
                                          className="w-5 h-5 ml-1 text-center"
                                          aria-hidden="true"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                      </div>
                                    ) : null}
                                    {loading.activeProjectLoading[item.id] && (
                                      <div className="flex items-center justify-center py-2">
                                        <Oval
                                          height={25}
                                          width={25}
                                          color="black"
                                          secondaryColor="white"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </Menu.Item>
                              );
                            })}
                          </>
                        )}

                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/settings/profile/general"
                              // onClick={handleLogout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer border border-t-1"
                              )}
                            >
                              <div className="flex  items-center">
                                Profile Settings
                              </div>
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/settings/team/tags"
                              // onClick={handleLogout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer border border-t-1"
                              )}
                            >
                              <div className="flex  items-center">
                                Team Settings
                              </div>
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={() => setOpen(true)}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                              )}
                            >
                              {isLogOut ? (
                                <div className="flex  items-center gap-4">
                                  <span className="text-sm font-[490] text-black">
                                    Sign out
                                  </span>
                                  <Loader width="w-6" color="border-black" />
                                </div>
                              ) : (
                                <div className="flex  items-center font-[490] text-black text-sm">
                                  <span>Sign out</span>
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

            <Disclosure.Panel className="lg:hidden mt-5">
              <div className="space-y-2 px-2 py-3">
                {projects.map((item: any) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.id === activeProjectId
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={
                      item.id === activeProjectId ? "page" : undefined
                    }
                  >
                    {handleTrancate(item.name, 50)}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="flex items-center px-4 py-3 gap-4">
                <div>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={
                      (loggedInUser?.profilePicture as string)
                        ? (loggedInUser?.profilePicture as string)
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7QTsB1-eV2UCwBXvN3pxHXSd2JpPFAclggWqhjex2dQ&s"
                    }
                    alt={fullName}
                  />
                </div>
                <div className="flex flex-col text-white">
                  {fullName.length > 18 ? (
                    <Tooltip placement="left" content={fullName}>
                      <p className="text-base font-medium text-white">
                        {handleTrancate(fullName, 100)}
                      </p>
                    </Tooltip>
                  ) : (
                    <p className="text-base font-medium text-white">
                      {fullName}
                    </p>
                  )}
                  {email.length > 18 ? (
                    <Tooltip placement="left" content={email}>
                      <p className="text-sm font-medium text-gray-400">
                        {handleTrancate(email, 100)}
                      </p>
                    </Tooltip>
                  ) : (
                    <p className="text-sm font-medium text-gray-400">
                      {fullName}
                    </p>
                  )}
                </div>
              </div>
              <div className="px-2 py-3">
                <Link
                  href="/settings/profile"
                  // onClick={handleLogout}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <div className="flex items-center">
                    <Link href="/settings/profile">Profile Settings</Link>
                  </div>
                </Link>
                <a
                  onClick={() => setOpen(true)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <span>Sign out</span>
                </a>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
