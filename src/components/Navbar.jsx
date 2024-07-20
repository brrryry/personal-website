import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-transparent flex justify-between items-center p-0">
      <Link href="/" className="m-0">
        <p className="text-base md:text-2xl text-purple-200 font-bold">
          bryan chan.
        </p>
      </Link>
      <ul className="flex space-x-6">
        <li>
          <Link href="/Chan_Bryan_Resume.pdf" target="_blank">
            <p className="text-base md:text-2xl text-purple-200 font-bold">
              resume
            </p>
          </Link>
        </li>
        <li>
          <Link href="/projects">
            <p className="text-base md:text-2xl text-purple-200 font-bold">
              projects
            </p>
          </Link>
        </li>
        <li>
          <Link href="/blog">
            <p className="text-base md:text-2xl text-purple-200 font-bold">
              blog
            </p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
