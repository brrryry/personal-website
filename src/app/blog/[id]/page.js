import React from "react";
import ReactMarkdown from "react-markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostFromId } from "@/lib/posts";
import { LatexWrapper } from "@/components/LatexWrapper";
import NotFound from "@/app/[...not_found]/page";

import { InlineMath, BlockMath } from "react-katex";

export default async function BlogPost({ params }) {
	//get the files from posts/params.id

	const { content, data, notFound } = await getPostFromId(params.id);

	if (notFound) {
		return <NotFound />;
	}

	return (
		<article>
			- - -<h3>{data.title}</h3>
			<p>created on {data.date}</p>
			<p>
				tags: [
				{data.tags.map((tag, i) => {
					return (
						<a href={`/blog/tag/${tag}`} key={tag}>
							{i < data.tags.length - 1 ? tag + ", " : tag}
						</a>
					);
				})}
				] <br />- - -
			</p>
			<MDXRemote source={content} components={{LatexWrapper}}/>
		</article>
	);
}