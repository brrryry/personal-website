export async function BlogList({ children }) {
  return (
    <div className="mx-6">
      <ul className="list-disc">{children}</ul>
    </div>
  );
}
