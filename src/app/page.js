import Navbar from "@/components/Navbar";
import Tooltip from "@/components/Tooltip";
import Image from "next/image";
import { getSortedPostsData } from "@/lib/posts";
import fs from "fs";
import path from "path";

export default function Home() {
  const allPostsData = getSortedPostsData("", false);
  const recentPosts = allPostsData.slice(0, 4).map((post) => {
    return {
      id: post.id,
      ...post.data,
    };
  });

  const projectsPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "data",
    "projects.json",
  );
  const rawProjects = fs.readFileSync(projectsPath, "utf8");
  const projects = JSON.parse(rawProjects);
  const activeProjects = projects.filter(
    (project) =>
      project.status !== "complete" && project.status !== "deprecated",
  );

  return (
    <div className="space-y-5 max-w-6xl justify-center mx-auto">
      <div className="animate-fade-in-up delay-100">
        <div className="bg-purple-500/20 border border-purple-400/40 rounded-lg p-4 animate-border-glow">
          <p>Latest News: CAE Symposium 2026!</p>
        </div>
      </div>

      <div className="pic-and-bio mx-auto flex flex-col md:flow-root items-center animate-fade-in-up delay-200">
        <div className="md:relative md:float-right md:my-auto md:py-5 md:pl-5 flex flex-col md:block justify-center items-center">
          <Image
            src="/me.jpg"
            alt="picture of me"
            width={500}
            height={200}
            className="rounded-lg border border-purple-400/40 object-contain max-w-[300px] justify-center mx-auto transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]"
            priority
          />
        </div>

        <div className="bio space-y-5 py-5 text-pretty">
          <h2 className="text-2xl font-bold mb-3">
            Hi, I&apos;m <span className="animate-gradient-text">Bryan</span>.
          </h2>
          <p>
            I{"'"}m a graduate student at{" "}
            <a href="https://www.stevens.edu/" target="_blank">
              Stevens Institute of Technology
            </a>{" "}
            (M.S. in Data Science). Previously, I graduated from the same school
            with a B.S. in Computer Science.
          </p>
          <p>
            I{"'"}m passionate about research and development in{" "}
            <span className="font-semibold">
              statistical learning, artificial intelligence and optimization
            </span>
            . Recently, I have worked on projects involving security of
            Retrieval Augmented Generation (RAG) systems and trajectory
            prediction of unmanned aerial vehicles (UAVs) using deep neural nets
            and cellular network data. You can view my projects{" "}
            <a href="/about#projects">here!</a>
          </p>
          <p>
            In my free time, I like to code new things, play badminton/video
            games, compose music, and chill out with my cat. Feel free to reach
            out :D
          </p>
        </div>
      </div>

      <div className="animate-fade-in-up delay-400">
        <h2 className="text-2xl font-bold mb-3">Open Project Board</h2>
        <div className="bg-purple-500/10 border-2 border-purple-500/50 rounded-xl p-5 shadow-lg shadow-purple-500/5 transition-all duration-300 hover:shadow-purple-500/15 hover:border-purple-500">
          <div className="space-y-4">
            {activeProjects.map((p) => (
              <div
                key={p.id}
                className="project-item border-b border-purple-400/20 last:border-0 pb-3 last:pb-0"
              >
                <h3 className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                  {p.title}
                  <span className="text-[0.7rem] px-2 py-0.5 rounded-full font-semibold uppercase bg-purple-100 dark:bg-purple-500/25 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-500/40">
                    {p.status}
                  </span>
                </h3>
                <p className="text-sm mt-1 text-pretty">{p.description}</p>
                {(p.github || p.url) && (
                  <div className="flex gap-3 mt-2 text-xs">
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-200 transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {p.url && (
                      <a
                        href={p.url}
                        target={p.external ? "_blank" : "_self"}
                        className="underline text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-200 transition-colors"
                      >
                        Project Link
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up delay-300">
        <h2 className="text-2xl font-bold mb-4">Recent News</h2>
        <div className="bg-purple-500/10 border-2 border-purple-500/50 rounded-xl p-5 shadow-lg shadow-purple-500/5 transition-all duration-300 hover:shadow-purple-500/15 hover:border-purple-500">
          <div className="relative border-l border-purple-500/20 dark:border-purple-500/15 ml-3 pl-6 space-y-8 my-2">
            <div className="relative group">
              <span className="absolute -left-[31px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 group-hover:scale-125 transition-all duration-300 ring-4 ring-[#f0e8fe] dark:ring-[#2c2434]"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                04-2026
              </span>
              <p className="text-sm leading-relaxed text-pretty">
                <a
                  href="https://www.caecommunity.org/symposium-archive/2026-cae-in-cybersecurity-symposium"
                  target="_blank"
                  className="hover:underline text-purple-900 dark:text-purple-300 font-medium"
                >
                  A Machine Learning-based Approach to Malicious Document
                  Detection for RAG Chunk Ingestion
                </a>{" "}
                presented at{" "}
                <a
                  href="https://jindal.utdallas.edu/biz-ai-conference/biz-ai-conference-2026/"
                  target="_blank"
                  className="hover:underline"
                >
                  <em>BizAI 2026</em>
                </a>{" "}
                and{" "}
                <a
                  href="https://www.caecommunity.org/symposium"
                  target="_blank"
                  className="hover:underline"
                >
                  <em>CAE Symposium 2026</em>
                </a>
                .
              </p>
            </div>

            <div className="relative group">
              <span className="absolute -left-[31px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 group-hover:scale-125 transition-all duration-300 ring-4 ring-[#f0e8fe] dark:ring-[#2c2434]"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                06-2025
              </span>
              <p className="text-sm leading-relaxed text-pretty">
                Started research (AI in Enterprise Data) at Illinois State
                University under{" "}
                <a
                  href="https://it.illinoisstate.edu/faculty-staff/profile/?ulid=dzhdano"
                  target="_blank"
                  className="hover:underline text-purple-900 dark:text-purple-300 font-medium"
                >
                  Dr. Dmitry Zhdanov
                </a>{" "}
                and the{" "}
                <a
                  href="https://www.caecommunity.org/initiatives/initiative-insure"
                  target="_blank"
                  className="hover:underline"
                >
                  INSuRE+E Program
                </a>
                . A poster was presented in a private showcase in December 2025.
              </p>
            </div>

            <div className="relative group">
              <span className="absolute -left-[31px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 group-hover:scale-125 transition-all duration-300 ring-4 ring-[#f0e8fe] dark:ring-[#2c2434]"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                10-2024
              </span>
              <p className="text-sm leading-relaxed text-pretty">
                <a
                  href="https://131b1d64-a91b-4e72-9201-2d47ce0a189a.filesusr.com/ugd/eeb746_ca1016804fc0441597a22f1d72ae651d.pdf"
                  target="_blank"
                  className="hover:underline text-purple-900 dark:text-purple-300 font-medium"
                >
                  A Survey of ROV++: We May Need Another Napkin
                </a>{" "}
                poster presented at{" "}
                <a
                  href="https://www.caecommunity.org/cop-cyber-research/cae-r-research-symposium/2024-cae-r-cop-research-symposium"
                  target="_blank"
                  className="hover:underline"
                >
                  <em>2024 CAE Symposium</em>
                </a>
                .
              </p>
            </div>

            <div className="relative group">
              <span className="absolute -left-[31px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 group-hover:scale-125 transition-all duration-300 ring-4 ring-[#f0e8fe] dark:ring-[#2c2434]"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                06-2024
              </span>
              <p className="text-sm leading-relaxed text-pretty">
                Started research (BGP Empirical Studies) at Iowa State
                University under{" "}
                <a
                  href="https://www.engineering.iastate.edu/people/profile/bgulmez/"
                  target="_blank"
                  className="hover:underline text-purple-900 dark:text-purple-300 font-medium"
                >
                  Dr. Burk Gulmezoglu
                </a>{" "}
                and the{" "}
                <a
                  href="https://www.caecommunity.org/initiatives/initiative-insure"
                  target="_blank"
                  className="hover:underline"
                >
                  INSuRE+E Program
                </a>
                . Poster published in October 2024.
              </p>
            </div>

            <div className="relative group">
              <span className="absolute -left-[31px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 group-hover:scale-125 transition-all duration-300 ring-4 ring-[#f0e8fe] dark:ring-[#2c2434]"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                09-2023
              </span>
              <p className="text-sm leading-relaxed text-pretty">
                Began Course Assistantship for{" "}
                <a
                  href="https://web.stevens.edu/catalog/archive/2021-2022/en/catalog/academic-catalog/courses/cs-computer-science/100/cs-115.html"
                  target="_blank"
                  className="hover:underline text-purple-900 dark:text-purple-300 font-medium"
                >
                  <em>CS 115: Introduction to Computer Science</em>
                </a>{" "}
                and{" "}
                <a
                  href="https://stevens.smartcatalogiq.com/en/2021-2022/academic-catalog/courses/ma-mathematics/300/ma-331"
                  target="_blank"
                  className="hover:underline"
                >
                  <em>MA 331: Intermediate Statistics</em>
                </a>{" "}
                at Stevens Institute of Technology. (Fall 2023 - Spring 2025)
              </p>
            </div>

            <div className="relative group">
              <span className="absolute -left-[31px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 group-hover:scale-125 transition-all duration-300 ring-4 ring-[#f0e8fe] dark:ring-[#2c2434]"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                11-2022
              </span>
              <p className="text-sm leading-relaxed text-pretty">
                Started research (
                <em>Analyzing Collapse of Online Gaming Communities</em>) at
                Stevens Institute of Technology under{" "}
                <a
                  href="https://www.stevens.edu/profile/jssun54"
                  target="_blank"
                  className="hover:underline text-purple-900 dark:text-purple-300 font-medium"
                >
                  Dr. Jingyi Sun
                </a>
                . (Fall 2022 - Summer 2023)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up delay-500">
        <h2 className="text-2xl font-bold mb-4">Recent Blog Posts</h2>

        {recentPosts.length > 0 && (
          <div className="space-y-3">
            {recentPosts.map(({ id, date, title }) => (
              <a
                key={id}
                href={`/blog/${id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-purple-500/10 hover:border-purple-500/25 bg-purple-500/5 hover:bg-purple-500/10 transition-all duration-300 group shadow-sm hover:shadow-purple-500/5"
              >
                <span className="font-semibold text-purple-900 dark:text-purple-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                  {title}
                </span>
                <span className="text-xs text-purple-800 dark:text-purple-300 mt-1 sm:mt-0 font-medium">
                  {date}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      <div></div>
    </div>
  );
}
