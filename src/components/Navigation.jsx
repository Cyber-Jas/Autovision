import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCar } from '../context/CarContext';

const navLinks = [
  { href: '#hero',        label: 'Model' },
  { href: '#features',    label: 'Features' },
  { href: '#performance', label: 'Performance' },
  { href: '#specs',       label: 'Specs' },
];

export default function Navigation() {
  const { activeCar } = useCar();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer when resizing back to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function closeMenu() { setMenuOpen(false); }

  return (
    <>
      <motion.nav
        className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      >
        <div className="nav__brand">
          <span className="nav__brand-name">{activeCar.brand}</span>
          <span className="nav__brand-accent" style={{ color: activeCar.uiText }}>
            {activeCar.name}
          </span>
        </div>

        {/* Desktop links */}
        <ul className="nav__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav__link">
                {link.label}
                <span className="nav__link-line" style={{ background: activeCar.uiAccent }} />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <motion.button
          className="nav__cta"
          style={{ borderColor: activeCar.uiAccent, color: activeCar.uiText }}
          whileHover={{ scale: 1.05, backgroundColor: activeCar.uiAccent + '22' }}
          whileTap={{ scale: 0.97 }}
        >
          Configure
        </motion.button>

        {/* Hamburger (mobile only — shown via CSS) */}
        <button
          className={`nav__hamburger ${menuOpen ? 'nav__hamburger--open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="nav__hamburger-bar" />
          <span className="nav__hamburger-bar" />
          <span className="nav__hamburger-bar" />
        </button>
      </motion.nav>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav__drawer nav__drawer--open"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="nav__drawer-link"
                onClick={closeMenu}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.3 }}
              >
                <span style={{ color: activeCar.uiText, marginRight: '0.6rem', fontSize: '0.5rem' }}>
                  ◆
                </span>
                {link.label}
              </motion.a>
            ))}

            <motion.p
              style={{
                marginTop: '2.5rem',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: activeCar.uiText,
                opacity: 0.5,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.22 }}
            >
              {activeCar.brand} · {activeCar.name} · {activeCar.year}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
