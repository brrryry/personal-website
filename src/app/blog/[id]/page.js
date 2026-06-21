// @refresh reset
import { MDXRemote } from "next-mdx-remote/rsc";

import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { getPostFromId } from "@/lib/posts";

import { LatexWrapper } from "@/components/LatexWrapper";
import { BlogImage } from "@/components/BlogImage";
import { BlogList } from "@/components/BlogList";
import { BlogCode } from "@/components/BlogCode";

import NotFound from "@/app/[...not_found]/page";

//import code highlighting css
import "@/../public/styles/atom-one-dark.css";

export async function generateMetadata({ params }) {
  const { data } = await getPostFromId(params.id);

  if (!data) {
    return {
      title: "blog post not found",
      description: "the blog post you are looking for does not exist.",
    };
  }

  return {
    title: `bryan blog: ${data.title}`,
    description: data.description,
  };
}

export default async function BlogPost({ params }) {
  //get the files from posts/params.id

  const { content, data, notFound } = await getPostFromId(params.id);

  if (notFound) {
    return <NotFound />;
  }

  // set title for the page
  if (typeof document !== "undefined") {
    document.querySelector("h1").innerText = data.title;
  }

  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [[rehypeKatex, { output: "mathml" }]],
      format: "mdx",
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up delay-100">
      <article className="min-w-0 max-w-full">
        <div className="space-y-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-purple-900 dark:text-purple-100">
            {data.title}
          </h1>

          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-purple-600 dark:text-purple-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                />
              </svg>
              Created on {data.date}
            </span>
            {data.updated && (
              <span className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-purple-600 dark:text-purple-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Updated on {data.updated}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {data.tags.sort().map((tag) => (
              <a
                href={`/blog?tag=${tag}`}
                key={tag}
                className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-800 dark:text-purple-200 border border-purple-500/10 transition-colors uppercase tracking-wider"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>

        <hr className="border-purple-500/10 mb-6" />

        <div className="max-w-full">
          <MDXRemote
            source={content}
            components={{
              LatexWrapper,
              BlogImage,
              BlogList,
              BlogCode,
              table: (props) => (
                <div className="overflow-x-auto max-w-full">
                  <table {...props} />
                </div>
              ),
            }}
            options={mdxOptions}
          />
        </div>
      </article>
    </div>
  );
}
