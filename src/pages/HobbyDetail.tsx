import { Link, useParams } from "react-router-dom";
import { hobbies, hobbyBySlug } from "../components/hobbies/content/HobbiesData";

export default function HobbyDetail() {
  const { slug } = useParams();
  const hobby = slug ? hobbyBySlug.get(slug) : undefined;

  if (!hobby) {
    return (
      <div className="px-4 pb-20">
        <div className="mx-auto max-w-5xl showcase-card p-6 md:p-8">
          <p className="section-kicker">Hobby</p>
          <h1 className="section-title">Not Found</h1>
          <p className="text-white/70">That hobby page does not exist yet.</p>
          <Link to="/#hobbies" className="showcase-cta-primary mt-5 inline-flex">
            Back to Hobbies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="showcase-card p-6 md:p-8">
          <p className="section-kicker">Hobby Detail</p>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="section-title">{hobby.title}</h1>
              <p className="text-white/70">{hobby.summary}</p>
            </div>
            <Link to="/#hobbies" className="showcase-cta-secondary">
              Back to Hobbies
            </Link>
          </div>
          <p className="text-white/75 mt-4 max-w-3xl">{hobby.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {hobby.tags.map((tag) => (
              <span key={tag} className="showcase-chip">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {hobby.stats && hobby.stats.length > 0 ? (
          <section className="showcase-card p-6 md:p-8">
            <p className="section-kicker">Metrics</p>
            <h2 className="section-title">Profile Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hobby.stats.map((stat) => (
                <article key={stat.label} className="showcase-inner-card">
                  <p className="text-xs uppercase tracking-wider text-white/60">{stat.label}</p>
                  <p className="text-xl font-semibold mt-1">{stat.value}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {hobby.links && hobby.links.length > 0 ? (
          <section className="showcase-card p-6 md:p-8">
            <p className="section-kicker">Links</p>
            <h2 className="section-title">Profiles & More</h2>
            <div className="flex flex-wrap gap-3">
              {hobby.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="showcase-cta-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <section className="showcase-card p-6 md:p-8">
          <p className="section-kicker">Media</p>
          <h2 className="section-title">Photos & Videos</h2>
          {hobby.media && hobby.media.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hobby.media.map((item, idx) => (
                <article key={`${item.src}-${idx}`} className="showcase-inner-card">
                  {item.type === "image" ? (
                    <img src={item.src} alt={item.caption ?? hobby.title} className="w-full rounded-lg" />
                  ) : (
                    <video src={item.src} controls className="w-full rounded-lg" />
                  )}
                  {item.caption ? <p className="text-sm text-white/70 mt-2">{item.caption}</p> : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="showcase-inner-card">
              <p className="text-white/75">
                Add media files in `public/hobbies/{hobby.slug}/` and update this hobby entry in
                `src/components/hobbies/content/HobbiesData.ts`.
              </p>
            </div>
          )}
        </section>

        <section className="showcase-card p-6 md:p-8">
          <p className="section-kicker">Explore</p>
          <h2 className="section-title">Other Hobbies</h2>
          <div className="flex flex-wrap gap-2">
            {hobbies
              .filter((item) => item.slug !== hobby.slug)
              .map((item) => (
                <Link key={item.slug} to={`/hobby/${item.slug}`} className="showcase-chip">
                  {item.title}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
