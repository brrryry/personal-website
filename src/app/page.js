import Navbar from "@/components/Navbar";
import Tooltip from "@/components/Tooltip";

export default function Home() {
  return (
    <div className="space-y-5">
      <div className="bg-purple-500/20 border border-purple-400/40 rounded-lg p-4">
        <p>
          latest news: <a href="/blog/pdev-ep3-accounts">comment section</a> and{" "}
          <a href="/blog/ms-dp100">ms-dp100 certification</a>
        </p>
      </div>

      <div className="gap gap-6">
        <section className="bg-white/5 border border-gray-700/40 rounded-lg p-4 space-y-3">
          <h2 className="text-lg font-semibold mb-2">about me</h2>
          <p>hi, im bryan.</p>
          <p>heres some stuff about me:</p>
          <ul className="list-disc mx-6 space-y-2">
            <li>
              im a data science (m.s.) graduate student at stevens institute of
              technology
            </li>
            <li>
              i have a computer science background, and i enjoy coding
              recreationally
            </li>
            <li>
              i enjoy composing music and playing the piano. i used to play
              classical music competitively when i was little!
            </li>
            <li>
              in my free time, i play video games or play sports (usually
              badminton)
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
