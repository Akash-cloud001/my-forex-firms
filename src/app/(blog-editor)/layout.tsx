import React from "react";

const BlogEditorLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className="bg-background min-h-screen w-full">
      {children}
    </section>
  );
};

export default BlogEditorLayout;


