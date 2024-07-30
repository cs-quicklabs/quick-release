"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Oval } from "react-loader-spinner";

interface ModalProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
  buttonText: string;
  title?: string;
  onClick?: any;
  loading?: boolean;
}

export default function Modal({
  open,
  setIsOpen,
  children,
  buttonText,
  title,
  onClick,
  loading,
}: ModalProps) {
  function closeModal() {
    setIsOpen(!open);
  }

  function openModal() {
    setIsOpen(open);
  }

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white pt-2  pb-6 px-3 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-md font-medium leading-6 "
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-black-500"> {title}</p>{" "}
                      <div>
                        <XMarkIcon
                          className="w-5 h-10 font-black cursor-pointer"
                          onClick={closeModal}
                        />
                      </div>
                    </div>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{children}</p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      disabled={loading}
                      className="inline-flex  text-white justify-center rounded-md border border-transparent bg-blue-600 px-2 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={onClick}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-4">
                          <Oval
                            height={25}
                            width={25}
                            color="black"
                            secondaryColor="white"
                          />
                        </div>
                      ) : (
                        buttonText
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
