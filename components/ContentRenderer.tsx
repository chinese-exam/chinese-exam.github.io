import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import type { ContentBlock } from "@/types/paper";

type ContentRendererProps = {
  content?: ContentBlock;
  className?: string;
};

/**
 * Helper to flatten nested ContentBlock arrays.
 */
function flattenContent(content: ContentBlock): (string | Exclude<ContentBlock, string | any[]>)[] {
  if (!content) return [];
  if (Array.isArray(content)) {
    return content.flatMap(flattenContent);
  }
  return [content];
}

const ContentRenderer = React.memo(function ContentRenderer({
  content,
  className = "",
}: ContentRendererProps) {
  if (!content) return null;

  const htmlContent = useMemo(() => {
    const flat = flattenContent(content);
    const parts: string[] = [];
    let currentPara: string[] = [];

    const flushPara = () => {
      if (currentPara.length > 0) {
        parts.push(`<p class="leading-relaxed">${currentPara.join("")}</p>`);
        currentPara = [];
      }
    };

    flat.forEach((item) => {
      if (!item) return;

      if (typeof item === "string") {
        currentPara.push(item.replace(/\n/g, "<br/>"));
      } else {
        switch (item.type) {
          case "blank":
            currentPara.push(
              '<span class="mx-1 inline-block h-5 w-12 border-b-2 border-gray-400 align-bottom"></span>'
            );
            break;
          case "break":
            flushPara();
            break;
          case "math":
            try {
              const mathHtml = katex.renderToString(item.expression, {
                throwOnError: false,
                displayMode: !item.inline,
              });
              if (item.inline) {
                currentPara.push(mathHtml);
              } else {
                flushPara();
                parts.push(
                  `<div class="my-3 w-full overflow-x-auto text-center">${mathHtml}</div>`
                );
              }
            } catch (e) {
              console.error("KaTeX error:", e);
              currentPara.push(
                `<span class="text-red-500 font-mono">${item.expression}</span>`
              );
            }
            break;
          case "image":
            const imgHtml = `<img src="${item.src}" width="${item.width}" height="${item.height}" class="mx-auto h-auto max-w-full rounded-lg shadow-sm" alt="Question content" />`;
            if (item.inline) {
              currentPara.push(imgHtml);
            } else {
              flushPara();
              parts.push(`<div class="my-4 block w-full">${imgHtml}</div>`);
            }
            break;
        }
      }
    });

    flushPara();
    return parts.join("");
  }, [content]);

  return (
    <div
      className={`content-renderer space-y-2 ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
});

export default ContentRenderer;
