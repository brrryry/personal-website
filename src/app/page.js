import Navbar from "@/components/Navbar";

export default function Home() {
	return (
		<div className="space-y-5">
			<p>hi, im bryan.</p>
			<p>heres some stuff about me:</p>
			<ul className="list-disc mx-6 space-y-2">
				<li>
					im a college student at stevens institute of technology (grad. 2025 with a
					b.s. degree).
				</li>
				<li>i like data science, but im down for anything cs related.</li>
				<li>i play tennis and badminton.</li>
				<li>i play the piano.</li>
				<li>i am a cat lover.</li>
			</ul>
			<p>
				wanna know more about my job experience and projects? check out my{" "}
				<a href="/Chan_Bryan_Resume.pdf">resume</a>. alternatively, go to my{" "}
				<a href="https://www.linkedin.com/in/bryan-chan-185a4b210/" target="_blank">
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
				wanna know more about me? wanna know why i made this all lowercase? check
				out my <a href="/blog">blog</a>.
			</p>
			<p>
				wanna contact me? here some more links.
				<br />
				<a href="mailto:thisisbryanchan@gmail.com">email</a>
				<br />
				<a href="https://www.linkedin.com/in/bryan-chan-185a4b210/" target="_blank">
					linkedin
				</a>
				<br />
				<a href="https://github.com/brrryry" target="_blank">
					github
				</a>
			</p>
			<p>thanx</p>
		</div>
	);
}
