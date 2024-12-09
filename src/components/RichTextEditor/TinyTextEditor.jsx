import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyTextEditor({
  setValue,
  initialValue = "",
  disabled = false,
}) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      //   console.log(editorRef.current.getContent());
      setValue(editorRef.current.getContent());
    }
  };

  return (
    <>
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        disabled={disabled}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue={initialValue}
        init={{
          height: 250,
          menubar: false,
          plugins: [
            "preview",
            "importcss",
            "searchreplace",
            "autolink",
            "autosave",
            "save",
            "directionality",
            "code",
            "visualblocks",
            "visualchars",
            "fullscreen",
            "image",
            "link",
            "media",
            "codesample",
            "table",
            "charmap",
            "pagebreak",
            "nonbreaking",
            "anchor",
            "insertdatetime",
            "advlist",
            "lists",
            "wordcount",
            "help",
            "charmap",
            "quickbars",
            "emoticons",
            "accordion",
          ],
          toolbar:
            "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onChange={log}
      />
      {/* <button onClick={log}>Log editor content</button> */}
    </>
  );
}
