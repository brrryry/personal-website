import { getSortedPostsData } from "@/lib/posts";
import NotFound from "@/app/[...not_found]/page";

export default async function BlogTags({ params }) {
  const tagData = await getSortedPostsData(params.tag ? params.tag : "");

  if (tagData.length === 0 || params.tag === "series") {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Tags on top for small screens */}
      <div className="block md:hidden mb-4">
        <div className="text-left">
          tags <br />- - -
          <div>
            <a href="/blog">back to all tags</a>
          </div>
        </div>
        - - -
      </div>
      {/* Posts list */}
      <div className="space-y-5 md:w-4/5">
        <ul>
          {tagData.map((post) => {
            if (post)
              return (
                <li key={post.id} className="py-2">
                  <p>
                    <a href={`/blog/${post.id}`}>{post.data.title}</a> (
                    {post.data.date})
                    <br />
                    tags: [
                    {post.data.tags.sort().map((tag, i) => {
                      return (
                        <a href={`/blog/tag/${tag}`} key={post.id + tag}>
                          {i < post.data.tags.length - 1 ? tag + ", " : tag}
                        </a>
                      );
                    })}
                    ]<br />
                    {post.data.description}
                  </p>
                </li>
              );
          })}
        </ul>
      </div>
      {/* Tags on right for medium+ screens */}
      <div className="justify-end text-right hidden md:block md:w-1/5">
        tags
        <div>
          <a href="/blog">back to all tags</a>
        </div>
      </div>
    </div>
  );
}
