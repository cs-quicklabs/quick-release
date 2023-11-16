import { Link } from "@remix-run/react";

const Sidebar = () => {
  return (
    <aside className="py-6 px-2 lg:py-0 lg:px-0 lg:col-span-2 w-72 ml-8">
      <nav className="lg:space-y-1 space-x-1 lg:space-x-0 flex justify-between lg:block">
        <Link
          className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold bg-gray-50 text-indigo-600  "
          aria-current="page"
          to="/profile"
        >
          <svg
            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span className="truncate">Profile</span>
        </Link>
        <Link
          data-cy="change-password"
          className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold bg-white hover:bg-gray-50 "
          aria-current="page"
          to="/update-password"
        >
          <svg
            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600 hover:text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
            ></path>
          </svg>
          <span className="truncate">Change Password</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
