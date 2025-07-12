import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="space-y-5">
      <p>
        latest news: <a href="/blog/pdev-ep3-accounts">comment section</a> and
        working on{" "}
        <a href="https://github.com/brrryry/rag" target="_blank">
          rag security
        </a>
      </p>

      <br />
      <p>hi, im bryan.</p>
      <p>heres some stuff about me:</p>
      <ul className="list-disc mx-6 space-y-2">
        <li>
          im a college student at stevens institute of technology (grad. 2026
          with a m.s. in data science, grad. 2025 with a b.s. in computer
          science).
        </li>
        <li>i like data science, but im down for anything cs related.</li>
        <li>i play tennis and badminton.</li>
        <li>i play the piano.</li>
        <li>i am a cat lover.</li>
      </ul>
      <p>
        wanna know more about my job experience and projects? check out my{" "}
        <a href="/Chan_Bryan_Resume.pdf">resume</a>. alternatively, go to my{" "}
        <a href="https://www.linkedin.com/in/brrryry" target="_blank">
          linkedin
        </a>
        .
      </p>
      <p>
        wanna check my full suite of projects? check out my{" "}
        <a href="/projects">projects</a> page. hopefully theres some good stuff
        there.
      </p>
      <p>
        wanna know more about me? check out my <a href="/blog">blog</a>.
      </p>
      <div className="flex flex-wrap gap-x-5 break-words">
        <a href="mailto:thisisbryanchan@gmail.com">email</a>{" "}
        <a href="https://www.linkedin.com/in/brrryry" target="_blank">
          linkedin
        </a>{" "}
        <a href="https://github.com/brrryry" target="_blank">
          github
        </a>{" "}
        <a href="https://osu.ppy.sh/users/11781698" target="_blank">
          osu!
        </a>{" "}
        <a href="https://anilist.co/user/brrryry/" target="_blank">
          anilist
        </a>{" "}
      </div>
      <p>thats it, thanx :)</p>
    </div>
  );
}
