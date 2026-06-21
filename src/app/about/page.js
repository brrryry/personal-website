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
    <div className="space-y-12 pb-12">
      <div className="animate-fade-in-up delay-100">
        <div className="intro space-y-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2">About Me</h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl">
            This is my about page! Here, you can find more information on my
            education, experiences and projects.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            My complete professional resume can be viewed{" "}
            <a
              href="/Chan_Bryan_Resume.pdf"
              target="_blank"
              className="underline text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-white font-semibold transition-colors"
            >
              here
            </a>
            !
          </p>
        </div>
      </div>

      <hr className="border-purple-500/10" />

      {/* Education Section */}
      <div className="animate-fade-in-up delay-200">
        <div className="education space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-purple-900 dark:text-purple-100">
            Education
          </h2>

          <div className="space-y-6">
            {education.map((edu) => (
              <div
                className="edu p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/25 transition-all duration-300 shadow-sm hover:shadow-purple-500/5 flex flex-col md:flex-row md:justify-between md:items-start gap-4"
                key={edu.institution}
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-purple-900 dark:text-purple-200">
                    {edu.institution}
                  </h3>
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                    {edu.degree}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                    GPA: {edu.gpa}
                  </p>

                  <div className="pt-2">
                    <details className="dropdown group">
                      <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-white transition-colors select-none">
                        Relevant Courses
                      </summary>
                      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2 border-l border-purple-500/20 text-sm">
                        {edu.courses.map((course) => (
                          <li
                            key={course.code || course.name}
                            className="text-gray-600 dark:text-gray-400"
                          >
                            {course.link ? (
                              <a
                                href={course.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
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
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider bg-purple-500/10 text-purple-900 dark:text-purple-200 border border-purple-500/20 self-start">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-purple-500/10" />

      {/* Experience Section */}
      <div className="animate-fade-in-up delay-300">
        <div className="experience space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-purple-900 dark:text-purple-100">
            Experience
          </h2>

          <div className="space-y-6">
            {experience.map((exp) => (
              <div
                className="exp p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/25 transition-all duration-300 shadow-sm hover:shadow-purple-500/5 flex flex-col md:flex-row md:justify-between md:items-start gap-4"
                key={exp.company}
              >
                <div className="space-y-2 max-w-4xl">
                  <h3 className="text-xl font-bold tracking-tight text-purple-900 dark:text-purple-200">
                    {exp.company}
                  </h3>
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                    <em>{exp.role}</em>
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 text-pretty pt-1">
                    {exp.description}
                  </p>
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider bg-purple-500/10 text-purple-900 dark:text-purple-200 border border-purple-500/20 self-start shrink-0">
                  {exp.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-purple-500/10" />

      {/* Projects Section */}
      <div className="animate-fade-in-up delay-400">
        <div className="projects space-y-6">
          <span id="projects" className="block -mt-16 pt-16" />
          <h2 className="text-2xl font-bold tracking-tight text-purple-900 dark:text-purple-100">
            Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {projects.map((p) => (
              <div
                className="project p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 hover:translate-y-[-4px] flex flex-col justify-between"
                key={p.title}
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-bold tracking-tight text-purple-900 dark:text-purple-200 flex items-center justify-between gap-2">
                    <span>{p.title}</span>
                    {p.status && (
                      <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                        {p.status}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-pretty">
                    {p.description}
                  </p>
                </div>

                {/* Card Links */}
                {(p.url || p.github || p.blog) && (
                  <div className="flex items-center flex-wrap gap-4 mt-6 pt-4 border-t border-purple-500/10 text-xs">
                    {p.url && (
                      <a
                        href={p.url}
                        target={p.external ? "_blank" : "_self"}
                        className="underline text-purple-700 dark:text-purple-400 hover:text-purple-950 dark:hover:text-white flex items-center gap-1 font-semibold"
                      >
                        Visit Project
                      </a>
                    )}
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-purple-700 dark:text-purple-400 hover:text-purple-950 dark:hover:text-white flex items-center gap-1 font-semibold"
                      >
                        GitHub
                      </a>
                    )}
                    {p.blog && (
                      <a
                        href={p.blog}
                        className="underline text-purple-700 dark:text-purple-400 hover:text-purple-950 dark:hover:text-white flex items-center gap-1 font-semibold"
                      >
                        Blog Post
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-purple-500/10" />

      {/* Skills Section */}
      <div className="animate-fade-in-up delay-500">
        <div className="skills space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-purple-900 dark:text-purple-100">
            Skills
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-purple-500/10 bg-purple-500/5 hover:border-purple-500/20 transition-all duration-300">
              <h3 className="text-base font-bold text-purple-900 dark:text-purple-200 min-w-[200px]">
                Programming
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Python",
                  "R",
                  "Javascript",
                  "Bash",
                  "Java",
                  "Git",
                  "C",
                  "C++",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-900 dark:text-purple-200 border border-purple-500/10 hover:bg-purple-500/20 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-purple-500/10 bg-purple-500/5 hover:border-purple-500/20 transition-all duration-300">
              <h3 className="text-base font-bold text-purple-900 dark:text-purple-200 min-w-[200px]">
                Databases
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "PostgreSQL",
                  "MySQL / MariaDB",
                  "MongoDB",
                  "Firebase",
                  "SQLite",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-900 dark:text-purple-200 border border-purple-500/10 hover:bg-purple-500/20 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-purple-500/10 bg-purple-500/5 hover:border-purple-500/20 transition-all duration-300">
              <h3 className="text-base font-bold text-purple-900 dark:text-purple-200 min-w-[200px]">
                Software & Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Linux",
                  "Docker",
                  "RStudio",
                  "Jupyter",
                  "Git",
                  "MS Azure",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-900 dark:text-purple-200 border border-purple-500/10 hover:bg-purple-500/20 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-purple-500/10 bg-purple-500/5 hover:border-purple-500/20 transition-all duration-300">
              <h3 className="text-base font-bold text-purple-900 dark:text-purple-200 min-w-[200px]">
                Frameworks & Libraries
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "TensorFlow",
                  "PyTorch",
                  "Scikit-learn",
                  "Pandas",
                  "Seaborn",
                  "NextJS",
                  "Flask",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-900 dark:text-purple-200 border border-purple-500/10 hover:bg-purple-500/20 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-purple-500/10 bg-purple-500/5 hover:border-purple-500/20 transition-all duration-300">
              <h3 className="text-base font-bold text-purple-900 dark:text-purple-200 min-w-[200px]">
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Microsoft Azure: Data Science Associate (DP-100)"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-900 dark:text-purple-200 border border-purple-500/10 hover:bg-purple-500/20 transition-all"
                    >
                      {skill}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
