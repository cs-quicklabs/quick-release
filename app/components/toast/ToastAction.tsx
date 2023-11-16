import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function ToastAction(props: any) {
  const [show, setShow] = useState(true);

  // const navigate = useNavigate();

  const redirectToPath = () => {
    // return navigate(`${props?.actionPath}`);
  };

  return (
    <>
      <Transition
        show={show}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 justify-start">
            <p className="text-sm font-medium text-white">{props?.message}</p>
            <span
              onClick={redirectToPath}
              className="bg-transparent rounded-md text-sm font-bold italic text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              {props?.actionLabel}
            </span>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-transparent rounded-md inline-flex text-gray-200 hover:white focus:outline-none"
              onClick={() => {
                setShow(false);
              }}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Transition>
    </>
  );
}
