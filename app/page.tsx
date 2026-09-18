"use client";

import {
  LazyMotion,
  MotionConfig,
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { useRef, type PointerEvent as ReactPointerEvent } from "react";

const focusAreas = [
  {
    number: "01",
    title: "Prodotti digitali",
    description:
      "Trasformo un’intuizione in un’esperienza chiara, utile e piacevole da usare.",
    shape: "product",
  },
  {
    number: "02",
    title: "Software",
    description:
      "Costruisco soluzioni solide, curate nei dettagli e pensate per evolvere.",
    shape: "software",
  },
  {
    number: "03",
    title: "AI & automazione",
    description:
      "Esploro nuovi modi di semplificare il lavoro e amplificare le idee.",
    shape: "automation",
  },
] as const;

const principles = [
  "Curiosità prima delle certezze",
  "Chiarezza prima del rumore",
  "Persone prima degli strumenti",
];

const journeyWaypoints = [
  { position: 0, label: "Inizio" },
  { position: 0.24, label: "Chi sono" },
  { position: 0.49, label: "Cosa faccio" },
  { position: 0.73, label: "Metodo" },
  { position: 1, label: "Contatto" },
];

const loadMotionFeatures = () =>
  import("./motion-features").then((module) => module.default);

type FocusArea = (typeof focusAreas)[number];

function JourneyWaypoint({
  progress,
  position,
  label,
}: {
  progress: MotionValue<number>;
  position: number;
  label: string;
}) {
  const opacity = useTransform(
    progress,
    [position - 0.08, position, position + 0.08],
    [0.25, 1, 0.42],
  );
  const scale = useTransform(
    progress,
    [position - 0.035, position, position + 0.035],
    [0.72, 1.35, 0.82],
  );

  return (
    <m.div
      className="journey-waypoint"
      style={{ top: `${position * 100}%`, opacity }}
    >
      <span className="journey-label">{label}</span>
      <m.span className="journey-node" style={{ scale }} />
    </m.div>
  );
}

function ScrollJourney({
  progress,
  velocity,
  shouldReduceMotion,
}: {
  progress: MotionValue<number>;
  velocity: MotionValue<number>;
  shouldReduceMotion: boolean;
}) {
  const ballY = useTransform(progress, (value) => {
    if (typeof window === "undefined") return 0;
    const reservedSpace = window.innerWidth <= 680 ? 118 : 146;
    return value * Math.max(0, window.innerHeight - reservedSpace);
  });
  const ballColor = useTransform(
    progress,
    [0, 0.24, 0.49, 0.73, 1],
    ["#d8ff3e", "#ff664f", "#f2efe8", "#3157ff", "#11100f"],
  );
  const journeyOpacity = useTransform(progress, [0, 0.96, 1], [1, 1, 0]);
  const targetStretch = useTransform(
    velocity,
    [-1800, 0, 1800],
    [1.55, 1, 1.55],
  );
  const ballScaleY = useSpring(targetStretch, {
    stiffness: 260,
    damping: 28,
  });
  const ballScaleX = useTransform(ballScaleY, [1, 1.55], [1, 0.72]);

  return (
    <m.aside
      className="scroll-journey"
      aria-hidden="true"
      style={{ opacity: shouldReduceMotion ? 0 : journeyOpacity }}
    >
      <span className="journey-rail" />
      <m.span className="journey-fill" style={{ scaleY: progress }} />
      {journeyWaypoints.map((waypoint) => (
        <JourneyWaypoint
          key={waypoint.label}
          progress={progress}
          position={waypoint.position}
          label={waypoint.label}
        />
      ))}
      <m.span
        className="journey-ball"
        style={{
          y: ballY,
          backgroundColor: ballColor,
          scaleX: shouldReduceMotion ? 1 : ballScaleX,
          scaleY: shouldReduceMotion ? 1 : ballScaleY,
        }}
      />
    </m.aside>
  );
}

function FocusCard({
  area,
  index,
  progress,
  shouldReduceMotion,
}: {
  area: FocusArea;
  index: number;
  progress: MotionValue<number>;
  shouldReduceMotion: boolean;
}) {
  const cardBounds = useRef<DOMRect | null>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 260, damping: 24 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 260, damping: 24 });
  const start = 0.04 + index * 0.11;
  const end = start + 0.34;
  const y = useTransform(progress, [start, end], [64, 0]);
  const scale = useTransform(progress, [start, end], [0.94, 1]);
  const rotateZ = useTransform(
    progress,
    [start, end],
    [index === 1 ? 0 : index === 0 ? -1.8 : 1.8, 0],
  );
  const shapeRotate = useTransform(
    progress,
    [start, end],
    [index === 1 ? -45 : 30 + index * 18, 0],
  );
  const shapeScale = useTransform(progress, [start, end], [0.72, 1]);

  const handlePointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") {
      cardBounds.current = event.currentTarget.getBoundingClientRect();
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || shouldReduceMotion) return;
    const bounds = cardBounds.current;
    if (!bounds) return;

    const normalizedX = (event.clientX - bounds.left) / bounds.width;
    const normalizedY = (event.clientY - bounds.top) / bounds.height;
    tiltY.set((normalizedX - 0.5) * 3.2);
    tiltX.set((0.5 - normalizedY) * 3.2);
    event.currentTarget.style.setProperty("--spot-x", `${normalizedX * 100}%`);
    event.currentTarget.style.setProperty("--spot-y", `${normalizedY * 100}%`);
  };

  const handlePointerLeave = () => {
    cardBounds.current = null;
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <m.article
      className="focus-card"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        shouldReduceMotion
          ? undefined
          : {
              y,
              scale,
              rotateZ,
              rotateX: smoothTiltX,
              rotateY: smoothTiltY,
            }
      }
    >
      <div className={`shape shape-${area.shape}`} aria-hidden="true">
        <m.div
          style={
            shouldReduceMotion
              ? undefined
              : { rotate: shapeRotate, scale: shapeScale }
          }
        />
        <span className="shape-coordinate">0{index + 1} / 03</span>
      </div>
      <div className="focus-meta">
        <span>{area.number}</span>
        <h3>{area.title}</h3>
        <p>{area.description}</p>
      </div>
    </m.article>
  );
}

function PrincipleRow({
  principle,
  index,
  progress,
  shouldReduceMotion,
}: {
  principle: string;
  index: number;
  progress: MotionValue<number>;
  shouldReduceMotion: boolean;
}) {
  const start = 0.1 + index * 0.17;
  const end = start + 0.3;
  const fillScale = useTransform(progress, [start, end], [0, 1]);
  const contentX = useTransform(
    progress,
    [start, end],
    [index % 2 === 0 ? -20 : 20, 0],
  );

  return (
    <m.div
      className="principle"
      style={shouldReduceMotion ? undefined : { x: contentX }}
      tabIndex={0}
    >
      <m.span
        className="principle-fill"
        style={{ scaleX: shouldReduceMotion ? 1 : fillScale }}
      />
      <span>0{index + 1}</span>
      <p>{principle}</p>
      <span className="principle-arrow" aria-hidden="true">↗</span>
    </m.div>
  );
}

function MagneticLink({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  const linkBounds = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 240, damping: 18 });
  const smoothY = useSpring(y, { stiffness: 240, damping: 18 });

  const handlePointerEnter = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "mouse") {
      linkBounds.current = event.currentTarget.getBoundingClientRect();
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" || shouldReduceMotion) return;
    const bounds = linkBounds.current;
    if (!bounds) return;
    x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 14);
    y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 10);
  };

  const handlePointerLeave = () => {
    linkBounds.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <m.a
      className="contact-link"
      href="https://github.com/ex3meex"
      target="_blank"
      rel="noreferrer"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={shouldReduceMotion ? undefined : { x: smoothX, y: smoothY }}
    >
      <span>Facciamola succedere</span>
      <span className="contact-link-arrow" aria-hidden="true">↗</span>
    </m.a>
  );
}

export default function Home() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const principlesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const heroBounds = useRef<DOMRect | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 120, damping: 24 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 120, damping: 24 });

  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 115,
    damping: 28,
    mass: 0.25,
  });
  const scrollVelocity = useVelocity(scrollY);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: workProgress } = useScroll({
    target: workRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: principlesProgress } = useScroll({
    target: principlesRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: contactProgress } = useScroll({
    target: contactRef,
    offset: ["start end", "end end"],
  });

  const navBackground = useTransform(
    smoothProgress,
    [0, 0.12],
    ["rgba(17,16,15,0)", "rgba(17,16,15,0.88)"],
  );
  const coralX = useTransform(smoothPointerX, [-0.5, 0.5], [-28, 28]);
  const coralY = useTransform(smoothPointerY, [-0.5, 0.5], [-24, 24]);
  const blueX = useTransform(smoothPointerX, [-0.5, 0.5], [18, -18]);
  const blueY = useTransform(smoothPointerY, [-0.5, 0.5], [16, -16]);
  const coralRotate = useTransform(heroProgress, [0, 1], [0, 46]);
  const coralScale = useTransform(heroProgress, [0, 1], [1, 0.68]);
  const coralRadius = useTransform(
    heroProgress,
    [0, 0.55, 1],
    ["34% 66% 58% 42%", "62% 38% 30% 70%", "50%"],
  );
  const blueRotate = useTransform(heroProgress, [0, 1], [0, 115]);
  const blueScale = useTransform(heroProgress, [0, 1], [1, 0.62]);
  const heroGridY = useTransform(heroProgress, [0, 1], [0, 90]);
  const heroLineOneX = useTransform(heroProgress, [0, 1], [0, -84]);
  const heroLineTwoX = useTransform(heroProgress, [0, 1], [0, 110]);
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.82, 1], [1, 1, 0.28]);
  const heroBottomY = useTransform(heroProgress, [0, 1], [0, -28]);
  const tapeX = useTransform(smoothProgress, [0.08, 0.32], ["0%", "-24%"]);
  const aboutAmbientX = useTransform(aboutProgress, [0, 1], [-110, 120]);
  const aboutTitleY = useTransform(aboutProgress, [0.12, 0.5], [70, 0]);
  const aboutAccentX = useTransform(aboutProgress, [0.08, 0.62], [-55, 0]);
  const aboutDividerScale = useTransform(aboutProgress, [0.08, 0.48], [0, 1]);
  const aboutParagraphOneY = useTransform(aboutProgress, [0.2, 0.52], [42, 0]);
  const aboutParagraphTwoY = useTransform(aboutProgress, [0.28, 0.6], [42, 0]);
  const workHeadingX = useTransform(workProgress, [0.08, 0.45, 1], [80, 0, -55]);
  const principlesTitleY = useTransform(principlesProgress, [0.08, 0.42], [62, 0]);
  const contactTitleY = useTransform(contactProgress, [0.02, 0.58], [90, 0]);
  const contactShapeScale = useTransform(contactProgress, [0, 1], [0.58, 1.12]);
  const contactShapeRotate = useTransform(contactProgress, [0, 1], [-18, 4]);
  const contactShapeRadius = useTransform(
    contactProgress,
    [0, 0.55, 1],
    ["58% 42% 28% 72%", "31% 69% 62% 38%", "48% 52% 29% 71%"],
  );

  const handleHeroPointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") {
      heroBounds.current = event.currentTarget.getBoundingClientRect();
    }
  };

  const handleHeroPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || shouldReduceMotion) return;
    const bounds = heroBounds.current;
    if (!bounds) return;
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const handleHeroPointerLeave = () => {
    heroBounds.current = null;
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <main>
          <m.div className="scroll-progress" style={{ scaleX: smoothProgress }} />
          <ScrollJourney
            progress={smoothProgress}
            velocity={scrollVelocity}
            shouldReduceMotion={shouldReduceMotion}
          />

          <m.nav
            className="site-nav"
            aria-label="Navigazione principale"
            style={{ backgroundColor: navBackground }}
          >
            <a className="monogram" href="#top" aria-label="Torna all’inizio">
              <span>NC</span>
            </a>
            <div className="nav-links">
              <a href="#about">Chi sono</a>
              <a href="#work">Cosa faccio</a>
              <a className="nav-cta" href="#contact">Parliamone</a>
            </div>
          </m.nav>

          <section
            ref={heroRef}
            id="top"
            className="hero"
            onPointerEnter={handleHeroPointerEnter}
            onPointerMove={handleHeroPointerMove}
            onPointerLeave={handleHeroPointerLeave}
          >
            <m.div
              className="hero-grid"
              aria-hidden="true"
              style={shouldReduceMotion ? undefined : { y: heroGridY }}
            />
            <m.div
              className="hero-orbit hero-orbit-coral"
              aria-hidden="true"
              style={
                shouldReduceMotion
                  ? undefined
                  : {
                      x: coralX,
                      y: coralY,
                      rotate: coralRotate,
                      scale: coralScale,
                      borderRadius: coralRadius,
                    }
              }
            />
            <m.div
              className="hero-orbit hero-orbit-blue"
              aria-hidden="true"
              style={
                shouldReduceMotion
                  ? undefined
                  : {
                      x: blueX,
                      y: blueY,
                      rotate: blueRotate,
                      scale: blueScale,
                    }
              }
            />

            <m.div
              className="hero-copy"
              style={shouldReduceMotion ? undefined : { opacity: heroCopyOpacity }}
            >
              <p className="eyebrow">
                Ciao, sono Nicolò <span aria-hidden="true">↘</span>
              </p>
              <h1>
                <m.span
                  className="title-line"
                  style={shouldReduceMotion ? undefined : { x: heroLineOneX }}
                >
                  Idee complesse.
                </m.span>
                <m.span
                  className="title-line title-line-accent"
                  style={shouldReduceMotion ? undefined : { x: heroLineTwoX }}
                >
                  Esperienze semplici.
                </m.span>
              </h1>
              <m.div
                className="hero-bottom"
                style={shouldReduceMotion ? undefined : { y: heroBottomY }}
              >
                <p>
                  Questo è il mio spazio personale: un racconto in evoluzione tra
                  tecnologia, creatività e cose costruite bene.
                </p>
                <a className="round-link" href="#about" aria-label="Scopri chi sono">
                  <span aria-hidden="true">↓</span>
                </a>
              </m.div>
            </m.div>
          </section>

          <div className="kinetic-band" aria-hidden="true">
            <m.div
              className="kinetic-track"
              style={shouldReduceMotion ? undefined : { x: tapeX }}
            >
              {Array.from({ length: 4 }, (_, index) => (
                <span key={index}>
                  DESIGN <i>×</i> CODICE <i>×</i> IDEE <i>×</i> FUTURO <i>×</i>
                </span>
              ))}
            </m.div>
          </div>

          <section ref={aboutRef} id="about" className="about section-shell">
            <m.div
              className="ambient-word"
              aria-hidden="true"
              style={shouldReduceMotion ? undefined : { x: aboutAmbientX }}
            >
              NICO
            </m.div>
            <p className="section-label">01 / Chi sono</p>
            <m.div
              className="about-copy"
              style={shouldReduceMotion ? undefined : { y: aboutTitleY }}
            >
              <h2>
                Sono Nicolò Castellini.
                <br />
                <m.span
                  style={shouldReduceMotion ? undefined : { x: aboutAccentX }}
                >
                  Mi piace dare forma alle possibilità.
                </m.span>
              </h2>
              <m.div
                className="about-divider"
                aria-hidden="true"
                style={{ scaleX: shouldReduceMotion ? 1 : aboutDividerScale }}
              />
              <div className="about-details">
                <m.p
                  style={
                    shouldReduceMotion ? undefined : { y: aboutParagraphOneY }
                  }
                >
                  Mi muovo tra progettazione, sviluppo e sperimentazione. Cerco il
                  punto in cui un’idea smette di essere astratta e diventa qualcosa
                  che le persone possono davvero usare.
                </m.p>
                <m.p
                  style={
                    shouldReduceMotion ? undefined : { y: aboutParagraphTwoY }
                  }
                >
                  Credo nella tecnologia quando riduce la distanza tra un problema
                  e la sua soluzione. Il mio approccio unisce pensiero analitico,
                  attenzione visiva e una curiosità che non sta mai ferma.
                </m.p>
              </div>
            </m.div>
          </section>

          <section ref={workRef} id="work" className="work section-shell">
            <div className="section-heading">
              <p className="section-label">02 / Cosa faccio</p>
              <m.h2
                style={shouldReduceMotion ? undefined : { x: workHeadingX }}
              >
                Costruisco, collego, <em>evolvo.</em>
              </m.h2>
            </div>
            <div className="focus-list">
              {focusAreas.map((area, index) => (
                <FocusCard
                  area={area}
                  index={index}
                  key={area.title}
                  progress={workProgress}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>
          </section>

          <section
            ref={principlesRef}
            className="principles section-shell"
            aria-labelledby="principles-title"
          >
            <p className="section-label">03 / Il mio modo di lavorare</p>
            <m.h2
              id="principles-title"
              style={shouldReduceMotion ? undefined : { y: principlesTitleY }}
            >
              Poche regole.
              <br />
              <em>Molto intenzionali.</em>
            </m.h2>
            <div className="principles-list">
              {principles.map((principle, index) => (
                <PrincipleRow
                  key={principle}
                  principle={principle}
                  index={index}
                  progress={principlesProgress}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>
          </section>

          <footer ref={contactRef} id="contact" className="contact">
            <m.div
              className="contact-shape"
              aria-hidden="true"
              style={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: contactShapeScale,
                      rotate: contactShapeRotate,
                      borderRadius: contactShapeRadius,
                    }
              }
            />
            <div className="contact-content">
              <p className="section-label">04 / Il prossimo passo</p>
              <m.h2
                style={shouldReduceMotion ? undefined : { y: contactTitleY }}
              >
                Hai un’idea?
              </m.h2>
              <MagneticLink shouldReduceMotion={shouldReduceMotion} />
            </div>
            <div className="footer-row">
              <p>© {new Date().getFullYear()} Nicolò Castellini</p>
              <p>Fatto con curiosità e codice.</p>
            </div>
          </footer>
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
