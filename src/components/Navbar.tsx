"use client";

import { WEB_DETAILS } from "@/Utils/constants";
import AlertModal from "./AlertModal";
import { handleTrancate } from "@/Utils";
import { useProjectContext } from "@/app/context/ProjectContext";
import { useUserContext } from "@/app/context/UserContext";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useMemo, useState, Fragment } from "react";
import CheckCircleIcon from "@/assets/icons/CheckCircleIcon";
import { classNames } from "@/lib/utils";
import Spin from "@/atoms/Spin";
import PublicNavbar from "./PublicNavbar";

type NavbarProps = {
  projectName?: string;
  projectImgUrl?: string;
  projectSlug?: string;
  setShowMenuNav?: any;
};

export function Navbar({
  projectName,
  projectImgUrl,
  projectSlug,
  setShowMenuNav,
}: NavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || null
  );
  const [open, setOpen] = useState(false);
  const [isLogOut, setIsLogOut] = useState(false);
  const { loggedInUser, logout } = useUserContext();
  const {
    activeProjectId,
    list: projectList,
    map: projectMap,
    setActiveProject,
  } = useProjectContext();

  const [loading, setLoading] = useState({
    projectLoading: false,
    activeProjectLoading: false as any,
    activeUserLoading: true,
  });

  const onSearch = (searchInput: string | null) => {
    // Set the search query when Enter key is pressed
    sessionStorage.clear();
    if (searchInput) router.push(`/allPosts?search=${searchInput}`);
    else router.push(`/allPosts`);
  };

  const projects = projectList.map((projectId) => projectMap[projectId]);

  const activeProject = async (projectId: string) => {
    setActiveProject(projectId);
  };

  const navigation = useMemo(() => {
    const nav = [];

    if (activeProjectId && loggedInUser && pathname !== "/create-team") {
      nav.push({
        id: "changelog",
        name: "Changelog",
        href: `/allLogs`,
        current: false,
      });

      nav.push({
        id: "feedback",
        name: "Feedback",
        href: "/allPosts",
        current: false,
      });
      nav.push({
        id: "roadmap",
        name: "Roadmap",
        href: "/roadmap",
        current: false,
      });
    } else if (!loggedInUser) {
      nav.push({
        id: "changelog",
        name: "Changelog",
        href: `/${projectSlug}/changelogs`,
        current: false,
      });

      nav.push({
        id: "feedback",
        name: "Feedback",
        href: `/${projectSlug}/feedbacks`,
        current: false,
      });
      nav.push({
        id: "roadmap",
        name: "Roadmap",
        href: `/${projectSlug}/roadmap`,
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

  const teamName = projectName
    ? projectName
    : pathname === "/create-team" || !activeProjectId
    ? WEB_DETAILS.name
    : projectMap[activeProjectId]?.name;

  const logoSrc = projectImgUrl
    ? projectImgUrl
    : projectMap[activeProjectId!]?.projectImgUrl && pathname !== "/create-team"
    ? projectMap[activeProjectId!]?.projectImgUrl
    : WEB_DETAILS.logo;

  if (!loggedInUser) {
    return (
      <PublicNavbar
        pathname={pathname}
        teamName={teamName || ""}
        projectSlug={projectSlug}
      />
    );
  }

  return (
    <>
      <AlertModal
        show={open}
        title="Logout"
        message="Are you sure you want to logout?"
        okBtnClassName="bg-red-600 hover:bg-red-800"
        spinClassName="fill-red-600!"
        onClickOk={() => logout(setIsLogOut)}
        onClickCancel={() => setOpen(false)}
        loading={isLogOut}
      />
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }: any) => (
          <>
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between">
                <div className="flex justify-between w-full items-center lg:hidden py-2 lg:py-4">
                  {/* Mobile menu button*/}
                  <Link href={projectSlug ? `/${projectSlug}/changelogs` : `/`}>
                    <div className="flex shrink-0 items-center gap-2">
                      <Image
                        className="h-8 w-auto"
                        src={logoSrc!}
                        alt="Your Company"
                        width={40}
                        height={40}
                      />
                      <span className="text-white  rounded-md px-3 py-2 text-sm font-medium">
                        {teamName}
                      </span>
                    </div>
                  </Link>
                  <div>
                    <DisclosureButton
                      onClick={() => setShowMenuNav && setShowMenuNav(!open)}
                      className="relative lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only" id="Open-main-menu">
                        {"Open main menu"}
                      </span>
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
                    </DisclosureButton>
                  </div>
                </div>
                <div className="hidden lg:flex flex-1 items-center lg:items-stretch lg:justify-start py-2">
                  <Link href={projectSlug ? `/${projectSlug}/changelogs` : `/`}>
                    <div className="flex shrink-0 items-center gap-2">
                      <Image
                        className="h-8 w-auto"
                        src={logoSrc!}
                        alt="Your Company"
                        width={40}
                        height={40}
                      />
                      <h1 className="lg:ml-4 text-white font-extrabold font-mono py-2">
                        {teamName}
                      </h1>
                    </div>
                  </Link>
                  <div className="hidden lg:ml-6 lg:block">
                    <div className="flex items-center space-x-2">
                      {loading.activeProjectLoading ? (
                        <Spin className="h-[20px] w-[20px]" />
                      ) : (
                        navigation.map((item) =>
                          item.name ? (
                            <Link
                              key={item.name}
                              href={item.href}
                              id={item.id}
                              className={classNames(
                                item.current
                                  ? "text-white text-base"
                                  : "text-gray-300 hover:text-white hover:bg-gray-700",
                                pathname.includes(item.href) &&
                                  !item.current &&
                                  "text-white bg-gray-700",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                              onClick={() => sessionStorage.clear()}
                            >
                              {handleTrancate(item.name, 50)}
                            </Link>
                          ) : null
                        )
                      )}
                    </div>
                  </div>
                </div>
                {loggedInUser && pathname !== "/create-project" && (
                  <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                    <div className="w-full max-w-lg lg:max-w-xs">
                      <label htmlFor="search" className="sr-only">
                        Search by feedbacks
                      </label>{" "}
                      <div>
                        <div className="relative">
                          {/* Magnifying Glass Icon */}
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon
                              className="h-5 w-5 text-gray-400 hidden lg:block"
                              aria-hidden="true"
                            />
                          </div>

                          {/* Input Field */}
                          <input
                            id="search"
                            name="search"
                            onKeyDown={(e) =>
                              e.key === "Enter" && onSearch(searchQuery)
                            } // Trigger onSearch when Enter is pressed
                            value={searchQuery || ""}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="hidden lg:block w-full rounded-md border border-transparent bg-gray-700 py-1.5 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:outline-hidden focus:ring-white sm:text-sm"
                            placeholder="Search feedbacks"
                          />

                          {/* Clear Button */}
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => {
                                setSearchQuery(""); // Clear the input field
                                onSearch(""); // Call the onSearch function
                              }}
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                              aria-label="Clear search"
                            >
                              <XMarkIcon className="h-5 w-5 text-gray-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {loggedInUser && (
                  <div className=" hidden lg:flex absolute inset-y-0 right-0  items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
                    {/* <button
                      type="button"
                      className="hidden lg:block shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">{"View notifications"}</span>{" "}
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <MenuButton className="relative  lg:block flex rounded-full bg-gray-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only" id="open-user-menu">
                            {"Open user menu"}
                          </span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={
                              (loggedInUser?.profilePicture as string)
                                ? (loggedInUser?.profilePicture as string)
                                : WEB_DETAILS?.avtar
                            }
                            alt={fullName}
                            width={32}
                            height={32}
                          />
                        </MenuButton>
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
                        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg   focus:outline-hidden">
                          <MenuItem>
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
                                      <p className="font-medium">{email}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/create-team"
                              className="flex border items-center px-4 py-2 text-sm font-medium text-blue-600  bg-gray-50  hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"
                            >
                              <PlusCircleIcon className="h-5 w-5 mr-2" />
                              {"Add new team"}
                            </Link>
                          </MenuItem>

                          {loading.projectLoading ? (
                            <div className="flex items-center justify-center py-2">
                              <Spin className="h-[25px] w-[25px]" />
                            </div>
                          ) : (
                            <div className="max-h-64 flex flex-col overflow-hidden">
                              <div className="max-h-full overflow-y-auto">
                                {projects.map((item: any) => {
                                  return (
                                    <MenuItem
                                      key={item.id}
                                      as="div"
                                      onClick={() => {
                                        activeProject(item.id);
                                        router.push("/");
                                      }}
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
                                          <div className="ml-1">
                                            <CheckCircleIcon className="w-5 h-5" />
                                          </div>
                                        ) : null}
                                        {loading.activeProjectLoading[
                                          item.id
                                        ] && (
                                          <div className="flex items-center justify-center py-2">
                                            <Spin className="h-[25px] w-[25px]" />
                                          </div>
                                        )}
                                      </div>
                                    </MenuItem>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          <MenuItem>
                            {({ active }) => (
                              <Link
                                href="/settings/account/tags"
                                // onClick={handleLogout}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer border-t"
                                )}
                              >
                                <div
                                  className="flex  items-center"
                                  id="account-settings"
                                >
                                  {"Account Settings"}
                                </div>
                              </Link>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <Link
                                href="/settings/profile/general"
                                // onClick={handleLogout}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer border-t"
                                )}
                              >
                                <div
                                  className="flex  items-center"
                                  id="profile-settings"
                                >
                                  {"Profile Settings"}
                                </div>
                              </Link>
                            )}
                          </MenuItem>
                          {projectList.length > 0 && (
                            <>
                              <MenuItem>
                                {({ active }) => (
                                  <Link
                                    href="/settings/team/general"
                                    // onClick={handleLogout}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer border-t"
                                    )}
                                  >
                                    <div
                                      className="flex  items-center"
                                      id="team-setting"
                                    >
                                      {"Team Settings"}
                                    </div>
                                  </Link>
                                )}
                              </MenuItem>
                              <div
                                className={
                                  "block px-4 py-2 text-sm text-gray-500 font-medium border-t"
                                }
                              >
                                <div
                                  className="flex  items-center"
                                  id="support-setting"
                                >
                                  {"Support"}
                                </div>
                              </div>
                              <MenuItem>
                                {({ active }) => (
                                  <Link
                                    href={`/${
                                      projectMap[activeProjectId!]?.slug
                                    }/changelogs`}
                                    // onClick={handleLogout}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer border-t"
                                    )}
                                  >
                                    <div
                                      className="flex  items-center"
                                      id="public-changelog"
                                    >
                                      {"Changelogs"}
                                    </div>
                                  </Link>
                                )}
                              </MenuItem>
                              <MenuItem>
                                {({ active }) => (
                                  <Link
                                    href={`/${
                                      projectMap[activeProjectId!]?.slug
                                    }/feedbacks`}
                                    // onClick={handleLogout}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                    )}
                                  >
                                    <div
                                      className="flex  items-center"
                                      id="public-feedbacks"
                                    >
                                      {"Feedbacks"}
                                    </div>
                                  </Link>
                                )}
                              </MenuItem>
                              <MenuItem>
                                {({ active }) => (
                                  <Link
                                    href={`/${
                                      projectMap[activeProjectId!]?.slug
                                    }/roadmap`}
                                    // onClick={handleLogout}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                    )}
                                  >
                                    <div
                                      className="flex  items-center"
                                      id="public-roadmap"
                                    >
                                      {"Roadmap"}
                                    </div>
                                  </Link>
                                )}
                              </MenuItem>
                            </>
                          )}
                          <MenuItem>
                            {({ active }) => (
                              <a
                                onClick={() => setOpen(true)}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer border-t"
                                )}
                              >
                                {isLogOut ? (
                                  <div className="flex  items-center gap-4">
                                    <span className="text-sm font-[490] text-black">
                                      {"Logout"}
                                    </span>
                                    <Spin className="h-[25px]" />
                                  </div>
                                ) : (
                                  <div className="flex  items-center font-[490] text-black text-sm">
                                    <span>{"Logout"}</span>
                                  </div>
                                )}
                              </a>
                            )}
                          </MenuItem>
                        </MenuItems>
                      </Transition>
                    </Menu>
                  </div>
                )}
              </div>
            </div>

            {loggedInUser ? (
              <DisclosurePanel className="lg:hidden mt-5">
                <div className="space-y-2 px-2 py-3">
                  {projects.map((item: any) => (
                    <DisclosureButton
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
                    </DisclosureButton>
                  ))}
                </div>
                <div className="flex items-center px-4 py-3 gap-4">
                  <div>
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={
                        (loggedInUser?.profilePicture as string)
                          ? (loggedInUser?.profilePicture as string)
                          : WEB_DETAILS.avtar
                      }
                      alt={fullName}
                      width={40}
                      height={40}
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
                    href="/settings/account/tags"
                    // onClick={handleLogout}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    <div className="flex items-center">
                      <Link href="/settings/account/tags">
                        {"Account Settings"}
                      </Link>
                    </div>
                  </Link>
                  <Link
                    href="/settings/profile/general"
                    // onClick={handleLogout}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    <div className="flex items-center">
                      <Link href="/settings/profile/general">
                        {"Profile Settings"}
                      </Link>
                    </div>
                  </Link>
                  <Link
                    href="/settings/team/general"
                    // onClick={handleLogout}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    <div className="flex items-center">
                      <Link href="/settings/team/general">
                        {"Team Settings"}
                      </Link>
                    </div>
                  </Link>
                  <Link
                    href="#"
                    // onClick={handleLogout}
                    className="block rounded-md px-3 py-2 text-base text-white font-medium bg-gray-700"
                  >
                    <div className="flex items-center">{"Support"}</div>
                  </Link>
                  <Link
                    href={`/${projectMap[activeProjectId!]?.slug}/changelogs`}
                    // onClick={handleLogout}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    <div className="flex items-center">{"Changelogs"}</div>
                  </Link>
                  <Link
                    href={`/${projectMap[activeProjectId!]?.slug}/feedbacks`}
                    // onClick={handleLogout}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    <div className="flex items-center">{"Feedbacks"}</div>
                  </Link>
                  <Link
                    href={`/${projectMap[activeProjectId!]?.slug}/roadmap`}
                    // onClick={handleLogout}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    <div className="flex items-center">{"Roadmap"}</div>
                  </Link>
                  <a
                    onClick={() => setOpen(true)}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    <span>Logout</span>
                  </a>
                </div>
              </DisclosurePanel>
            ) : (
              <DisclosurePanel className="lg:hidden mt-5">
                <div className="space-y-2 px-2 py-3">
                  {navigation.map((item: any) => (
                    <DisclosureButton
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        pathname.includes(item.href)
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                    >
                      {handleTrancate(item.name, 50)}
                    </DisclosureButton>
                  ))}
                </div>
              </DisclosurePanel>
            )}
          </>
        )}
      </Disclosure>
    </>
  );
}
