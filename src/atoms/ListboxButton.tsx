import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "@/lib/utils";
import { Oval } from "react-loader-spinner";

export type ListboxOption = {
  id: string;
  title: string;
  description: string;
  btnText: string;
};

interface IListboxButtonProps {
  selected: ListboxOption;
  options: ListboxOption[];
  onChange?(value: ListboxOption): void;
  btnType?: "button" | "submit" | "reset" | undefined;
  loading?: boolean;
  disabled?: boolean;
}

const ListboxButton: React.FC<IListboxButtonProps> = ({ selected, options, onChange, btnType, loading = false, disabled = false }) => {
  return (
    <Listbox value={selected} onChange={onChange} disabled={disabled}>
      {({ open }) => (
        <>
          <div className="relative">
            <div className="inline-flex divide-x divide-indigo-700 rounded-md shadow-sm">
              <button
                className="inline-flex items-center gap-x-1.5 rounded-l-md bg-indigo-600 px-3 py-2 text-white shadow-sm"
                type={btnType}
                disabled={disabled}
              >
                {
                  loading ? (
                    <div className="flex items-center justify-center gap-4">
                      <Oval
                        height={25}
                        width={25}
                        color="black"
                        secondaryColor="white"
                      />
                    </div>
                  )
                    : <CheckIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                }

                <p className="text-sm font-semibold">{selected.btnText}</p>
              </button>

              <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-indigo-600 p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50">
                <span className="sr-only">Change published status</span>
                <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </Listbox.Button>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"

            >
              <Listbox.Options
                className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"

              >
                {options.map((option) => (
                  <Listbox.Option
                    key={option.title}
                    className={
                      classNames(
                        "text-gray-900",
                        "cursor-default select-none p-4 text-sm"
                      )
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p className={selected ? "font-semibold" : "font-normal"}>{option.title}</p>
                          {selected ? (
                            <span className={"text-indigo-600"}>
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </div>

                        <p className={classNames("text-gray-500", "mt-2")}>
                          {option.description}
                        </p>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default ListboxButton;
