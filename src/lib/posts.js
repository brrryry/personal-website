import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

const postsDirectory = path.join(process.cwd(), "src/posts");

export function getSortedPostsData() {
	// Get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory);
	const allPostsData = fileNames.map((fileName) => {
		// Remove ".md" from file name to get id
		const id = fileName.replace(/\.mdx$/, "");

		// Read markdown file as string
		const fullPath = path.join(postsDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, "utf8");

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		// Combine the data with the id
		return {
			id,
			...matterResult,
		};
	});
	// Sort posts by date
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});
}

export async function getPostFromId(id) {
	const allPosts = getSortedPostsData();
	const post = allPosts.find((post) => post.id === id);
	if (!post) {
		return {
			notFound: true,
		};
	}
	const fullPath = path.join(postsDirectory, `${id}.mdx`);
	const fileContent = fs.readFileSync(fullPath, "utf8");
	let { data, content } = matter(fileContent);
	return {
		id,
		data,
		content,
	};
}
