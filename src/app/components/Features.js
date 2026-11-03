const features = [
  {
    number: "01",
    title: "Find your next opportunity",
    description:
      "Explore upcoming cleanup drives, plantation activities, and donation events. Find a cause close to home and close to your heart.",
  },
  {
    number: "02",
    title: "Bring people together",
    description:
      "Create a community event with a location, date, and purpose. Help others discover your initiative and get involved.",
  },
  {
    number: "03",
    title: "Keep your plans together",
    description:
      "See the events you have joined in one place, organised by date, so you can prepare for your next day of volunteering.",
  },
];

export default function Features() {
  return (
    <section
      aria-labelledby="features-heading"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <p className="kindred-muted text-xs font-bold uppercase tracking-widest">
        Made for making a difference
      </p>

      <h2
        id="features-heading"
        className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
      >
        Good intentions, made easier.
      </h2>

      <p className="kindred-muted mt-4 max-w-2xl leading-7">
        From discovering an opportunity to organising your own initiative,
        Kindred helps you take the next step.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.number}
            className="kindred-card rounded-3xl border border-base-content/10 p-7"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-base-200 text-sm font-bold">
              {feature.number}
            </span>

            <h3 className="mt-6 text-xl font-bold">
              {feature.title}
            </h3>

            <p className="kindred-muted mt-4 text-sm leading-7">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}