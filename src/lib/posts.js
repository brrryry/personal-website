import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/posts");

export function getNumberOfPosts(tag = "") {
  const allPosts = getSortedPostsData(tag);
  return allPosts.length;
}

// Get all nested files recursively
function getAllFiles(dir) {
  return fs.readdirSync(dir).flatMap((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      return getAllFiles(fullPath);
    }
    return [fullPath];
  });
}

export function getSortedPostsData(tag = "", drafts = true) {
  const allFullPaths = getAllFiles(postsDirectory);
  const fileNames = allFullPaths.map((fullPath) =>
    path.relative(postsDirectory, fullPath),
  );

  const showDrafts = process.env.NODE_ENV === "development" && drafts;

  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      let id = fileName.replace(/\.mdx$/, "").replace(/^.*[\\/]/, "");

      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Filter out drafts if not showing drafts
      if (matterResult.data.draft && !showDrafts) {
        return null;
      }

      // Fallback for status if not specified in frontmatter
      if (!matterResult.data.status) {
        matterResult.data.status = matterResult.data.draft
          ? "in progress"
          : "finished";
      }

      if (tag.length === 0 || matterResult.data.tags.includes(tag)) {
        return {
          id,
          fileName,
          ...matterResult,
        };
      }
    })
    .filter(Boolean);

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    let adate = a.data.updated ? a.data.updated : a.data.date;
    let bdate = b.data.updated ? b.data.updated : b.data.date;

    if (adate < bdate) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostFromId(id) {
  const allPosts = getSortedPostsData("", true);

  const post = allPosts.find((post) => post.id === id);

  if (!post) {
    return {
      notFound: true,
    };
  }

  const fullPath = path.join(postsDirectory, post.fileName);
  const fileContent = fs.readFileSync(fullPath, "utf8");

  let { data, content } = matter(fileContent);

  if (!data.status) {
    data.status = data.draft ? "in progress" : "finished";
  }

  return {
    id,
    data,
    content,
  };
}
