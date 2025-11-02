import { getSortedPostsData } from "@/lib/posts";
import BlogSearch from "@/components/BlogSearch";

// function to remove non-serializable data?? or map stuff idk
function toPlainObject(value) {
  if (value instanceof Uint8Array) {
    return Array.from(value);
  }
  if (Array.isArray(value)) {
    return value.map(toPlainObject);
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = toPlainObject(v);
    }
    return out;
  }
  return value;
}

export default async function Blog() {
  const allPostsData = await getSortedPostsData();

  const plainPosts = allPostsData.map((post) => toPlainObject({ ...post }));

  return (
    <div className="flex flex-col space-y-5">
      <p>
        Note: The {'"'}series{'"'} tag is special! Posts under this section have
        a {'"'}series{'"'} tag that have all the blog posts in the series. They
        are usually hidden to reduce cluttering.
      </p>
      <BlogSearch posts={plainPosts} />
    </div>
  );
}
