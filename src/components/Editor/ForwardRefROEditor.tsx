"use client";
import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { forwardRef } from "react";

const Editor = dynamic(() => import("./InitializedReadonlyEditor"), {
  ssr: false,
});

export const ForwardRefROEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />
);

ForwardRefROEditor.displayName = "ForwardRefROEditor";
