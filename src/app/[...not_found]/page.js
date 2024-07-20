import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <div className="flex flex-wrap justify-center shrink">
        <h1>u got 404d :(</h1>
      </div>
      <div className="flex flex-wrap justify-center">
        <Link href="/">wanna go back home?</Link>
      </div>
    </div>
  );
}
