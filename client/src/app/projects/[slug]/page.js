import { notFound } from 'next/navigation';
import CaseStudy from '@/components/case/CaseStudy';
import { CASE_SLUGS, getCaseStudy, getNextCase } from '@/data/caseStudies';

/**
 * A project's case study at its own URL — /projects/sage.
 *
 * Deliberately a real route rather than a bigger popup: these are the pages
 * someone sends to a recruiter, and a modal has no link to send. The deck's
 * popup stays the teaser and links here.
 *
 * `/projects` itself is still the deck's projects section (app/[section]),
 * which is why this nests under a static `projects` segment — the one-segment
 * and two-segment routes do not collide.
 */
export function generateStaticParams() {
  return CASE_SLUGS.map((slug) => ({ slug }));
}

// Anything not in CASE_STUDIES should 404 rather than render an empty shell.
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: `${study.title} — ${study.kicker} — Mercedes Xiong`,
    description: study.lede,
  };
}

export default async function ProjectCaseStudy({ params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  return <CaseStudy study={study} next={getNextCase(slug)} />;
}
