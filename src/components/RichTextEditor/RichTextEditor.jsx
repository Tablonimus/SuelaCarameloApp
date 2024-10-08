import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function RichTextEditor() {
  const [value, setValue] = useState("");

  return (
    <ReactQuill
      className="bg-white "
      theme="snow"
      value={value}
      onChange={setValue}
    />
  );
}
