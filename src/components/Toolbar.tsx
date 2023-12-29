"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading1
} from "lucide-react";
import { Toggle } from "../components/ui/toggle";

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
//   if (!editor) {
//     return null;
//   }

  return (
    <div className="border border-input bg-transparent rounded-md">
      <Toggle
        size="sm"
        pressed={editor?.isActive("heading")}
        onPressedChange={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor?.isActive("bold")}
        onPressedChange={() =>
          editor?.chain().focus().toggleBold().run()
        }
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor?.isActive("italic")}
        onPressedChange={() =>
          editor?.chain().focus().toggleItalic().run()
        }
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor?.isActive("strike")}
        onPressedChange={() =>
          editor?.chain().focus().toggleStrike().run()
        }
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor?.isActive("bulletList")}
        onPressedChange={() =>
          editor?.chain().focus().toggleBulletList().run()
        }
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor?.isActive("orderedList")}
        onPressedChange={() =>
          editor?.chain().focus().toggleOrderedList().run()
        }
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  );
}
