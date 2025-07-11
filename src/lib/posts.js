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

  // Get all nested subdirectories recursively
  function getAllSubdirectories(dir) {
    return fs.readdirSync(dir).flatMap((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        return [path.relative(postsDirectory, fullPath), ...getAllSubdirectories(fullPath)];
      }
      return [];
    });
  }
  const subdirectories = getAllSubdirectories(postsDirectory);

  fileNames = fileNames.concat(
    subdirectories.flatMap((subdir) => {
      if (subdir === "drafts") return []; // skip drafts subdirectory
      const subdirPath = path.join(postsDirectory, subdir);
      return fs
        .readdirSync(subdirPath)
        .map((file) => path.join(subdir, file));
    })
  );

  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      // Remove ".md" from file name to get id and remove all prefixes like "drafts/"
      let id = fileName.replace(/\.mdx$/, "").replace(/^.*[\\/]/, "");


      // Read markdown file as string

      const fullPath = path.join(postsDirectory, fileName);

      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);
      // Combine the data with the id

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

  const fullPath = path.join(postsDirectory, post.fileName);
  console.log(fullPath)
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
