import Navbar from "@/components/Navbar";
import { readFile } from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

function LinkRenderer(props) {
  console.log({ props });
  return (
    <a href={props.href} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  );
}

export default async function Home() {
  const dataPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "data",
    "projects.json",
  );
  const raw = await new Promise((resolve, reject) => {
    readFile(dataPath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
  const projects = JSON.parse(raw);

  return (
    <div className="space-y-5">
      <p>
        the fastest way to check all my projects is to look through my{" "}
        <a href="https://github.com/brrryry" target="_blank">
          github
        </a>
        , but ngl it is super cluttered so...
      </p>
      <p>heres some cool projects:</p>
      <ul className="list-none m-0 p-0 grid gap-8 md:grid-cols-2">
        {projects.map((p) => (
          <li
            key={p.title}
            className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/20 transition-transform duration-200 ease-out hover:scale-[1.02]"
          >
            <a
              href={p.href || p.url || `/projects/${p.slug || ""}`}
              className="underline"
              target={p.external ? "_blank" : undefined}
            >
              {p.title}
            </a>
            {p.description && (
              <ReactMarkdown components={{ a: LinkRenderer }}>
                {p.description}
              </ReactMarkdown>
            )}
            {p.blog && (
              <p className="text-sm">
                blog:{" "}
                <a href={p.blog} className="underline">
                  {p.blog}
                </a>
              </p>
            )}
            {p.status && <p className="italic text-sm">status: {p.status}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
