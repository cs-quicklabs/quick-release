import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/atoms/form";
import Select from "react-select";
import { Controller } from "react-hook-form";
import DatePicker from "@/atoms/DatePicker";
import moment from "moment";
import ReleaseTagSelectMenu from "@/components/ReleaseTagSelectMenu";
import { FeedbackStatus, FeedbackVisibilityStatus } from "@/Utils/constants";
import FeedbackBoardselectMenu from "@/components/FeedbackBoardSelectMenu";
import { Input } from "@/atoms/input";
import dynamic from "next/dynamic";
import { DropDownOptionType } from "@/interfaces";

const RichTextEditor = dynamic(() => import("@/atoms/RichTextEditor"), {
  ssr: true,
});

type FeedbackFormProps = {
  id?: string;
  form: any;
  defaultFeedbackBoardOption: DropDownOptionType;
};

export default function FeedbackForm({
  id,
  form,
  defaultFeedbackBoardOption,
}: FeedbackFormProps) {
  const FeedbackVisibilityStatusOptions = Object.keys(
    FeedbackVisibilityStatus
  ).map((key) => {
    return {
      value: FeedbackVisibilityStatus[key].id,
      label: FeedbackVisibilityStatus[key].title,
    };
  });

  const FeedbackStatusOptions = Object.keys(FeedbackStatus).map((key) => {
    return {
      value: FeedbackStatus[key].id,
      label: FeedbackStatus[key].title,
    };
  });

  return (
    <>
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Title"}</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter feedback post title"
                  {...field}
                  id="title"
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
      </div>
      <div className="flex justify-between gap-12">
        <FormField
          control={form.control}
          name="feedbackBoard"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>{"Feedback Board"}</FormLabel>
              <FormControl>
                <Controller
                  name="feedbackBoard"
                  control={form.control}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <FeedbackBoardselectMenu
                      id="feedbackBoard-select"
                      className="basic-single max-w-[32rem]"
                      classNamePrefix="select"
                      name={name}
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value.value ? value : defaultFeedbackBoardOption}
                    />
                  )}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>{"Status"}</FormLabel>
              <FormControl>
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <Select
                      id="feedback-status-select"
                      className="basic-single max-w-[32rem]"
                      classNamePrefix="select"
                      name={name}
                      onBlur={onBlur}
                      onChange={onChange}
                      value={
                        value.label !== "" ? value : FeedbackStatusOptions[0]
                      }
                      options={FeedbackStatusOptions}
                    />
                  )}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
      </div>
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>{"Description"}</FormLabel>
              <FormControl>
                <RichTextEditor
                  placeholder="Enter feedback post description"
                  id="description"
                  value={value}
                  onChange={onChange}
                  onModal="Feedbacks"
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
      </div>
      {id !== "add" && (
        <>
          <div className="flex justify-between gap-12">
            <FormField
              control={form.control}
              name="visibilityStatus"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>{"Status Visibility"}</FormLabel>
                  <FormControl>
                    <Controller
                      name="visibilityStatus"
                      control={form.control}
                      render={({
                        field: { onChange, onBlur, value, name },
                      }) => (
                        <Select
                          id="visibility-status-select"
                          className="basic-single max-w-[32rem]"
                          classNamePrefix="select"
                          name={name}
                          onBlur={onBlur}
                          onChange={onChange}
                          value={value}
                          options={FeedbackVisibilityStatusOptions}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="releaseETA"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>{"ETA"}</FormLabel>
                  <FormControl>
                    <DatePicker
                      id="release-eta"
                      className="justify-start bg-white border border-gray-300"
                      {...field}
                      onChange={(selectedDate) =>
                        field.onChange(selectedDate ?? moment().toDate())
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="releaseTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Release Tags (Optional)"}</FormLabel>
                  <FormControl>
                    <Controller
                      name="releaseTags"
                      control={form.control}
                      render={({
                        field: { onChange, onBlur, value, name },
                      }) => (
                        <ReleaseTagSelectMenu
                          id="release-tags-select"
                          className="basic-multi-select max-w-5xl"
                          classNamePrefix="select"
                          isMulti
                          name={name}
                          onBlur={onBlur}
                          onChange={onChange}
                          value={value}
                          menuPlacement="top"
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </>
  );
}
