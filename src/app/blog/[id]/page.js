// @refresh reset
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostFromId } from "@/lib/posts";

import { LatexWrapper } from "@/components/LatexWrapper";
import { BlogImage } from "@/components/BlogImage";
import { BlogList } from "@/components/BlogList";
import { BlogCode } from "@/components/BlogCode";

import NotFound from "@/app/[...not_found]/page";

import { BlogComments } from "@/components/BlogComments";

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

  return (
    <div className="max-w-4xl mx-auto px-4">
      <article className="min-w-0 max-w-4xl">
        - - -<h3>{data.title}</h3>
        <p>originally created on {data.date}</p>
        {data.updated && <p>updated on {data.updated} </p>}
        <p>
          tags: [
          {data.tags.sort().map((tag, i) => {
            return (
              <a href={`/blog/tag/${tag}`} key={tag}>
                {i < data.tags.length - 1 ? tag + ", " : tag}
              </a>
            );
          })}
          ] <br />- - -
        </p>
        <MDXRemote
          source={content}
          components={{ LatexWrapper, BlogImage, BlogList, BlogCode }}
        />
      </article>

      <BlogComments blogId={params.id} />
    </div>
  );
}
