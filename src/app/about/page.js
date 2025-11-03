import { readFileSync } from "fs";
import path from "path";
import Tooltip from "@/components/Tooltip";

export default function AboutPage() {
  const educationPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "data",
    "education.json",
  );
  const rawEducation = readFileSync(educationPath, "utf8");
  const education = JSON.parse(rawEducation);

  const experiencePath = path.join(
    process.cwd(),
    "src",
    "lib",
    "data",
    "experience.json",
  );
  const rawExperience = readFileSync(experiencePath, "utf8");
  const experience = JSON.parse(rawExperience);

  const projectsPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "data",
    "projects.json",
  );
  const rawProjects = readFileSync(projectsPath, "utf8");
  const projects = JSON.parse(rawProjects);

  return (
    <div className="space-y-10">
      <div className="intro space-y-2">
        <h1 className="text-2xl font-bold underline">Intro</h1>
        <p>
          This is my about page! Here, you can find more information on my
          education, experiences and projects.
        </p>
        <p>
          Not to shill, but...my paper resume can be viewed{" "}
          <a href="/Chan_Bryan_Resume.pdf" target="_blank">
            here
          </a>
          !
        </p>
      </div>

      <hr />

      <div className="education space-y-2">
        <h2 className="text-2xl font-bold underline">Education</h2>

        <div className="space-y-10">
          {education.map((edu) => (
            <div className="edu" key={edu.institution}>
              <div className="" key={edu.institution}>
                <div>
                  <h2 className="text-2xl">
                    {edu.institution} ({edu.startDate} - {edu.endDate})
                  </h2>
                  <p>{edu.degree}</p>
                  <p>GPA: {edu.gpa}</p>
                </div>
              </div>
              <details className="dropdown">
                <summary className="cursor-pointer font-medium hover:underline">
                  Relevant Courses
                </summary>
                <ul className="mt-2 space-y-1">
                  {edu.courses.map((course) => (
                    <li key={course.code || course.name}>
                      {course.link ? (
                        <a
                          href={course.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {course.code ? (
                            <span>
                              {course.code} — {course.name}
                            </span>
                          ) : (
                            <span>{course.name}</span>
                          )}
                        </a>
                      ) : (
                        <span>
                          {course.code ? (
                            <span>
                              {course.code} — {course.name}
                            </span>
                          ) : (
                            <span>{course.name}</span>
                          )}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      </div>

      <hr />

      <div className="experience space-y-2">
        <h2 className="text-2xl font-bold underline">Experience</h2>
        <div className="space-y-10">
          {experience.map((exp) => (
            <div className="exp" key={exp.company}>
              <h2 className="text-2xl">
                {exp.company} ({exp.duration})
              </h2>
              <p>
                <em>{exp.role}</em>
              </p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <hr />

      <div className="projects space-y-2">
        <h2 className="text-2xl font-bold underline">Projects</h2>
        <div className="space-y-10">
          {projects.map((p) => (
            <div className="project" key={p.title}>
              <h2 className="text-2xl flex items-center gap-2">
                {p.title}
                {p.url && (
                  <a
                    href={p.url}
                    target={p.external ? "_blank" : "_self"}
                    className="inline-flex items-center p-1 rounded hover:bg-white/5"
                    aria-label={`Link to ${p.title}`}
                  >
                    <span className="sr-only">external link</span>
                    <Tooltip content="external link">
                      <svg
                        className="svg-icon h-6 w-6"
                        style={{
                          verticalAlign: "middle",
                          fill: "currentColor",
                          overflow: "hidden",
                        }}
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M546.9184 665.4976a187.9552 187.9552 0 0 1-133.3248-55.1424 25.6 25.6 0 0 1 36.1984-36.1984 137.472 137.472 0 0 0 194.2016 0l186.1632-186.1632c53.5552-53.5552 53.5552-140.6464 0-194.2016s-140.6464-53.5552-194.2016 0L478.8736 350.8736a25.6 25.6 0 0 1-36.1984-36.1984l157.0816-157.0816c73.5232-73.5232 193.1264-73.5232 266.5984 0s73.5232 193.1264 0 266.5984l-186.1632 186.1632a187.9552 187.9552 0 0 1-133.3248 55.1424z"
                          fill=""
                        />
                        <path
                          d="M239.7184 972.6976a187.9552 187.9552 0 0 1-133.3248-55.1424 188.672 188.672 0 0 1 0-266.5984l186.1632-186.1632a188.672 188.672 0 0 1 266.5984 0 25.6 25.6 0 0 1-36.1984 36.1984 137.472 137.472 0 0 0-194.2016 0l-186.1632 186.1632c-53.5552 53.5552-53.5552 140.6464 0 194.2016s140.6464 53.5552 194.2016 0l157.0816-157.0816a25.6 25.6 0 0 1 36.1984 36.1984l-157.0816 157.0816a187.9552 187.9552 0 0 1-133.3248 55.1424z"
                          fill=""
                        />
                      </svg>
                    </Tooltip>
                  </a>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center p-1 rounded hover:bg-white/5"
                    aria-label={`GitHub repository for ${p.title}`}
                  >
                    <span className="sr-only">github</span>
                    <Tooltip content="github">
                      <span
                        className="justify-center"
                        style={{
                          verticalAlign: "middle",
                          fill: "currentColor",
                          overflow: "hidden",
                        }}
                        aria-hidden="true"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 bi bi-github"
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
                )}

                {p.blog && (
                  <a
                    href={p.blog}
                    rel="noreferrer"
                    className="inline-flex items-center p-1 rounded hover:bg-white/5"
                    aria-label={`Blog link for ${p.title}`}
                  >
                    <span className="sr-only">blog link</span>
                    <Tooltip content="blog link">
                      <svg
                        className="svg-icon h-6 w-6"
                        style={{
                          verticalAlign: "middle",
                          fill: "currentColor",
                          overflow: "hidden",
                        }}
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M512 64C264.576 64 64 264.576 64 512s200.576 448 448 448 448-200.576 448-448S759.424 64 512 64z m0 820.48c-205.824 0-372.48-166.656-372.48-372.48S306.176 139.52 512 139.52s372.48 166.656 372.48 372.48-166.656 372.48-372.48 372.48z"
                          fill=""
                        />
                        <path
                          d="M704 298.88H320c-17.664 0-32 14.336-32 32v361.6c0 17.664 14.336 32 32 32h384c17.664 0 32-14.336 32-32V330.88c0-17.664-14.336-32-32-32z m0 393.6H320V330.88h384v361.6z"
                          fill=""
                        />
                        <path
                          d="M393.216 426.88h237.568c8.832 0 16-7.168 16-16s-7.168-16-16-16H393.216c-8.832 0-16 7.168-16 16s7.168 16 16 16z"
                          fill=""
                        />
                        <path
                          d="M393.216 512.64h237.568c8.832 0 16-7.168 16-16s-7.168-16-16-16H393.216c-8.832 0-16 7.168-16 16s7.168 16 16 16z"
                          fill=""
                        />
                        <path
                          d="M393.216 598.4h121.6c8.832 0 16-7.168 16-16s-7.168-16-16-16h-121.6c-8.832 0-16 7.168-16 16s7.168 16 16 16z"
                          fill=""
                        />
                      </svg>
                    </Tooltip>
                  </a>
                )}
              </h2>
              <p>{p.description}</p>
              {p.status && <p className="italic text-sm">status: {p.status}</p>}
            </div>
          ))}
        </div>
      </div>

      <hr />

      <div className="skills space-y-3">
        <h2 className="text-2xl font-bold underline">Skills</h2>
        <div className="languages lg:flex lg:justify-between">
          <h2 className="text-2xl">Programming</h2>
          <p>Python, R, Javascript, Bash, Java, Git, C, C++</p>
        </div>
        <div className="databases lg:flex lg:justify-between">
          <h2 className="text-2xl">Databases</h2>
          <p>PostgreSQL, MySQL / MariaDB, MongoDB, Firebase, SQLite</p>
        </div>
        <div className="software lg:flex lg:justify-between">
          <h2 className="text-2xl">Software & Tools</h2>
          <p>Linux, Docker, RStudio, Jupyter, Git, MS Azure</p>
        </div>
        <div className="frameworks lg:flex lg:justify-between">
          <h2 className="text-2xl">Frameworks & Libraries</h2>
          <p>
            TensorFlow, PyTorch, Scikit-learn, Pandas, Seaborn, NextJS, Flask
          </p>
        </div>
        <div className="certifications lg:flex lg:justify-between">
          <h2 className="text-2xl">Certifications</h2>
          <p>Microsoft Azure: Data Science Associate (DP-100)</p>
        </div>
      </div>
    </div>
  );
}
