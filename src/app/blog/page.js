import { getSortedPostsData } from "@/lib/posts";

async function getBlogs() {
  const allPostsData = getSortedPostsData();
  return allPostsData;
}

export default async function Blog() {
  const allPostsData = await getBlogs();
  return (
    <div className="space-y-5">
      {/* Keep the existing code here */}
      {/* Add this <section> tag below the existing <section> tag */}
      <h2>Blog</h2>- - -
      <ul>
        {allPostsData.map(({ id, data }) => (
          <li key={id}>
            <p>
              <a href={`/blog/${id}`}>{data.title}</a> ({data.date})<br />
              tags: [
              {data.tags.map((tag, i) => {
                return i < data.tags.length - 1 ? tag + ", " : tag;
              })}
              ]<br />
              {data.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
