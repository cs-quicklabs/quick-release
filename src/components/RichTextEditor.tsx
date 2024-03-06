"use client";

import dynamic from "next/dynamic";
import React from "react";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type RichTextEditorProps = {
  placeholder?: string;
  value?: string;
  onChange?(value: string): void,
};

const RichTextEditor = ({
  placeholder = "",
  value = "",
  onChange
}: RichTextEditorProps) => {
  return (
    <ReactQuill
      theme="snow"
      className="custom-input-editor w-full rounded-md disabled:cursor-not-allowed disabled:opacity-50"
      onChange={onChange}
      value={value}
      modules={RichTextEditor.modules}
      formats={RichTextEditor.formats}
      placeholder={placeholder}
    />
  );
};

export default RichTextEditor;

RichTextEditor.modules = {
  toolbar: [
    [{ "header": "1" }, { "header": "2" }, { "font": [] }],
    [{ size: [] }],
    ["bold", "italic", "underline"],
    [{ "list": "ordered" }, { "list": "bullet" }],
    ["link"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

RichTextEditor.formats = [
  "header", "font", "size",
  "bold", "italic", "underline", "strike", "blockquote",
  "list", "bullet", "indent",
  "link",
];