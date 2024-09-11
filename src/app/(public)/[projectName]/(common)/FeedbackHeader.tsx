"use client";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { Button } from "@/atoms/button";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function FeedbackHeader(
  {title}: {title: string}
) {
  const { setFeedbackSideNav } = useFeedbackPostContext();
  return (
    <div
      className="md:flex md:items-center md:justify-between py-2 px-2 sm:px-4 sm:py-4 md:px-6"
      data-svelte-h="svelte-1a2r45a"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="xl:hidden">
            <Button
              className="rounded-full text-gray-400 hover:text-gray-600"
              variant="default"
              size="icon"
              onClick={() => setFeedbackSideNav(true)}
            >
              <Bars3Icon name="Menu options" className="h-5 w-5" />
            </Button>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}