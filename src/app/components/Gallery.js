import Image from "next/image";

const photos = [
  {
    src: "/images/tree-planting.jpg",
    alt: "Volunteers planting a sapling together in Bangladesh",
    title: "Growing a greener Bangladesh",
    description: "Small saplings. Shared responsibility. A greener tomorrow.",
  },
  {
    src: "/images/community-cleanup.jpg",
    alt: "BD Clean volunteers collecting litter in a park",
    title: "Caring for our shared spaces",
    description: "Working together to keep our neighbourhoods clean.",
  },
  {
    src: "/images/food-donation.jpg",
    alt: "Volunteers distributing food in Bangladesh",
    title: "Sharing food and kindness",
    description: "Community care begins with showing up for one another.",
  },
];

export default function Gallery() {
  return (
    <section
      aria-labelledby="gallery-heading"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <p className="kindred-muted text-xs font-bold uppercase tracking-widest">
        Community in action
      </p>

      <h2
        id="gallery-heading"
        className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
      >
        Local hands. Lasting change.
      </h2>

      <p className="kindred-muted mt-4 max-w-2xl leading-7">
        A glimpse of volunteering in Bangladesh—from planting trees and
        cleaning parks to sharing meals with people who need them.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {photos.map((photo) => (
          <figure
            key={photo.src}
            className="kindred-card overflow-hidden rounded-3xl border border-base-content/10"
          >
            <div className="relative aspect-4/3">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 767px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            <figcaption className="p-6">
              <h3 className="text-xl font-bold">{photo.title}</h3>
              <p className="kindred-muted mt-3 text-sm leading-7">
                {photo.description}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="kindred-muted mt-5 text-xs leading-6">
        Photos illustrate community initiatives in Bangladesh and do not
        represent events organised by Kindred.
      </p>
    </section>
  );
}