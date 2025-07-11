import { getSortedPostsData } from "@/lib/posts";

export default async function Blog() {
  const allPostsData = await getSortedPostsData();
  let allTags = [];
  allPostsData.forEach((post) => {
    allTags = allTags.concat(post.data.tags);
  });
  allTags = [...new Set(allTags)];
  allTags = allTags.sort((a, b) => a.localeCompare(b));
  allTags = allTags.filter((tag) => tag !== "series"); //remove "series" tag - should not be queryable


  return (
    <div className="flex flex-col md:flex-row">
      {/* Tags on top for small screens */}
      <div className="block md:hidden mb-4">
        <div className="text-left">
          tags <br />
          - - -
          <div>
            <a href="/blog">all</a>
          </div>
          {allTags.map((tag, i) => (
            <div key={tag + i}>
              <a href={`/blog/tag/${tag}`}>{tag}</a>
            </div>
          ))}
        </div>
        - - -
      </div>
      {/* Posts list */}
      <div className="space-y-5 md:w-4/5">
        <ul>
          {allPostsData.map((post) => {
            if (post && !post.data.tags.includes("series"))
              return (
                <li key={post.id} className="py-2">
                  <p>
                    <a href={`/blog/${post.id}`}>{post.data.title}</a> (
                    {post.data.date})
                    <br />
                    tags: [
                    {post.data.tags.sort().map((tag, i) => {
                      return (
                        <a
                          href={`/blog/tag/${tag}`}
                          key={post.id + tag}
                        >
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
          <a href="/blog">all</a>
        </div>
        {allTags.map((tag, i) => (
          <div key={tag + i}>
            <a href={`/blog/tag/${tag}`}>{tag}</a>
          </div>
        ))}
      </div>
    </div>
  );
}
