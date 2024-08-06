import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-transparent flex justify-between items-center p-0 h-48 md:h-32">
      <div className="inline space-y-2 md:flex">
        <Link href="/" className="flex m-0 items-center">
          <p className="inline text-2xl text-purple-200 text-nowrap font-bold align-middle">
            bryan chan.
          </p>
        </Link>
        <Link href="/" className="flex m-0 items-center md:hidden">
          <p className="inline text-2xl text-purple-200 text-nowrap font-bold align-middle">
            -- home
          </p>
        </Link>
        <Link
          href="/Chan_Bryan_Resume.pdf"
          target="_blank"
          className="flex m-0 items-center md:hidden"
        >
          <p className="inline text-2xl text-purple-200 text-nowrap font-bold align-middle">
            -- resume
          </p>
        </Link>
        <Link href="/projects" className="flex m-0 items-center md:hidden">
          <p className="inline text-2xl text-purple-200 text-nowrap font-bold align-middle">
            -- projects
          </p>
        </Link>
        <Link href="/blog" className="flex m-0 items-center md:hidden">
          <p className="inline text-2xl text-purple-200 text-nowrap font-bold align-middle">
            -- blog
          </p>
        </Link>
      </div>

      <ul className="space-x-6 hidden md:flex">
        <li>
          <Link href="/">
            <p className="text-2xl text-purple-200 font-bold">home</p>
          </Link>
        </li>
        <li>
          <Link href="/Chan_Bryan_Resume.pdf" target="_blank">
            <p className="text-2xl text-purple-200 font-bold">resume</p>
          </Link>
        </li>
        <li>
          <Link href="/projects">
            <p className="text-2xl text-purple-200 font-bold">projects</p>
          </Link>
        </li>
        <li>
          <Link href="/blog">
            <p className="text-2xl text-purple-200 font-bold">blog</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
