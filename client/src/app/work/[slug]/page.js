import { notFound } from 'next/navigation';
import ChallengePage from '@/components/ChallengePage';
import { CHALLENGES, getChallenge } from '@/data/challenges';

export function generateStaticParams() {
  return CHALLENGES.map((challenge) => ({ slug: challenge.slug }));
}

// Anything not in CHALLENGES should 404 rather than render an empty shell.
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const challenge = getChallenge(slug);

  if (!challenge) return {};

  return {
    title: `${challenge.name} — Design challenge — Mercedes Xiong`,
    description: `${challenge.brief}. ${challenge.summary}`,
  };
}

export default async function Challenge({ params }) {
  const { slug } = await params;
  const challenge = getChallenge(slug);

  if (!challenge) notFound();

  return <ChallengePage challenge={challenge} />;
}
