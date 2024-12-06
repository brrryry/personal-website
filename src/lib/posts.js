import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/posts");

export function getSortedPostsData(tag = "") {
  // Get file names under /posts
  let fileNames = fs.readdirSync(postsDirectory);

  if (process.env.NODE_ENV === "development") {
    const morePosts = fs.readdirSync(postsDirectory + "/drafts");
    fileNames = fileNames.concat(morePosts.map((post) => "drafts/" + post));
  }

  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      let id = fileName.replace(/\.mdx$/, "").replace(/drafts\//, "");

      // Read markdown file as string

      const fullPath = path.join(postsDirectory, fileName);

      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);
      // Combine the data with the id

      if (tag.length === 0 || matterResult.data.tags.includes(tag)) {
        return {
          id,
          ...matterResult,
        };
      }
    })
    .filter(Boolean);
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.data.date < b.data.date) {
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

  let fileContent = null;

  const fullPath = path.join(postsDirectory, `${id}.mdx`);
  try {
    fileContent = fs.readFileSync(fullPath, "utf8");
  } catch (e) {
    fileContent = fs.readFileSync(
      path.join(postsDirectory, "drafts", `${id}.mdx`),
      "utf8",
    );
  }

  let { data, content } = matter(fileContent);

  return {
    id,
    data,
    content,
  };
}
