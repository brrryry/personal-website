import { getSortedPostsData } from "@/lib/posts";
import BlogSearch from "@/components/BlogSearch";

export default async function Blog() {
  const allPostsData = await getSortedPostsData();
  //get all tags
  // collect all tags (support array or comma-separated string), dedupe and sort

  return (
    <div className="flex flex-col">
      <BlogSearch posts={allPostsData} />
    </div>
  );
}
