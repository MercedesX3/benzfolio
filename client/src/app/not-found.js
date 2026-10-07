import Image from 'next/image';
import Link from 'next/link';
import './not-found.css';

/**
 * The 404.
 *
 * A dead link on someone's portfolio is usually a stale bookmark from an
 * older version of it — /work/gopro-translation, /#playground — so the page
 * owns that, in one line, and points back at the desk. The paper plane is the
 * same drawing the menu panel uses: it is the site's mark for "going
 * somewhere".
 *
 * The title is Kelsi, which has no digits, so "404" is set in the body face
 * as the eyebrow rather than as the headline.
 */
export const metadata = {
  title: 'Not found — Mercedes Xiong',
};

export default function NotFound() {
  return (
    <section className="nf page-shell">
      <div className="nf__text">
        <p className="eyebrow">404</p>
        <h1 className="nf__title kelsi">Off the desk</h1>
        <p className="nf__body">
          This page isn&apos;t here any more — it probably moved the last time the desk was
          rearranged.
        </p>
        <div className="nf__actions">
          <Link href="/" className="nf__btn nf__btn--fill">
            Back to the desk
          </Link>
          <Link href="/projects" className="nf__btn">
            See the projects
          </Link>
        </div>
      </div>

      <Image
        src="/flatlay/panel-plane.webp"
        alt=""
        width={434}
        height={583}
        aria-hidden="true"
        className="nf__plane"
      />
    </section>
  );
}
