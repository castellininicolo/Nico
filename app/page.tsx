"use client";

import {
  LazyMotion,
  MotionConfig,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

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

function HeroComposition({
  progress,
  pointerX,
  pointerY,
  shouldReduceMotion,
}: {
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  shouldReduceMotion: boolean;
}) {
  const [activeNodes, setActiveNodes] = useState(0);
  const activeCount = [0, 1, 2].filter(
    (index) => (activeNodes & (1 << index)) !== 0,
  ).length;
  const isComplete = activeCount === 3;

  const coralX = useTransform(pointerX, [-0.5, 0.5], [-30, 30]);
  const coralY = useTransform(pointerY, [-0.5, 0.5], [-24, 24]);
  const blueX = useTransform(pointerX, [-0.5, 0.5], [20, -20]);
  const blueY = useTransform(pointerY, [-0.5, 0.5], [17, -17]);
  const acidX = useTransform(pointerX, [-0.5, 0.5], [-14, 34]);
  const acidY = useTransform(pointerY, [-0.5, 0.5], [22, -12]);
  const paperX = useTransform(pointerX, [-0.5, 0.5], [12, -24]);
  const paperY = useTransform(pointerY, [-0.5, 0.5], [-10, 26]);

  const coralRotate = useTransform(progress, [0, 1], [0, 112]);
  const coralScale = useTransform(progress, [0, 0.62, 1], [1, 0.82, 0.62]);
  const coralRadius = useTransform(
    progress,
    [0, 0.42, 0.76, 1],
    ["34% 66% 58% 42%", "62% 38% 30% 70%", "24% 76% 62% 38%", "50%"],
  );
  const coralColor = useTransform(
    progress,
    [0, 0.34, 0.7, 1],
    ["#ff664f", "#d8ff3e", "#3157ff", "#f2efe8"],
  );
  const blueRotate = useTransform(progress, [0, 1], [0, -168]);
  const blueScale = useTransform(progress, [0, 0.58, 1], [1, 1.12, 0.66]);
  const blueColor = useTransform(
    progress,
    [0, 0.38, 0.74, 1],
    ["#3157ff", "#ff664f", "#d8ff3e", "#3157ff"],
  );
  const acidRotate = useTransform(progress, [0, 1], [-18, 238]);
  const acidScale = useTransform(progress, [0, 0.48, 1], [0.78, 1.14, 0.72]);
  const acidColor = useTransform(
    progress,
    [0, 0.5, 1],
    ["#d8ff3e", "#3157ff", "#ff664f"],
  );
  const paperRotate = useTransform(progress, [0, 1], [24, -124]);
  const paperScale = useTransform(progress, [0, 0.55, 1], [0.86, 1.08, 0.7]);

  const toggleNode = (index: number) => {
    setActiveNodes((current) => current ^ (1 << index));
  };

  const nodes = [
    {
      className: "hero-shape-coral",
      label: "Segnale strategia",
      x: coralX,
      y: coralY,
      rotate: coralRotate,
      scale: coralScale,
      bodyStyle: { backgroundColor: coralColor, borderRadius: coralRadius },
    },
    {
      className: "hero-shape-blue",
      label: "Segnale tecnologia",
      x: blueX,
      y: blueY,
      rotate: blueRotate,
      scale: blueScale,
      bodyStyle: { color: blueColor },
    },
    {
      className: "hero-shape-acid",
      label: "Segnale design",
      x: acidX,
      y: acidY,
      rotate: acidRotate,
      scale: acidScale,
      bodyStyle: { backgroundColor: acidColor },
    },
  ];

  return (
    <div className={`hero-composition${isComplete ? " is-complete" : ""}`}>
      <span className="hero-connection hero-connection-one" aria-hidden="true" />
      <span className="hero-connection hero-connection-two" aria-hidden="true" />
      <span className="hero-connection hero-connection-three" aria-hidden="true" />
      {nodes.map((node, index) => {
        const isActive = (activeNodes & (1 << index)) !== 0;

        return (
          <m.button
            key={node.className}
            type="button"
            className={`hero-shape ${node.className}${isActive ? " is-active" : ""}`}
            aria-label={node.label}
            aria-pressed={isActive}
            onClick={() => toggleNode(index)}
            style={
              shouldReduceMotion
                ? undefined
                : {
                    x: node.x,
                    y: node.y,
                    rotate: node.rotate,
                    scale: node.scale,
                  }
            }
          >
            <m.span
              className="hero-shape-body"
              aria-hidden="true"
              style={shouldReduceMotion ? undefined : node.bodyStyle}
              animate={
                shouldReduceMotion
                  ? undefined
                  : isActive
                    ? { scale: [1, 0.88, 1.08, 1], rotate: [0, -6, 4, 0] }
                    : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.48, ease: "easeOut" }}
            />
            <span className="hero-shape-index" aria-hidden="true">
              0{index + 1}
            </span>
          </m.button>
        );
      })}
      <m.span
        className="hero-shape hero-shape-paper"
        aria-hidden="true"
        style={
          shouldReduceMotion
            ? undefined
            : { x: paperX, y: paperY, rotate: paperRotate, scale: paperScale }
        }
      >
        <span className="hero-shape-body" />
      </m.span>
      <div className="hero-reactor-status" aria-live="polite">
        <span>IDEA REACTOR / 01</span>
        <strong>{isComplete ? "Composizione attiva" : `${activeCount}/3 segnali`}</strong>
        <small>{isComplete ? "Strategia, tecnologia e design allineati." : "Seleziona le forme."}</small>
      </div>
    </div>
  );
}

function FocusVisual({
  area,
  index,
  progress,
  isActive,
  isEngaged,
  shouldReduceMotion,
}: {
  area: FocusArea;
  index: number;
  progress: MotionValue<number>;
  isActive: boolean;
  isEngaged: boolean;
  shouldReduceMotion: boolean;
}) {
  const stageRotate = useTransform(
    progress,
    [0, 0.38, 0.72, 1],
    [index === 1 ? -48 : -78, 12, -8, index === 2 ? 210 : 155],
  );
  const stageScale = useTransform(
    progress,
    [0, 0.38, 0.72, 1],
    [0.58, 1.08, 0.94, 0.76],
  );
  const stageY = useTransform(progress, [0, 0.45, 1], [72, -8, -46]);
  const orbitRotate = useTransform(progress, [0, 1], [-160, 390]);
  const counterRotate = useTransform(progress, [0, 1], [90, -310]);
  const orbitScale = useTransform(
    progress,
    [0, 0.42, 0.72, 1],
    [0.5, 1.16, 0.88, 1.04],
  );
  const satelliteX = useTransform(progress, [0, 0.5, 1], [-52, 18, 46]);
  const satelliteY = useTransform(progress, [0, 0.5, 1], [44, -28, 24]);
  const panelSpread = useTransform(
    progress,
    [0, 0.42, 0.72, 1],
    [1, 0.08, 0.32, 0.78],
  );
  const panelAX = useTransform(panelSpread, [0, 1], [0, -64]);
  const panelAY = useTransform(panelSpread, [0, 1], [0, -42]);
  const panelARotate = useTransform(panelSpread, [0, 1], [0, -24]);
  const panelBX = useTransform(panelSpread, [0, 1], [0, 58]);
  const panelBY = useTransform(panelSpread, [0, 1], [0, 38]);
  const panelBRotate = useTransform(panelSpread, [0, 1], [0, 19]);
  const networkScale = useTransform(
    progress,
    [0, 0.35, 0.72, 1],
    [0.38, 1.14, 0.82, 1.05],
  );
  const networkRotate = useTransform(progress, [0, 1], [-120, 410]);
  const nodeScale = useTransform(
    progress,
    [0, 0.28, 0.58, 0.82, 1],
    [0.2, 1, 0.62, 1.18, 0.82],
  );
  const isMoving = isActive && !shouldReduceMotion;

  return (
    <div
      className={`shape shape-${area.shape}${isEngaged ? " is-engaged" : ""}`}
      aria-hidden="true"
    >
      <m.div
        className="shape-stage"
        style={
          shouldReduceMotion
            ? undefined
            : { rotate: stageRotate, scale: stageScale, y: stageY }
        }
      >
        <m.div
          className="shape-live"
          animate={
            isMoving
              ? {
                  y: [0, isEngaged ? -15 : -9, 0],
                  rotate: [0, index === 1 ? (isEngaged ? -6 : -2) : isEngaged ? 7 : 3, 0],
                  scale: isEngaged ? [1, 1.055, 1] : 1,
                }
              : { y: 0, rotate: 0, scale: 1 }
          }
          transition={{
            duration: 5.8 + index * 0.8,
            ease: "easeInOut",
            repeat: isMoving ? Infinity : 0,
          }}
        >
          {area.shape === "product" && (
            <>
              <m.span
                className="product-orbit"
                style={
                  shouldReduceMotion
                    ? undefined
                    : { rotate: orbitRotate, scale: orbitScale }
                }
              >
                <m.span
                  className="product-orbit-live"
                  animate={isMoving ? { rotate: [0, 360] } : { rotate: 0 }}
                  transition={{
                    duration: 8,
                    ease: "linear",
                    repeat: isMoving ? Infinity : 0,
                  }}
                >
                  <span className="product-satellite product-satellite-a" />
                  <span className="product-satellite product-satellite-b" />
                </m.span>
              </m.span>
              <m.span
                className="product-core"
                style={
                  shouldReduceMotion
                    ? undefined
                    : { rotate: counterRotate, scale: orbitScale }
                }
              />
              <m.span
                className="product-cardlet"
                style={
                  shouldReduceMotion
                    ? undefined
                    : { x: satelliteX, y: satelliteY, rotate: orbitRotate }
                }
              />
            </>
          )}

          {area.shape === "software" && (
            <>
              <m.span
                className="software-panel software-panel-a"
                style={
                  shouldReduceMotion
                    ? undefined
                    : { x: panelAX, y: panelAY, rotate: panelARotate }
                }
              />
              <m.span
                className="software-panel software-panel-b"
                style={
                  shouldReduceMotion
                    ? undefined
                    : { x: panelBX, y: panelBY, rotate: panelBRotate }
                }
              />
              <m.span
                className="software-panel software-panel-main"
                style={
                  shouldReduceMotion
                    ? undefined
                    : { rotate: counterRotate, scale: orbitScale }
                }
              >
                <i />
                <i />
                <i />
                <strong>&lt;/&gt;</strong>
              </m.span>
              <m.span
                className="software-scanner"
                animate={
                  isMoving
                    ? { x: ["-150%", "150%"], opacity: [0, 0.85, 0] }
                    : { x: "-150%", opacity: 0 }
                }
                transition={{
                  duration: 4.8,
                  ease: "easeInOut",
                  repeat: isMoving ? Infinity : 0,
                }}
              />
            </>
          )}

          {area.shape === "automation" && (
            <m.div
              className="automation-system"
              style={
                shouldReduceMotion
                  ? undefined
                  : { rotate: networkRotate, scale: networkScale }
              }
            >
              <m.div
                className="automation-live"
                animate={isMoving ? { rotate: [0, 360] } : { rotate: 0 }}
                transition={{
                  duration: 9,
                  ease: "linear",
                  repeat: isMoving ? Infinity : 0,
                }}
              >
                <span className="automation-line automation-line-a" />
                <span className="automation-line automation-line-b" />
                <span className="automation-line automation-line-c" />
                <m.span
                  className="automation-node automation-node-a"
                  style={shouldReduceMotion ? undefined : { scale: nodeScale }}
                />
                <m.span
                  className="automation-node automation-node-b"
                  style={shouldReduceMotion ? undefined : { scale: nodeScale }}
                />
                <m.span
                  className="automation-node automation-node-c"
                  style={shouldReduceMotion ? undefined : { scale: nodeScale }}
                />
              </m.div>
              <m.span
                className="automation-core"
                style={
                  shouldReduceMotion
                    ? undefined
                    : { rotate: counterRotate, scale: nodeScale }
                }
              />
            </m.div>
          )}
        </m.div>
      </m.div>
      <span className="shape-coordinate">0{index + 1} / 03</span>
    </div>
  );
}

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

function AlignmentGame({
  progress,
  shouldReduceMotion,
}: {
  progress: MotionValue<number>;
  shouldReduceMotion: boolean;
}) {
  const [status, setStatus] = useState<"ready" | "near" | "solved">("ready");
  const [attempts, setAttempts] = useState(0);
  const tokenX = useMotionValue(-62);
  const tokenY = useMotionValue(54);
  const smoothTokenX = useSpring(tokenX, { stiffness: 310, damping: 25 });
  const smoothTokenY = useSpring(tokenY, { stiffness: 310, damping: 25 });
  const outerRotate = useTransform(progress, [0, 1], [-80, 285]);
  const innerRotate = useTransform(progress, [0, 1], [90, -250]);
  const needleRotate = useTransform(progress, [0, 1], [-105, 128]);

  const placeToken = (x: number, y: number, shouldCountAttempt = true) => {
    const distance = Math.hypot(x, y);

    if (distance <= 34) {
      tokenX.set(0);
      tokenY.set(0);
      setStatus("solved");
    } else {
      tokenX.set(x);
      tokenY.set(y);
      setStatus(distance <= 82 ? "near" : "ready");
    }

    if (shouldCountAttempt) {
      setAttempts((current) => current + 1);
    }
  };

  const resetGame = () => {
    tokenX.set(-62);
    tokenY.set(54);
    setAttempts(0);
    setStatus("ready");
  };

  const handleBoardClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (status === "solved") return;

    if (event.detail === 0) {
      placeToken(0, 0);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const limit = Math.max(0, Math.min(bounds.width, bounds.height) / 2 - 34);
    const x = Math.max(-limit, Math.min(limit, event.clientX - bounds.left - bounds.width / 2));
    const y = Math.max(-limit, Math.min(limit, event.clientY - bounds.top - bounds.height / 2));
    placeToken(x, y);
  };

  const handleBoardKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key.toLowerCase() === "r" || event.key === "Home") {
      event.preventDefault();
      resetGame();
      return;
    }

    if (status === "solved" || !event.key.startsWith("Arrow")) return;

    event.preventDefault();
    const step = event.shiftKey ? 18 : 10;
    const bounds = event.currentTarget.getBoundingClientRect();
    const limit = Math.max(0, Math.min(bounds.width, bounds.height) / 2 - 34);
    const nextX = Math.max(
      -limit,
      Math.min(
        limit,
        tokenX.get() +
          (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0),
      ),
    );
    const nextY = Math.max(
      -limit,
      Math.min(
        limit,
        tokenY.get() +
          (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0),
      ),
    );
    placeToken(nextX, nextY, false);
  };

  const statusCopy =
    status === "solved"
      ? "Intento allineato. Il sistema è coerente."
      : status === "near"
        ? "Quasi: porta il segnale ancora più vicino al centro."
        : "Posiziona il segnale nel nucleo centrale.";

  return (
    <div className={`alignment-game alignment-game-${status}`}>
      <div className="alignment-copy" id="alignment-instructions">
        <span>CALIBRA / 03</span>
        <p>Tocca o clicca il quadrante per portare il segnale nel suo centro.</p>
      </div>
      <span className="sr-only" id="alignment-keyboard-help">
        Usa le frecce per muovere il segnale, Maiusc per passi più ampi, Invio per
        allinearlo e R oppure Home per ricominciare.
      </span>
      <m.button
        type="button"
        className="principles-machine alignment-board"
        aria-label="Calibra il segnale portandolo al centro del quadrante"
        aria-describedby="alignment-instructions alignment-keyboard-help alignment-feedback"
        aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Home R"
        onClick={handleBoardClick}
        onKeyDown={handleBoardKeyDown}
      >
        <m.span
          className="machine-ring machine-ring-outer"
          aria-hidden="true"
          style={shouldReduceMotion ? undefined : { rotate: outerRotate }}
        />
        <m.span
          className="machine-ring machine-ring-inner"
          aria-hidden="true"
          style={shouldReduceMotion ? undefined : { rotate: innerRotate }}
        />
        <m.span
          className="machine-needle"
          aria-hidden="true"
          style={shouldReduceMotion ? undefined : { rotate: needleRotate }}
        />
        <span className="machine-core" aria-hidden="true" />
        <m.span
          className="alignment-token"
          aria-hidden="true"
          style={{
            x: shouldReduceMotion ? tokenX : smoothTokenX,
            y: shouldReduceMotion ? tokenY : smoothTokenY,
          }}
          animate={
            shouldReduceMotion || status !== "solved"
              ? undefined
              : { scale: [1, 1.22, 1], rotate: [0, 18, 0] }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <span className="machine-label" aria-hidden="true">
          {status === "solved" ? "ALIGNED / 03" : "INTENT / 03"}
        </span>
      </m.button>
      <div className="alignment-footer">
        <p id="alignment-feedback" aria-live="polite">
          {statusCopy}
          {attempts > 0 && status !== "solved" ? ` Tentativi: ${attempts}.` : ""}
        </p>
        <button type="button" className="alignment-reset" onClick={resetGame}>
          Reimposta
        </button>
      </div>
    </div>
  );
}

function FocusCard({
  area,
  index,
  shouldReduceMotion,
}: {
  area: FocusArea;
  index: number;
  shouldReduceMotion: boolean;
}) {
  const [isEngaged, setIsEngaged] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const cardBounds = useRef<DOMRect | null>(null);
  const isInView = useInView(cardRef, { margin: "-8% 0px -8% 0px" });
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const smoothCardProgress = useSpring(cardProgress, {
    stiffness: 145,
    damping: 28,
    mass: 0.22,
  });
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 260, damping: 24 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 260, damping: 24 });
  const y = useTransform(smoothCardProgress, [0, 0.22, 0.78, 1], [58, 0, 0, -28]);
  const scale = useTransform(
    smoothCardProgress,
    [0, 0.25, 0.78, 1],
    [0.94, 1, 1, 0.97],
  );
  const rotateZ = useTransform(
    smoothCardProgress,
    [0, 0.24, 0.8, 1],
    [index === 1 ? 1.2 : index === 0 ? -2.2 : 2.2, 0, 0, index - 1],
  );

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
      ref={cardRef}
      className={`focus-card${isEngaged ? " is-engaged" : ""}`}
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
      <FocusVisual
        area={area}
        index={index}
        progress={smoothCardProgress}
        isActive={isInView}
        isEngaged={isEngaged}
        shouldReduceMotion={shouldReduceMotion}
      />
      <div className="focus-meta">
        <span>{area.number}</span>
        <h3>{area.title}</h3>
        <p>{area.description}</p>
        <button
          type="button"
          className="focus-action"
          aria-pressed={isEngaged}
          aria-label={`${isEngaged ? "Ripristina" : "Ricomponi"} figura: ${area.title}`}
          onClick={() => setIsEngaged((current) => !current)}
        >
          <span>{isEngaged ? "Ripristina figura" : "Ricomponi figura"}</span>
          <span aria-hidden="true">{isEngaged ? "−" : "+"}</span>
        </button>
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
  const objectRotate = useTransform(
    progress,
    [start, end],
    [-110 + index * 55, 0],
  );
  const objectScale = useTransform(progress, [start, end], [0.22, 1]);

  return (
    <m.div
      className="principle"
    >
      <m.span
        className="principle-fill"
        style={{ scaleX: shouldReduceMotion ? 1 : fillScale }}
      />
      <span>0{index + 1}</span>
      <p>{principle}</p>
      <m.span
        className={`principle-object principle-object-${index + 1}`}
        aria-hidden="true"
        style={
          shouldReduceMotion
            ? undefined
            : { rotate: objectRotate, scale: objectScale }
        }
      >
        <i />
        <i />
        <i />
      </m.span>
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
      href="https://github.com/castellininicolo"
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
  const cursorX = useMotionValue(-80);
  const cursorY = useMotionValue(-80);
  const cursorOpacity = useMotionValue(0);
  const cursorScale = useMotionValue(1);
  const smoothCursorX = useSpring(cursorX, { stiffness: 620, damping: 42 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 620, damping: 42 });

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
  const aboutLineOneX = useTransform(aboutProgress, [0.05, 0.42, 1], [-90, 0, 42]);
  const aboutSignalRotate = useTransform(aboutProgress, [0, 1], [-42, 168]);
  const aboutSignalScale = useTransform(
    aboutProgress,
    [0, 0.45, 1],
    [0.58, 1, 1.2],
  );
  const aboutRingOneRotate = useTransform(aboutProgress, [0, 1], [-60, 290]);
  const aboutRingTwoRotate = useTransform(aboutProgress, [0, 1], [95, -250]);
  const aboutCoreScale = useTransform(
    aboutProgress,
    [0, 0.42, 0.68, 1],
    [0.35, 1.28, 0.82, 1.12],
  );
  const aboutGridRotate = useTransform(aboutProgress, [0, 1], [-6, 7]);
  const aboutGridScale = useTransform(aboutProgress, [0, 0.55, 1], [0.9, 1.08, 1]);
  const aboutPanelOneX = useTransform(aboutProgress, [0.18, 0.56], [-72, 0]);
  const aboutPanelTwoX = useTransform(aboutProgress, [0.25, 0.63], [72, 0]);
  const aboutPanelOneRotate = useTransform(aboutProgress, [0.18, 0.56], [-4.5, 0]);
  const aboutPanelTwoRotate = useTransform(aboutProgress, [0.25, 0.63], [4.5, 0]);
  const workHeadingX = useTransform(workProgress, [0.08, 0.45, 1], [80, 0, -55]);
  const principlesTitleY = useTransform(principlesProgress, [0.08, 0.42], [62, 0]);
  const principlesGridX = useTransform(principlesProgress, [0, 1], [-90, 90]);
  const principlesGridRotate = useTransform(principlesProgress, [0, 1], [-3, 3]);
  const principlesCometX = useTransform(
    principlesProgress,
    [0, 0.34, 0.68, 1],
    ["-12vw", "52vw", "14vw", "72vw"],
  );
  const principlesCometY = useTransform(
    principlesProgress,
    [0, 0.34, 0.68, 1],
    [-40, 120, 360, 610],
  );
  const principlesCometRotate = useTransform(principlesProgress, [0, 1], [-45, 320]);
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

  const handleGlobalPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || shouldReduceMotion) return;
    cursorX.set(event.clientX);
    cursorY.set(event.clientY);
    cursorOpacity.set(1);
  };

  const handleGlobalPointerLeave = () => {
    cursorOpacity.set(0);
    cursorScale.set(1);
  };

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <main
          onPointerMove={handleGlobalPointerMove}
          onPointerLeave={handleGlobalPointerLeave}
          onPointerDown={(event) => {
            if (event.pointerType === "mouse" && !shouldReduceMotion) {
              cursorScale.set(1.55);
            }
          }}
          onPointerUp={() => cursorScale.set(1)}
        >
          <m.div
            className="pointer-aura"
            aria-hidden="true"
            style={{
              x: smoothCursorX,
              y: smoothCursorY,
              opacity: cursorOpacity,
              scale: cursorScale,
            }}
          >
            <span />
          </m.div>
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
            <HeroComposition
              progress={heroProgress}
              pointerX={smoothPointerX}
              pointerY={smoothPointerY}
              shouldReduceMotion={shouldReduceMotion}
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
              className="about-grid-plane"
              aria-hidden="true"
              style={
                shouldReduceMotion
                  ? undefined
                  : { rotate: aboutGridRotate, scale: aboutGridScale }
              }
            />
            <m.div
              className="about-signal"
              aria-hidden="true"
              style={
                shouldReduceMotion
                  ? undefined
                  : { rotate: aboutSignalRotate, scale: aboutSignalScale }
              }
            >
              <m.span
                className="about-ring about-ring-one"
                style={
                  shouldReduceMotion ? undefined : { rotate: aboutRingOneRotate }
                }
              />
              <m.span
                className="about-ring about-ring-two"
                style={
                  shouldReduceMotion ? undefined : { rotate: aboutRingTwoRotate }
                }
              />
              <m.span
                className="about-signal-core"
                style={shouldReduceMotion ? undefined : { scale: aboutCoreScale }}
              />
              <span className="about-signal-dot" />
              <span className="about-signal-label">POSSIBILITY / 01</span>
            </m.div>
            <div className="about-coordinates" aria-hidden="true">
              <span>45°28′</span>
              <span>IDEA → FORMA</span>
              <span>∞ / 01</span>
            </div>
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
                <m.span
                  className="about-title-line"
                  style={shouldReduceMotion ? undefined : { x: aboutLineOneX }}
                >
                  Sono Nicolò Castellini.
                </m.span>
                <br />
                <m.span
                  className="about-title-accent"
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
                  className="about-panel about-panel-one"
                  style={
                    shouldReduceMotion
                      ? undefined
                      : {
                          x: aboutPanelOneX,
                          y: aboutParagraphOneY,
                          rotate: aboutPanelOneRotate,
                        }
                  }
                >
                  Mi muovo tra progettazione, sviluppo e sperimentazione. Cerco il
                  punto in cui un’idea smette di essere astratta e diventa qualcosa
                  che le persone possono davvero usare.
                </m.p>
                <m.p
                  className="about-panel about-panel-two"
                  style={
                    shouldReduceMotion
                      ? undefined
                      : {
                          x: aboutPanelTwoX,
                          y: aboutParagraphTwoY,
                          rotate: aboutPanelTwoRotate,
                        }
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
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>
          </section>

          <section
            ref={principlesRef}
            id="principles"
            className="principles section-shell"
            aria-labelledby="principles-title"
          >
            <m.div
              className="principles-grid"
              aria-hidden="true"
              style={
                shouldReduceMotion
                  ? undefined
                  : { x: principlesGridX, rotate: principlesGridRotate }
              }
            />
            <m.div
              className="principles-comet"
              aria-hidden="true"
              style={
                shouldReduceMotion
                  ? undefined
                  : {
                      x: principlesCometX,
                      y: principlesCometY,
                      rotate: principlesCometRotate,
                    }
              }
            >
              <span />
            </m.div>
            <p className="section-label">03 / Il mio modo di lavorare</p>
            <div className="principles-head">
              <m.h2
                id="principles-title"
                style={shouldReduceMotion ? undefined : { y: principlesTitleY }}
              >
                Poche regole.
                <br />
                <em>Molto intenzionali.</em>
              </m.h2>
              <AlignmentGame
                progress={principlesProgress}
                shouldReduceMotion={shouldReduceMotion}
              />
            </div>
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
