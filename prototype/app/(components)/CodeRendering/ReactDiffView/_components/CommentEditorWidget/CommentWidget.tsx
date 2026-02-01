"use client";

import MDEditor, { commands } from "@uiw/react-md-editor";
import { useState } from "react";

/**
 * Documentation:
 * 1. https://uiwjs.github.io/react-md-editor/
 *    Referenced for component configuration below.
 */

export default function CommentEditorWidget() {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor
        value={value}
        preview="edit"
        extraCommands={[commands.fullscreen]}
        onChange={(val) => setValue(val || "")}
      />
    </div>
  );
}
