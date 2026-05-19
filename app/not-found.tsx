import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-pg py-24 text-center">
      <p className="pill pill-coral mb-3 inline-flex">404</p>
      <h1 className="h1 text-ink-900">Page not found</h1>
      <p className="lede mt-3 max-w-xl mx-auto">
        The page you're looking for doesn't exist. Try the calculator on the home page,
        or browse childcare costs by state.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn btn-primary">Go to home</Link>
        <Link href="/state-childcare-costs" className="btn btn-ghost">Childcare by state</Link>
      </div>
    </section>
  );
}
