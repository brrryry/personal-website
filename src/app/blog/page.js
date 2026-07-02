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
      <p className="animate-fade-in-up delay-25">
        Note: The <span className="text-primary">{"''series''"}</span>
        tag is special! Posts under this section have a {"''series''"}
        tag. Clicking on this tag will show you all the blogs in the series.
      </p>
      <BlogSearch posts={plainPosts} />
    </div>
  );
}
