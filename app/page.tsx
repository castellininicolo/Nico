"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useState, type PointerEvent } from "react";

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
];

const principles = [
  "Curiosità prima delle certezze",
  "Chiarezza prima del rumore",
  "Persone prima degli strumenti",
];

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    });
  };

  return (
    <main>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />

      <nav className="site-nav" aria-label="Navigazione principale">
        <a className="monogram" href="#top" aria-label="Torna all’inizio">
          NC
        </a>
        <div className="nav-links">
          <a href="#about">Chi sono</a>
          <a href="#work">Cosa faccio</a>
          <a className="nav-cta" href="#contact">Parliamone</a>
        </div>
      </nav>

      <section id="top" className="hero" onPointerMove={handlePointerMove}>
        <div className="hero-grid" aria-hidden="true" />
        <motion.div
          className="hero-orbit hero-orbit-coral"
          aria-hidden="true"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: pointer.x * 42,
                  y: pointer.y * 42,
                  rotate: [0, 10, -7, 0],
                  borderRadius: [
                    "34% 66% 58% 42%",
                    "62% 38% 29% 71%",
                    "44% 56% 67% 33%",
                    "34% 66% 58% 42%",
                  ],
                }
          }
          transition={{
            x: { type: "spring", stiffness: 80 },
            y: { type: "spring", stiffness: 80 },
            duration: 12,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="hero-orbit hero-orbit-blue"
          aria-hidden="true"
          animate={
            shouldReduceMotion
              ? undefined
              : { x: pointer.x * -28, y: pointer.y * -28, rotate: 360 }
          }
          transition={{
            x: { type: "spring", stiffness: 70 },
            y: { type: "spring", stiffness: 70 },
            rotate: { duration: 24, repeat: Infinity, ease: "linear" },
          }}
        />

        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ciao, sono Nicolò <span aria-hidden="true">↘</span>
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 }}
          >
            Idee complesse.
            <br />
            <span>Esperienze semplici.</span>
          </motion.h1>
          <motion.div
            className="hero-bottom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <p>
              Questo è il mio spazio personale: un racconto in evoluzione tra
              tecnologia, creatività e cose costruite bene.
            </p>
            <a className="round-link" href="#about" aria-label="Scopri chi sono">
              <motion.span
                aria-hidden="true"
                animate={shouldReduceMotion ? undefined : { y: [0, 7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                ↓
              </motion.span>
            </a>
          </motion.div>
        </div>
      </section>

      <section id="about" className="about section-shell">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          01 / Chi sono
        </motion.p>
        <motion.div
          className="about-copy"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <h2>
            Sono Nicolò Castellini.
            <br />
            <span>Mi piace dare forma alle possibilità.</span>
          </h2>
          <div className="about-details">
            <p>
              Mi muovo tra progettazione, sviluppo e sperimentazione. Cerco il
              punto in cui un’idea smette di essere astratta e diventa qualcosa
              che le persone possono davvero usare.
            </p>
            <p>
              Credo nella tecnologia quando riduce la distanza tra un problema
              e la sua soluzione. Il mio approccio unisce pensiero analitico,
              attenzione visiva e una curiosità che non sta mai ferma.
            </p>
          </div>
        </motion.div>
      </section>

      <section id="work" className="work section-shell">
        <div className="section-heading">
          <p className="section-label">02 / Cosa faccio</p>
          <h2>Costruisco, collego, evolvo.</h2>
        </div>
        <div className="focus-list">
          {focusAreas.map((area, index) => (
            <motion.article
              className="focus-card"
              key={area.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={shouldReduceMotion ? undefined : { y: -8 }}
            >
              <div className={`shape shape-${area.shape}`} aria-hidden="true">
                <motion.div
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          rotate: area.shape === "software" ? 90 : -20,
                          borderRadius:
                            area.shape === "product"
                              ? "50%"
                              : "20% 80% 45% 55%",
                          scale: 1.08,
                        }
                  }
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                />
              </div>
              <div className="focus-meta">
                <span>{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section
        className="principles section-shell"
        aria-labelledby="principles-title"
      >
        <p className="section-label">03 / Il mio modo di lavorare</p>
        <h2 id="principles-title">Poche regole. Molto intenzionali.</h2>
        <div className="principles-list">
          {principles.map((principle, index) => (
            <motion.div
              key={principle}
              className="principle"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <span>0{index + 1}</span>
              <p>{principle}</p>
              <span aria-hidden="true">↗</span>
            </motion.div>
          ))}
        </div>
      </section>

      <footer id="contact" className="contact">
        <motion.div
          className="contact-shape"
          aria-hidden="true"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  borderRadius: [
                    "48% 52% 29% 71%",
                    "27% 73% 61% 39%",
                    "62% 38% 46% 54%",
                    "48% 52% 29% 71%",
                  ],
                  rotate: [0, 8, -5, 0],
                }
          }
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="contact-content">
          <p className="section-label">04 / Il prossimo passo</p>
          <h2>Hai un’idea?</h2>
          <a href="https://github.com/ex3meex" target="_blank" rel="noreferrer">
            Facciamola succedere <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="footer-row">
          <p>© {new Date().getFullYear()} Nicolò Castellini</p>
          <p>Fatto con curiosità e codice.</p>
        </div>
      </footer>
    </main>
  );
}
