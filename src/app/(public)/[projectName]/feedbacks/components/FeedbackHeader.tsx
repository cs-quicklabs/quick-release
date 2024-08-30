"use client";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { Button } from "@/atoms/button";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function FeedbackHeader() {
  const { setFeedbackSideNav } = useFeedbackPostContext();
    return (
        <div
        className="md:flex md:items-center md:justify-between py-4 px-6"
        data-svelte-h="svelte-1a2r45a"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center">
            <div className=" mr-1 hidden sm:block xl:hidden">
              <Button
                className="rounded-full text-gray-400 hover:text-gray-600"
                variant="default"
                size="icon"
                onClick={() => setFeedbackSideNav(true)}
              >
                <Bars3Icon name="Menu options" className="h-5 w-5" />
              </Button>
            </div>

            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {"Feedbacks"}
            </h2>
          </div>
        </div>

        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link href="#">
            {/* <button
              id="add-feedback"
              type="button"
              className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {"Add New"}
            </button> */}
          </Link>
        </div>
      </div>
    )
}