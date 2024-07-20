import React from "react";
import ReactMarkdown from "react-markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostFromId } from "@/lib/posts";
import Navbar from "@/components/Navbar";
import NotFound from "@/app/[...not_found]/page";

export default async function BlogPost({ params }) {
	//get the files from posts/params.id
	const { content, id, data, notFound } = await getPostFromId(params.id);

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
					return i < data.tags.length - 1 ? tag + ", " : tag;
				})}
				] <br />- - -
			</p>
			<MDXRemote source={content} />
		</article>
	);
}
