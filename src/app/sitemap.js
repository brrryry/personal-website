import { getSortedPostsData } from "@/lib/posts";

export default async function sitemap() {
  const baseUrl = "https://bryanchan.org";

  // Get all sorted posts, excluding drafts
  const allPosts = getSortedPostsData("", false);

  const postsUrls = allPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified:
      post.data.updated ||
      post.data.date ||
      new Date().toISOString().split("T")[0],
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  return [...staticUrls, ...postsUrls];
}
