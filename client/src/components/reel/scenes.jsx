'use client';

/**
 * The drawing code for the project reels.
 *
 * Each scene is a pure function of `t` — seconds on the 15s timeline — so the
 * whole clip is seekable, loops exactly, and renders the same frame for the
 * same t whether it is playing, paused or frozen for reduced motion. Nothing
 * here holds state.
 *
 * Everything is one 640 x 360 SVG viewBox. SVG rather than DOM because these
 * are diagrams: a sweeping highlight over transcript rows, a score dial
 * filling, an emotion arc drawing itself. Doing that with divs would be a pile
 * of absolutely positioned boxes that breaks the moment the clip is resized.
 */

import { BEATS } from '../../data/reels';

/* ── Timing helpers ─────────────────────────────────────────────────────── */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Local progress 0 → 1 across a window, clamped outside it. */
const win = (t, at, to) => clamp((t - at) / (to - at));

/** The shared beat windows, by id, so scenes read `B.product` not a number. */
const B = Object.fromEntries(BEATS.map((b) => [b.id, b]));

/* Easing. Entrances settle (out), exits commit (in) — same contract as the
   CSS tokens, written in JS because these drive SVG attributes. */
const outCubic = (p) => 1 - Math.pow(1 - p, 3);
const inOutCubic = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

/**
 * A beat's opacity: fades in over `fade`, holds, fades out before the next.
 * Beats overlap slightly on purpose — a hard cut between them reads as a
 * broken render rather than an edit.
 */
function beatAlpha(t, beat, fade = 0.45) {
  const { at, to } = beat;
  if (t < at - fade || t > to + fade * 0.6) return 0;
  const inAlpha = clamp((t - (at - fade)) / fade);
  const outAlpha = 1 - clamp((t - (to - fade * 0.4)) / fade);
  return Math.min(inAlpha, outAlpha);
}

/* ── Shared furniture ───────────────────────────────────────────────────── */

/**
 * Beat 1 and beat 5 — the title.
 *
 * The clip opens and closes on the same composition so the loop point is
 * invisible: at t=15 the title is arriving again exactly as it was at t=0.
 */
function TitleCard({ t, reel }) {
  const open = beatAlpha(t, B.title, 0.4);
  /* The rest beat runs to the end of the timeline, so its fade-in doubles as
     the loop's fade-in. */
  const close = t > B.rest.at - 0.5 ? clamp((t - (B.rest.at - 0.5)) / 0.6) : 0;
  const alpha = Math.max(open, close);
  if (alpha <= 0.001) return null;

  const rise = outCubic(clamp(t / 1.1)) * 10;

  return (
    <g opacity={alpha} transform={`translate(0 ${10 - rise})`}>
      {/* The title is set in the product's own face — Semantica's serif, the
          portfolio's display face otherwise — because recognising the thing is
          the first job of the clip. */}
      <text
        x="320"
        y="166"
        textAnchor="middle"
        className={reel.serif ? 'reel__title reel__title--serif' : 'reel__title'}
        fill={reel.ink ?? (reel.serif ? reel.accent : undefined)}
      >
        {reel.title}
      </text>
      <text x="320" y="200" textAnchor="middle" className="reel__sub" fill={reel.subInk}>
        {reel.subtitle}
      </text>
      <rect x="284" y="216" width={72 * outCubic(clamp((t - 0.5) / 0.9))} height="3" rx="1.5" fill={reel.accent} />
    </g>
  );
}

/** Beat 2's caption and beat 3's, set on the same baseline every time. */
function Caption({ t, beat, children, accent, ink }) {
  const alpha = beatAlpha(t, beat, 0.4);
  if (alpha <= 0.001) return null;
  return (
    <g opacity={alpha}>
      <rect x="40" y="300" width="4" height="22" rx="2" fill={accent} />
      <text x="56" y="317" className="reel__caption" fill={ink}>
        {children}
      </text>
    </g>
  );
}

/** Beat 4 — the outcome, arriving with weight. */
function Outcome({ t, reel, children }) {
  const alpha = beatAlpha(t, B.outcome, 0.4);
  if (alpha <= 0.001) return null;
  const p = win(t, B.outcome.at, B.outcome.at + 0.8);
  const scale = 0.94 + 0.06 * outCubic(p);

  return (
    <g opacity={alpha}>
      <g transform={`translate(320 180) scale(${scale}) translate(-320 -180)`}>{children}</g>
      <text x="320" y="246" textAnchor="middle" className="reel__outcome-label" fill={reel.accent}>
        {reel.outcome}
      </text>
    </g>
  );
}

/* ── SAGE ───────────────────────────────────────────────────────────────── */

/**
 * Problem: the advising queue. Slots fill with bookings one after another
 * until the student at the bottom has nowhere to go.
 * Product: a transcript is scanned row by row; each parsed row lands against a
 * requirement as a tick; then the answer arrives carrying its source.
 */
/**
 * The site's own landing composition, rebuilt from the repo: the headline in
 * light text with SAGE set in the accent, over the two pill buttons — accent
 * filled, then outlined — that utdsage.com actually offers.
 */
function SageHero({ t, reel }) {
  const alpha = beatAlpha(t, B.title, 0.4);
  const close = t > B.rest.at - 0.5 ? clamp((t - (B.rest.at - 0.5)) / 0.6) : 0;
  const a = Math.max(alpha, close);
  if (a <= 0.001) return null;

  const rise = outCubic(clamp(t / 1.1));
  const pills = clamp((t - 0.7) / 0.8);

  return (
    <g opacity={a} transform={`translate(0 ${10 - rise * 10})`}>
      <text x="76" y="140" className="reel__sage-head" fill={reel.ink}>
        Say hello to{' '}
        <tspan className="reel__sage-mark" fill={reel.accent}>
          SAGE
        </tspan>
        , your
      </text>
      <text x="76" y="178" className="reel__sage-head" fill={reel.ink}>
        personal AI-powered
      </text>
      <text x="76" y="216" className="reel__sage-head" fill={reel.ink}>
        student advisor.
      </text>

      <g opacity={pills} transform={`translate(0 ${8 * (1 - outCubic(pills))})`}>
        <rect x="76" y="244" width="150" height="30" rx="15" fill={reel.accent} />
        <text x="151" y="263" textAnchor="middle" className="reel__pill" fill="#0F172A">
          Generate a degree plan
        </text>
        <rect
          x="238"
          y="244"
          width="104"
          height="30"
          rx="15"
          fill="none"
          stroke={reel.accent}
          strokeWidth="2"
        />
        <text x="290" y="263" textAnchor="middle" className="reel__pill" fill={reel.ink}>
          Ask a question
        </text>
      </g>
    </g>
  );
}

function SageScene({ t, reel }) {
  const prob = win(t, B.problem.at, B.problem.to);
  const prod = win(t, B.product.at, B.product.to);
  const probA = beatAlpha(t, B.problem);
  const prodA = beatAlpha(t, B.product);

  const rows = [0, 1, 2, 3, 4];
  const courses = ['CS 3345', 'MATH 2418', 'CS 4348', 'ECS 3390'];
  /* Requirement categories carry credit hours in the real planner, so these
     are hours against a total rather than a done/not-done tick. */
  const reqs = [
    { label: 'Core', done: 42, total: 42 },
    { label: 'Math', done: 14, total: 17 },
    { label: 'Major', done: 36, total: 51 },
    { label: 'Comm', done: 6, total: 6 },
  ];

  /* 0 → 1 across the first 40% of the product beat: the scan. The parsed rows
     then fly across between 35% and 75%, and the answer lands last. */
  const scan = clamp(prod / 0.4);
  const fly = clamp((prod - 0.35) / 0.4);
  const answer = clamp((prod - 0.72) / 0.28);

  const count = Math.round(2000 * outCubic(win(t, B.outcome.at, B.outcome.at + 1.4)));

  return (
    <>
      {probA > 0.001 && (
        <g opacity={probA}>
          {rows.map((r) => {
            const taken = clamp((prob - r * 0.12) / 0.18);
            return (
              <g key={r} transform={`translate(190 ${96 + r * 34})`}>
                <rect width="260" height="24" rx="6" fill="#171b19" />
                <rect width={260 * taken} height="24" rx="6" fill={reel.accentSoft} />
                <text x="12" y="17" className="reel__row-label" fill={reel.ink}>
                  {`Week ${r + 1}`}
                </text>
                <text
                  x="248"
                  y="17"
                  textAnchor="end"
                  className="reel__row-label"
                  fill={reel.accent}
                  opacity={taken}
                >
                  booked
                </text>
              </g>
            );
          })}
          {/* The student who still needs an answer. */}
          <circle cx="166" cy="270" r="9" fill={reel.accent} opacity={clamp((prob - 0.55) / 0.2)} />
        </g>
      )}

      {prodA > 0.001 && (
        <g opacity={prodA}>
          {/* The transcript */}
          <g transform="translate(58 92)">
            <rect width="188" height="150" rx="8" fill="#171b19" stroke="#2a322c" />
            {courses.map((c, i) => (
              <g key={c} transform={`translate(16 ${26 + i * 28})`}>
                <text className="reel__row-label" fill={reel.ink}>
                  {c}
                </text>
                <rect y="6" width={clamp((scan - i * 0.18) / 0.2) * 140} height="2" fill={reel.accentSoft} />
              </g>
            ))}
            {/* The scan line itself */}
            <rect
              x="6"
              y={14 + 136 * inOutCubic(scan)}
              width="176"
              height="2"
              fill={reel.accent}
              opacity={scan > 0 && scan < 1 ? 0.9 : 0}
            />
          </g>

          {/* The degree plan, ticking off as rows arrive */}
          {/* The degree evaluation, as the planner actually reports it: a
              requirement category per row, with credit hours filling against
              the total rather than a bare tick. */}
          <g transform="translate(394 92)">
            <rect width="188" height="150" rx="8" fill="#171b19" stroke="#2a322c" />
            {reqs.map((r, i) => {
              const done = clamp((fly - i * 0.16) / 0.22);
              return (
                <g key={r.label} transform={`translate(16 ${28 + i * 30})`}>
                  <text className="reel__row-label" fill={reel.ink}>
                    {r.label}
                  </text>
                  <text x="156" textAnchor="end" className="reel__hrs" fill={reel.accent} opacity={done}>
                    {`${Math.round(r.done * done)}/${r.total} hrs`}
                  </text>
                  <rect y="5" width="156" height="5" rx="2.5" fill="#2a322c" />
                  <rect
                    y="5"
                    width={156 * (r.done / r.total) * outCubic(done)}
                    height="5"
                    rx="2.5"
                    fill={reel.accent}
                  />
                </g>
              );
            })}
          </g>

          {/* Rows crossing the gap, one per requirement */}
          {courses.map((c, i) => {
            const p = clamp((fly - i * 0.16) / 0.26);
            if (p <= 0 || p >= 1) return null;
            return (
              <rect
                key={c}
                x={246 + 148 * inOutCubic(p)}
                y={112 + i * 28}
                width="26"
                height="3"
                rx="1.5"
                fill={reel.accent}
                opacity={Math.sin(p * Math.PI)}
              />
            );
          })}

          {/* The answer, with the source in view — the whole point of SAGE */}
          {/* The mint pill is the site's own primary control, so the answer
              wears it and sets its text in the near-black. */}
          <g opacity={answer} transform={`translate(0 ${12 * (1 - outCubic(answer))})`}>
            <rect x="152" y="252" width="336" height="44" rx="12" fill={reel.accent} />
            <text x="172" y="272" className="reel__chat" fill="#101211">
              Take CS 4348 next — it unlocks two of your
            </text>
            <text x="172" y="288" className="reel__chat" fill="#101211">
              remaining core requirements.
            </text>
            <rect x="404" y="258" width="68" height="16" rx="8" fill="rgba(16,18,17,.18)" />
            <text x="438" y="270" textAnchor="middle" className="reel__source" fill="#101211">
              catalog p.41
            </text>
          </g>
        </g>
      )}

      <Outcome t={t} reel={reel}>
        <text x="320" y="196" textAnchor="middle" className="reel__big" fill={reel.accent}>
          {count.toLocaleString()}+
        </text>
      </Outcome>
    </>
  );
}

/* ── Semantica ──────────────────────────────────────────────────────────── */

/**
 * Semantica, as the live product actually works.
 *
 * Problem: recommendations lean on genre and tropes — enemies to lovers, the
 * chosen one — and two books with the same tropes can read nothing alike.
 * Product: the site's own four-step pipeline, in order. Split into chapters,
 * read the emotion in each, chart the arc across the book, then bring it to
 * life as a soundtrack and character voices.
 *
 * The arc is four lines in the product's own colours (joy, sadness, fear,
 * anger), not one decorative curve — that chart is the thing people recognise
 * the site by.
 */
function SemanticaScene({ t, reel }) {
  const prob = win(t, B.problem.at, B.problem.to);
  const prod = win(t, B.product.at, B.product.to);
  const probA = beatAlpha(t, B.problem);
  const prodA = beatAlpha(t, B.product);

  /* The three tropes the live site names as the blunt instrument. */
  const tropes = ['enemies to lovers', 'the chosen one', 'the locked-room mystery'];

  /* The product's own four steps, in its own order and wording. */
  const split = clamp(prod / 0.26);
  const score = clamp((prod - 0.2) / 0.24);
  const chart = clamp((prod - 0.42) / 0.34);
  const alive = clamp((prod - 0.74) / 0.26);

  /* The emotion percentages the Frankenstein page actually reports. */
  const scores = [
    { label: 'Fear', v: 0.3 },
    { label: 'Sadness', v: 0.25 },
    { label: 'Joy', v: 0.12 },
    { label: 'Anger', v: 0.1 },
  ];

  /* The app's own series, plotted on the app's own geometry. Values come
     straight from EmotionArc rather than being invented here, and the path is
     a Catmull-Rom spline because the real chart draws smooth curves, not the
     polyline a naive plot would give. */
  const CH = reel.emotions[0].values.length;
  const px = (i) => 150 + (i / (CH - 1)) * 356;
  const py = (v) => 232 - v * 108;

  const spline = (vals) => {
    const p = vals.map((v, i) => [px(i), py(v)]);
    let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] ?? p[i];
      const p1 = p[i];
      const p2 = p[i + 1];
      const p3 = p[i + 2] ?? p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  };

  const lines = reel.emotions.map((e) => ({ ...e, d: spline(e.values) }));
  const lineLen = 460;

  return (
    <>
      {probA > 0.001 && (
        <g opacity={probA}>
          {/* Two books that share every trope and read nothing alike — the
              site's own argument, staged. */}
          {[0, 1].map((b) => (
            <g key={b} transform={`translate(${196 + b * 160} 104)`} opacity={clamp((prob - b * 0.12) / 0.25)}>
              <rect width="88" height="118" rx="4" fill="#fff" stroke="#cfd0c6" />
              <rect x="14" y="18" width="60" height="4" rx="2" fill={reel.accentSoft} />
              <rect x="14" y="28" width="42" height="4" rx="2" fill={reel.accentSoft} />
              <rect x="14" y="92" width="34" height="8" rx="4" fill={reel.accent} opacity="0.75" />
            </g>
          ))}
          {tropes.map((trope, i) => {
            const p = clamp((prob - 0.28 - i * 0.1) / 0.24);
            return (
              <g key={trope} transform={`translate(190 ${240 + i * 24})`} opacity={p}>
                <rect width="260" height="19" rx="9.5" fill="#fff" stroke="#cfd0c6" />
                <text x="130" y="13" textAnchor="middle" className="reel__chip" fill={reel.accent}>
                  {trope}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {prodA > 0.001 && (
        <g opacity={prodA}>
          {/* 01 — split into chapters. The book divides into the twelve
              sections the arc is later plotted against. */}
          <g transform="translate(58 96)">
            <rect width="74" height="104" rx="4" fill="#fff" stroke="#cfd0c6" />
            {Array.from({ length: 6 }, (_, i) => (
              <rect
                key={i}
                x="10"
                y={12 + i * 15}
                width={54 * clamp((split - i * 0.1) / 0.3)}
                height="5"
                rx="2.5"
                fill={reel.accentSoft}
              />
            ))}
          </g>

          {/* 02 — read the emotion in each. The percentages the live
              Frankenstein page reports. */}
          <g transform="translate(152 104)" opacity={score}>
            {scores.map((s, i) => {
              const g = clamp((score - i * 0.1) / 0.3);
              const color = reel.emotions.find((e) => e.label === s.label)?.color ?? reel.accent;
              return (
                <g key={s.label} transform={`translate(0 ${i * 17})`}>
                  <text className="reel__trait" fill={reel.accent}>
                    {s.label}
                  </text>
                  <rect x="56" y="-8" width="96" height="6" rx="3" fill="#fff" />
                  <rect x="56" y="-8" width={96 * s.v * outCubic(g) * 3.2} height="6" rx="3" fill={color} />
                </g>
              );
            })}
          </g>

          {/* 03 — chart the arc. Four lines over twelve chapters, drawing in
              sequence, in the product's own colours. */}
          <g transform="translate(0 0)" opacity={clamp(chart / 0.2)}>
            {/* The app's chart furniture: dashed horizontal rules, a muted
                baseline, and section ticks along the bottom. */}
            {[0.25, 0.5, 0.75].map((g) => (
              <line
                key={g}
                x1="150"
                y1={232 - g * 108}
                x2="506"
                y2={232 - g * 108}
                stroke={reel.grid}
                strokeDasharray="3 5"
                strokeWidth="1"
              />
            ))}
            <line x1="150" y1="232" x2="506" y2="232" stroke={reel.axis} strokeWidth="1" />
            {Array.from({ length: CH }, (_, i) => (
              <circle key={i} cx={px(i)} cy="238" r="1.4" fill={reel.axis} />
            ))}
            {lines.map((l, i) => (
              <path
                key={l.label}
                d={l.d}
                fill="none"
                stroke={l.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={lineLen}
                strokeDashoffset={lineLen * (1 - inOutCubic(clamp((chart - i * 0.07) / 0.72)))}
              />
            ))}
            {/* The selected-section marker the real chart lights up: a rule
                through the point with a dot on the axis. */}
            {chart > 0.82 && (
              <g opacity={clamp((chart - 0.82) / 0.14)}>
                <line x1={px(7)} y1="124" x2={px(7)} y2="232" stroke={reel.mark} strokeWidth="1.2" />
                <circle cx={px(7)} cy="232" r="3.5" fill={reel.mark} />
                {lines.map((l) => (
                  <circle
                    key={l.label}
                    cx={px(7)}
                    cy={py(l.values[7])}
                    r="3.4"
                    fill="#fff"
                    stroke={l.color}
                    strokeWidth="2.2"
                  />
                ))}
              </g>
            )}
            {/* The legend the real chart carries. */}
            <g transform="translate(150 252)" opacity={clamp((chart - 0.5) / 0.3)}>
              {reel.emotions.map((e, i) => (
                <g key={e.label} transform={`translate(${i * 72} 0)`}>
                  <circle cx="4" cy="-4" r="4" fill={e.color} />
                  <text x="13" className="reel__trait" fill={reel.accent}>
                    {e.label}
                  </text>
                </g>
              ))}
            </g>
          </g>

          {/* 04 — bring it to life: the soundtrack panel and the voices. */}
          <g transform="translate(516 100)" opacity={alive}>
            <rect width="78" height="146" rx="6" fill="#fff" stroke="#cfd0c6" />
            <circle cx="20" cy="22" r="10" fill={reel.accent} />
            <path d="M17 17 L25 22 L17 27 Z" fill="#fff" />
            <text x="36" y="26" className="reel__trait" fill={reel.accent}>
              Score
            </text>
            {[0.48, 1, 0.45].map((v, i) => (
              <g key={i} transform={`translate(12 ${52 + i * 20})`}>
                <rect width="54" height="5" rx="2.5" fill={reel.accentSoft} />
                <rect
                  width={54 * v * outCubic(clamp((alive - i * 0.12) / 0.4))}
                  height="5"
                  rx="2.5"
                  fill={reel.emotions[i % reel.emotions.length].color}
                />
              </g>
            ))}
            <text x="12" y="132" className="reel__trait" fill={reel.accent}>
              voices
            </text>
          </g>
        </g>
      )}

      <Outcome t={t} reel={reel}>
        {/* The finished card: the arc, and the play control the soundtrack
            sits behind on the real page. */}
        {/* The finished card, drawn at the same coordinates as the full-size
            chart and scaled as a unit — so the mini version is the same
            curves, not a second set of numbers that can drift from them.
            0.45 maps the plot's 356 x 108 box into the card. */}
        <g transform="translate(228 120)">
          <rect width="184" height="112" rx="10" fill={reel.card} stroke={reel.cardLine} />
          <g transform="translate(-55.5 -35.8) scale(0.45)">
            {lines.map((l, i) => (
              <path
                key={l.label}
                d={l.d}
                fill="none"
                stroke={l.color}
                strokeWidth="4"
                strokeLinecap="round"
                opacity={clamp((win(t, B.outcome.at, B.outcome.to) - i * 0.08) / 0.3)}
              />
            ))}
          </g>
          <circle cx="92" cy="86" r="13" fill={reel.accent} />
          <path d="M88 80 L99 86 L88 92 Z" fill="#fff" />
        </g>
      </Outcome>
    </>
  );
}

/* ── Archer ─────────────────────────────────────────────────────────────── */

/**
 * Problem: the sketch with a detail the pencil can draw but not name.
 * Product: the entry assembles — term, period, definition — and the visual
 * collection fills in underneath, because the collection is what teaches.
 */
function ArcherScene({ t, reel }) {
  const prob = win(t, B.problem.at, B.problem.to);
  const prod = win(t, B.product.at, B.product.to);
  const probA = beatAlpha(t, B.problem);
  const prodA = beatAlpha(t, B.product);

  /* The arch is drawn as a stroke that runs on, so the sketch appears to be
     drawn rather than revealed. */
  const archPath = 'M250 250 L250 170 A70 70 0 0 1 390 170 L390 250';
  const archLen = 360;
  const word = 'VOUSSOIR';
  const typed = word.slice(0, Math.round(clamp(prod / 0.3) * word.length));

  return (
    <>
      {probA > 0.001 && (
        <g opacity={probA}>
          <path
            d={archPath}
            fill="none"
            stroke="#9b8268"
            strokeWidth="2"
            strokeDasharray={archLen}
            strokeDashoffset={archLen * (1 - outCubic(clamp(prob / 0.55)))}
          />
          {/* The stone the question is about */}
          <g opacity={clamp((prob - 0.5) / 0.25)}>
            <path d="M296 118 L312 112 L318 128 L302 134 Z" fill={reel.accentSoft} stroke="#9b8268" />
            <path d="M318 128 L360 150" stroke="#9b8268" strokeWidth="1.2" strokeDasharray="3 3" />
            <text x="366" y="156" className="reel__q">
              ?
            </text>
          </g>
        </g>
      )}

      {prodA > 0.001 && (
        <g opacity={prodA}>
          <g transform="translate(96 92)">
            <text className="reel__term" fill="#3a2a1c">
              {typed}
              <tspan opacity={prod < 0.3 && Math.floor(t * 3) % 2 ? 1 : 0}>|</tspan>
            </text>
            <g opacity={clamp((prod - 0.28) / 0.2)}>
              <rect y="12" width="112" height="18" rx="9" fill={reel.accentSoft} />
              <text x="56" y="25" textAnchor="middle" className="reel__chip">
                Romanesque · 11c
              </text>
            </g>
            <text y="58" className="reel__def" opacity={clamp((prod - 0.36) / 0.2)}>
              A wedge-shaped stone — each one in an arch,
            </text>
            <text y="76" className="reel__def" opacity={clamp((prod - 0.42) / 0.2)}>
              carrying the load sideways into the next.
            </text>
          </g>

          {/* The visual collection — the part that does the teaching */}
          <g transform="translate(96 198)">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const p = clamp((prod - 0.5 - i * 0.06) / 0.24);
              return (
                <g key={i} transform={`translate(${(i % 3) * 152} ${Math.floor(i / 3) * 56})`} opacity={p}>
                  <rect
                    width={140 * outCubic(p)}
                    height="46"
                    rx="5"
                    fill={i % 2 ? '#efe5d8' : '#e6d8c6'}
                    stroke="#d9c7b0"
                  />
                  <path
                    d={`M14 38 L38 ${20 + (i % 3) * 4} L62 38 Z`}
                    fill="#c9b198"
                    opacity={p > 0.6 ? 1 : 0}
                  />
                  <circle cx="92" cy="26" r="8" fill="#c9b198" opacity={p > 0.7 ? 1 : 0} />
                </g>
              );
            })}
          </g>
        </g>
      )}

      <Outcome t={t} reel={reel}>
        <g transform="translate(252 140)">
          <rect width="136" height="92" rx="6" fill="#efe5d8" stroke="#d9c7b0" />
          <path d="M20 74 L52 36 L84 74 Z" fill="#c9b198" />
          <circle cx="104" cy="44" r="12" fill="#c9b198" />
        </g>
      </Outcome>
    </>
  );
}

/* ── Lumina ─────────────────────────────────────────────────────────────── */

/**
 * Problem: four feeds, four charts, no answer.
 * Product: the four cards converge into one dial and resolve into a single
 * number — the only question Lumina answers is whether tonight is worth it.
 */
function LuminaScene({ t, reel }) {
  const prob = win(t, B.problem.at, B.problem.to);
  const prod = win(t, B.product.at, B.product.to);
  const probA = beatAlpha(t, B.problem);
  const prodA = beatAlpha(t, B.product);

  const feeds = ['cloud', 'moon', 'light', 'events'];
  /* Where each card starts, and where it ends up: the centre of the dial. */
  const slots = [
    [96, 110],
    [250, 110],
    [96, 196],
    [250, 196],
  ];

  const converge = clamp(prod / 0.45);
  const fill = clamp((prod - 0.4) / 0.45);
  const score = Math.round(82 * outCubic(fill));

  const R = 54;
  const C = 2 * Math.PI * R;

  return (
    <>
      {probA > 0.001 && (
        <g opacity={probA}>
          {feeds.map((f, i) => (
            <g key={f} transform={`translate(${72 + i * 128} 132)`} opacity={clamp((prob - i * 0.08) / 0.25)}>
              <rect width="104" height="96" rx="8" fill="#141833" stroke="#2b3157" />
              <text x="12" y="20" className="reel__feed">
                {f}
              </text>
              <path
                d={`M12 ${72 - i * 4} L34 ${56 + i * 6} L56 ${74 - i * 8} L92 ${50 + i * 5}`}
                fill="none"
                stroke={reel.accent}
                strokeWidth="2"
                opacity="0.8"
              />
            </g>
          ))}
          <text x="320" y="266" textAnchor="middle" className="reel__feed" opacity={clamp((prob - 0.45) / 0.3)}>
            four answers, none of them the answer
          </text>
        </g>
      )}

      {prodA > 0.001 && (
        <g opacity={prodA}>
          {/* The four cards, sliding into the middle and shrinking away */}
          {feeds.map((f, i) => {
            const [sx, sy] = slots[i];
            const p = inOutCubic(clamp((converge - i * 0.05) / 0.9));
            const x = sx + (296 - sx) * p;
            const y = sy + (152 - sy) * p;
            const s = 1 - 0.72 * p;
            return (
              <g key={f} transform={`translate(${x} ${y}) scale(${s})`} opacity={1 - p * 0.9}>
                <rect width="96" height="62" rx="8" fill="#141833" stroke="#2b3157" />
                <text x="10" y="18" className="reel__feed">
                  {f}
                </text>
              </g>
            );
          })}

          {/* The one number they fold into */}
          <g transform="translate(320 184)" opacity={clamp((converge - 0.35) / 0.3)}>
            <circle r={R} fill="none" stroke="#2b3157" strokeWidth="9" />
            <circle
              r={R}
              fill="none"
              stroke={reel.accent}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - 0.82 * outCubic(fill))}
              transform="rotate(-90)"
            />
            <text textAnchor="middle" y="12" className="reel__score">
              {score}
            </text>
            <text textAnchor="middle" y="34" className="reel__feed">
              go tonight
            </text>
          </g>
        </g>
      )}

      <Outcome t={t} reel={reel}>
        <g transform="translate(320 176)">
          <path
            d="M0 -34 L9 -10 L34 -10 L14 5 L22 30 L0 15 L-22 30 L-14 5 L-34 -10 L-9 -10 Z"
            fill={reel.accent}
          />
        </g>
      </Outcome>
    </>
  );
}

/* ── Lexicon ────────────────────────────────────────────────────────────── */

/**
 * Problem: the moment translation is needed is the moment your hands are
 * busy — mid-hike, mid-dive, mid-conversation — so a keyboard is the wrong
 * first input.
 * Product: the three inputs the app actually offers, then the decision the
 * whole design turns on — the original stays above the translation, in one
 * bubble, so a bad translation is recoverable in conversation.
 */
function LexiconScene({ t, reel }) {
  const prob = win(t, B.problem.at, B.problem.to);
  const prod = win(t, B.product.at, B.product.to);
  const probA = beatAlpha(t, B.problem);
  const prodA = beatAlpha(t, B.product);

  const modes = ['Voice', 'Text', 'Camera'];
  const pick = clamp(prod / 0.3);
  const speak = clamp((prod - 0.26) / 0.3);
  const render = clamp((prod - 0.54) / 0.34);

  return (
    <>
      {probA > 0.001 && (
        <g opacity={probA}>
          {/* A keyboard, struck through — the input the situation rules out. */}
          <g transform="translate(206 128)" opacity={clamp(prob / 0.3)}>
            <rect width="228" height="96" rx="10" fill="#171b1e" stroke="#2a3238" />
            {[0, 1, 2].map((r) => (
              <g key={r}>
                {Array.from({ length: r === 2 ? 6 : 8 }, (_, c) => (
                  <rect
                    key={c}
                    x={14 + c * 26 + (r === 2 ? 26 : 0)}
                    y={14 + r * 26}
                    width="20"
                    height="18"
                    rx="4"
                    fill="#222a2f"
                  />
                ))}
              </g>
            ))}
          </g>
          <line
            x1="206"
            y1="128"
            x2={206 + 228 * outCubic(clamp((prob - 0.3) / 0.35))}
            y2={128 + 96 * outCubic(clamp((prob - 0.3) / 0.35))}
            stroke={reel.accent}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text x="320" y="268" textAnchor="middle" className="reel__feed" fill={reel.subInk} opacity={clamp((prob - 0.55) / 0.3)}>
            mid-hike · mid-dive · mid-conversation
          </text>
        </g>
      )}

      {prodA > 0.001 && (
        <g opacity={prodA}>
          {/* The three inputs, as the home screen offers them. */}
          {modes.map((m, i) => {
            const p = clamp((pick - i * 0.12) / 0.3);
            const on = i === 0;
            return (
              <g key={m} transform={`translate(${152 + i * 116} 96)`} opacity={p}>
                <rect
                  width="104"
                  height="34"
                  rx="8"
                  fill={on ? reel.accent : '#171b1e'}
                  stroke={on ? reel.accent : '#2a3238'}
                />
                <text x="52" y="22" textAnchor="middle" className="reel__pill" fill={on ? '#06212c' : reel.ink}>
                  {m}
                </text>
              </g>
            );
          })}

          {/* The language pair — the largest object on the real home screen. */}
          <g transform="translate(152 146)" opacity={clamp((pick - 0.3) / 0.3)}>
            <rect width="336" height="44" rx="10" fill={reel.accentDeep} />
            <text x="86" y="28" textAnchor="middle" className="reel__pill" fill="#fff">
              English
            </text>
            <path d="M150 22 L186 22 M180 17 L186 22 L180 27" stroke="#fff" strokeWidth="1.6" fill="none" />
            <text x="250" y="28" textAnchor="middle" className="reel__pill" fill="#fff">
              Spanish
            </text>
          </g>

          {/* One bubble, both languages. The original on top, always. */}
          <g transform="translate(152 206)">
            <rect
              width="336"
              height="74"
              rx="12"
              fill="#171b1e"
              stroke="#2a3238"
              opacity={clamp(speak / 0.3)}
            />
            <text x="16" y="28" className="reel__chat" fill={reel.subInk} opacity={speak}>
              ¿Dónde está el sendero?
            </text>
            <line
              x1="16"
              y1="40"
              x2={16 + 304 * outCubic(render)}
              y2="40"
              stroke={reel.accent}
              strokeWidth="1"
              opacity="0.5"
            />
            <text x="16" y="60" className="reel__chat" fill={reel.ink} opacity={render}>
              Where is the trail?
            </text>
          </g>
        </g>
      )}

      <Outcome t={t} reel={reel}>
        {/* Seven screens, fanned — what the challenge actually produced. */}
        <g transform="translate(320 176)">
          {Array.from({ length: 7 }, (_, i) => {
            const p = clamp((win(t, B.outcome.at, B.outcome.to) - i * 0.07) / 0.3);
            const a = (i - 3) * 9;
            return (
              <g key={i} transform={`rotate(${a * outCubic(p)}) translate(${(i - 3) * 30} 0)`} opacity={p}>
                <rect x="-20" y="-44" width="40" height="88" rx="6" fill="#171b1e" stroke={reel.accent} strokeWidth="1.2" />
                <rect x="-13" y="-32" width="26" height="4" rx="2" fill={reel.accent} opacity="0.7" />
              </g>
            );
          })}
        </g>
      </Outcome>
    </>
  );
}

/* ── Registry ───────────────────────────────────────────────────────────── */

const SCENES = {
  sage: SageScene,
  semantica: SemanticaScene,
  lexicon: LexiconScene,
  archer: ArcherScene,
  lumina: LuminaScene,
};

/**
 * One frame of a reel at time `t`.
 *
 * The title card and the captions are shared; only the middle is per-project.
 */
export default function ReelFrame({ t, reel }) {
  const Scene = SCENES[reel.scene];
  if (!Scene) return null;

  /* SAGE opens on its own landing composition rather than the shared title
     card — it is the screen people recognise the product by. */
  const Title = reel.scene === 'sage' ? SageHero : TitleCard;

  return (
    <>
      <Scene t={t} reel={reel} />
      <Title t={t} reel={reel} />
      <Caption t={t} beat={B.problem} accent={reel.accent} ink={reel.ink}>
        {reel.problem}
      </Caption>
      <Caption t={t} beat={B.product} accent={reel.accent} ink={reel.ink}>
        {reel.product}
      </Caption>
    </>
  );
}
