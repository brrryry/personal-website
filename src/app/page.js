import Navbar from "@/components/Navbar";
import Tooltip from "@/components/Tooltip";
import Image from "next/image";
import { getSortedPostsData } from "@/lib/posts";

export default function Home() {
  const allPostsData = getSortedPostsData("", false);
  const recentPosts = allPostsData.slice(0, 4).map((post) => {
    return {
      id: post.id,
      ...post.data,
    };
  });

  return (
    <div className="space-y-5 max-w-6xl justify-center mx-auto">
      <div className="bg-purple-500/20 border border-purple-400/40 rounded-lg p-4">
        <p>
          Latest News: Capitalization Overhaul and{" "}
          <a href="/blog/pdev-ep4-frontend-and-misc">Blog QOL Updates</a>
        </p>
      </div>

      <div className="pic-and-bio mx-auto flex-col items-center">
        <div className="md:relative md:float-right md:my-auto md:py-5 md:pl-5 flex flex-col md:block justify-center items-center">
          <Image
            src="/me.jpg"
            alt="picture of me"
            width={500}
            height={200}
            className="rounded-lg border border-purple-400/40 object-contain max-w-[300px] justify-center mx-auto"
            priority
          />
          <div className="flex justify-center gap-4">
            <a
              href="mailto:thisisbryanchan@gmail.com"
              className="inline-flex items-center p-2 rounded hover:bg-white/5"
              aria-label="email: thisisbryanchan@gmail.com"
            >
              <span className="sr-only">email</span>
              <Tooltip content="email: thisisbryanchan@gmail.com">
                <span className="inline-flex" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-4 w-4"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-hidden="true"
                  >
                    <path d="M3 8.25v7.5A3 3 0 006 19h12a3 3 0 003-3v-7.5" />
                    <path d="M21 6.75a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6.75v.75l9 6 9-6v-.75z" />
                  </svg>
                </span>
              </Tooltip>
            </a>

            <a
              rel="noopener noreferrer"
              className="inline-flex items-center p-2 rounded hover:bg-white/5"
              aria-label="Discord: @brrryry"
            >
              <span className="sr-only">discord: @brrryry</span>
              <Tooltip content="discord: @brrryry">
                <span className="inline-flex" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4"
                    role="img"
                    aria-hidden="true"
                  >
                    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                  </svg>
                </span>
              </Tooltip>
            </a>

            <a
              href="https://github.com/brrryry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center p-2 rounded hover:bg-white/5"
              aria-label="github profile"
            >
              <span className="sr-only">github profile</span>
              <Tooltip content="github profile">
                <span className="inline-flex" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 bi bi-github"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    role="img"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                  </svg>
                </span>
              </Tooltip>
            </a>
          </div>
        </div>

        <div className="bio space-y-5 py-5 text-pretty">
          <h2 className="text-2xl font-bold mb-3">Hi, I&apos;m Bryan.</h2>
          <p>
            I&apos;m a graduate student at{" "}
            <a href="https://www.stevens.edu/" target="_blank">
              Stevens Institute of Technology
            </a>{" "}
            (M.S. in Data Science). Previously, I graduated from the same school
            with a B.S. in Computer Science.
          </p>
          <p>
            I&apos;m passionate about research and development in{" "}
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
          <br />
          <h2 className="text-2xl font-bold mb-3">Recent News!</h2>
          <div className="space-y-2">
            <div className="flex highlight-item space-x-10">
              <div className="left-side min-w-[100px]">
                <p>06-2025</p>
              </div>
              <div className="right-side">
                <p className="text">
                  Started research (AI in Enterprise Data) at Illinois State
                  University under{" "}
                  <a
                    href="https://it.illinoisstate.edu/faculty-staff/profile/?ulid=dzhdano"
                    target="_blank"
                  >
                    Dr. Dmitry Zhdanov
                  </a>{" "}
                  and the{" "}
                  <a
                    href="https://www.caecommunity.org/initiatives/initiative-insure"
                    target="_blank"
                  >
                    INSuRE+E Program
                  </a>
                  . A poster is expected to be presented in December 2025.
                </p>
              </div>
            </div>

            <hr className="border-purple-400/40" />

            <div className="flex highlight-item space-x-10">
              <div className="left-side min-w-[100px]">
                <p>10-2024</p>
              </div>
              <div className="right-side">
                <p className="text">
                  <a
                    href="https://131b1d64-a91b-4e72-9201-2d47ce0a189a.filesusr.com/ugd/eeb746_ca1016804fc0441597a22f1d72ae651d.pdf"
                    target="_blank"
                  >
                    A Survey of ROV++: We May Need Another Napkin
                  </a>{" "}
                  poster presented at{" "}
                  <a
                    href="https://www.caecommunity.org/cop-cyber-research/cae-r-research-symposium/2024-cae-r-cop-research-symposium"
                    target="_blank"
                  >
                    <em>2024 CAE Symposium</em>
                  </a>
                  .
                </p>
              </div>
            </div>

            <hr className="border-purple-400/40" />

            <div className="flex highlight-item space-x-10">
              <div className="left-side min-w-[100px]">
                <p>06-2024</p>
              </div>
              <div className="right-side">
                <p className="text">
                  Started research (BGP Empirical Studies) at Iowa State
                  University under{" "}
                  <a
                    href="https://www.engineering.iastate.edu/people/profile/bgulmez/"
                    target="_blank"
                  >
                    Dr. Burk Gulmezoglu
                  </a>{" "}
                  and the{" "}
                  <a
                    href="https://www.caecommunity.org/initiatives/initiative-insure"
                    target="_blank"
                  >
                    INSuRE+E Program
                  </a>
                  . Poster published in October 2024.
                </p>
              </div>
            </div>

            <hr className="border-purple-400/40" />

            <div className="flex highlight-item space-x-10">
              <div className="left-side min-w-[100px]">
                <p>09-2023</p>
              </div>
              <div className="right-side">
                <p className="text">
                  Began Course Assistantship for{" "}
                  <a
                    href="https://web.stevens.edu/catalog/archive/2021-2022/en/catalog/academic-catalog/courses/cs-computer-science/100/cs-115.html"
                    target="_blank"
                  >
                    <em>CS 115: Introduction to Computer Science</em>
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://stevens.smartcatalogiq.com/en/2021-2022/academic-catalog/courses/ma-mathematics/300/ma-331"
                    target="_blank"
                  >
                    <em>MA 331: Intermediate Statistics</em>
                  </a>{" "}
                  at Stevens Institute of Technology. (Fall 2023 - Spring 2025)
                </p>
              </div>
            </div>

            <hr className="border-purple-400/40" />

            <div className="flex highlight-item space-x-10">
              <div className="left-side min-w-[100px]">
                <p>11-2022</p>
              </div>
              <div className="right-side">
                <p className="text">
                  Started research (
                  <em>Analyzing Collapse of Online Gaming Communities</em>) at
                  Stevens Institute of Technology under{" "}
                  <a
                    href="https://www.stevens.edu/profile/jsun54"
                    target="_blank"
                  >
                    Dr. Jingyi Sun
                  </a>
                  . (Fall 2022 - Summer 2023)
                </p>
              </div>
            </div>
          </div>

          <br />

          <h2 className="text-2xl font-bold mb-3">Recent Blog Posts</h2>

          {recentPosts.length > 0 && (
            <div className="space-y-2 text-[1.3rem]">
              {recentPosts.map(({ id, date, title }) => (
                <div key={id} className="flex highlight-item space-x-5">
                  <div className="left-side">
                    <p>{date}</p>
                  </div>
                  <div className="right-side">
                    <a
                      href={`/blog/${id}`}
                      className="text underline hover:text-purple-300 transition-colors duration-200 ease-out"
                    >
                      {title}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div></div>
    </div>
  );
}
