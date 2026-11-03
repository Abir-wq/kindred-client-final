export default function Loading() {
  return (
    <main
      className="bg-base-100 px-6 py-20 text-base-content"
      aria-busy="true"
    >
      <div className="mx-auto max-w-6xl" role="status">
        <span
          className="loading loading-spinner loading-md text-primary"
          aria-hidden="true"
        />
        <p className="mt-4">Loading Kindred…</p>
      </div>
    </main>
  );
}