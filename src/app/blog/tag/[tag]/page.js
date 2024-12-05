import { getSortedPostsData } from "@/lib/posts";
import NotFound from "@/app/[...not_found]/page";

export default async function BlogTags({ params }) {
  const allPostsData = await getSortedPostsData();
  const tagData = await getSortedPostsData(params.tag ? params.tag : "");

  let allTags = [];
  allPostsData.forEach((post) => {
    allTags = allTags.concat(post.data.tags);
  });
  allTags = [...new Set(allTags)];
  allTags = allTags.sort((a, b) => a.localeCompare(b));

  if (tagData.length === 0) {
    return <NotFound />;
  }

  return (
    <div className="flex">
      <div className="space-y-5 w-4/5">
        {/* Keep the existing code here */}
        {/* Add this <section> tag below the existing <section> tag */}- - -
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
      <div className="justify-end w-1/5 text-right">
        - - -<br />
        tags
        <div>
          <a href="/blog">all</a>
          <br />
        </div>
        {allTags.map((tag, i) => {
          return (
            <div key={tag + i}>
              <a href={`/blog/tag/${tag}`}>{tag}</a>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
}
