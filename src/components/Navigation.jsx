import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '#home', id: 'home', index: '01' },
  { name: 'About', href: '#about', id: 'about', index: '02' },
  { name: 'Timeline', href: '#timeline', id: 'timeline', index: '03' },
  { name: 'Projects', href: '#projects', id: 'projects', index: '04' },
  { name: 'Skills', href: '#skills', id: 'skills', index: '05' },
  { name: 'Research', href: '#research', id: 'research', index: '06' },
  { name: 'Journeys', href: '#journeys', id: 'journeys', index: '07' },
  { name: 'Contact', href: '#contact', id: 'contact', index: '08' },
];

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, ${p => p.theme.colors.primary}, ${p => p.theme.colors.accent});
  transform-origin: left;
  z-index: 200;
`;

const NavContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0.875rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: ${p => (p.$scrolled ? 'blur(16px)' : 'none')};
  background: ${p => (p.$scrolled ? 'rgba(10, 11, 15, 0.88)' : 'transparent')};
  transition: background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease;
  box-shadow: ${p => (p.$scrolled ? '0 1px 0 rgba(91, 141, 239, 0.10)' : 'none')};

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    padding: 0.875rem 1.25rem;
  }
`;

const Logo = styled(motion.button)`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.95rem;
  color: ${p => p.theme.colors.light};
  background: transparent;
  letter-spacing: 0.04em;
  padding: 0;

  span {
    color: ${p => p.theme.colors.primary};
  }

  i {
    font-style: normal;
    font-size: 0.68rem;
    color: ${p => p.theme.colors.faint};
    margin-left: 0.4rem;
    letter-spacing: 0.14em;
  }

  &:hover span {
    color: ${p => p.theme.colors.accent};
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1.6rem;
  align-items: center;

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  color: ${p => (p.$active ? p.theme.colors.light : p.theme.colors.muted)};
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;
  letter-spacing: 0.01em;
  transition: color 0.2s ease;

  sup {
    font-family: ${p => p.theme.fonts.code};
    font-size: 0.52rem;
    letter-spacing: 0.08em;
    color: ${p => (p.$active ? p.theme.colors.primary : 'transparent')};
    margin-right: 0.22rem;
    transition: color 0.2s ease;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: ${p => (p.$active ? '100%' : '0')};
    height: 1px;
    background: ${p => p.theme.colors.primary};
    transition: width 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  }

  &:hover {
    color: ${p => p.theme.colors.light};

    sup {
      color: ${p => p.theme.colors.primary};
    }
  }

  &:hover::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: 1px solid rgba(91, 141, 239, 0.2);
  color: ${p => p.theme.colors.light};
  width: 36px;
  height: 36px;
  border-radius: ${p => p.theme.radius.sm};
  z-index: 110;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.5);
  }

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const HamLine = styled.span`
  display: block;
  width: 16px;
  height: 1px;
  background: ${p => p.theme.colors.light};
  transition: all 0.25s ease;
  transform-origin: center;

  &:first-child {
    transform: ${p => (p.$open ? 'rotate(45deg) translate(4px, 4px)' : 'none')};
  }

  &:last-child {
    transform: ${p => (p.$open ? 'rotate(-45deg) translate(4px, -4px)' : 'none')};
  }

  &:nth-child(2) {
    opacity: ${p => (p.$open ? 0 : 1)};
    width: ${p => (p.$open ? '0' : '16px')};
  }
`;

const MobileOverlay = styled(motion.div)`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(10, 11, 15, 0.6);
  z-index: 104;
  backdrop-filter: blur(4px);

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  width: 72%;
  max-width: 320px;
  height: 100vh;
  background: rgba(10, 11, 15, 0.98);
  backdrop-filter: blur(24px);
  padding: 5rem 2rem 2rem;
  z-index: 105;
  border-left: 1px solid rgba(91, 141, 239, 0.12);
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileNavLink = styled(motion.a)`
  color: ${p => (p.$active ? p.theme.colors.primary : p.theme.colors.light)};
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.875rem 0;
  border-bottom: 1px solid rgba(91, 141, 239, 0.07);
  transition: color 0.2s ease;
  display: flex;
  align-items: baseline;
  gap: 0.75rem;

  &::before {
    content: '${p => p.$index}';
    font-family: ${p => p.theme.fonts.code};
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    color: ${p => (p.$active ? p.theme.colors.primary : p.theme.colors.faint)};
  }

  &:hover {
    color: ${p => p.theme.colors.primary};
  }
`;

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setScrolled(scrollTop > 50);
    setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);

    let current = 'home';
    for (const item of navItems) {
      const el = document.getElementById(item.id);
      if (el && el.getBoundingClientRect().top <= 120) current = item.id;
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const activeIndex = navItems.find(item => item.id === activeSection)?.index ?? '01';

  return (
    <>
      <ProgressBar style={{ scaleX: scrollProgress }} initial={{ scaleX: 0 }} />

      <NavContainer
        $scrolled={scrolled}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Logo
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          anay<span>.codes</span>
          <i>/{activeIndex}</i>
        </Logo>

        <NavLinks aria-label="Section navigation">
          {navItems.map((item, i) => (
            <NavLink
              key={item.name}
              href={item.href}
              $active={activeSection === item.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (i + 1), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <sup aria-hidden="true">{item.index}</sup>
              {item.name}
            </NavLink>
          ))}
        </NavLinks>

        <MobileMenuButton
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <HamLine $open={mobileMenuOpen} />
          <HamLine $open={mobileMenuOpen} />
          <HamLine $open={mobileMenuOpen} />
        </MobileMenuButton>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <MobileOverlay
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileMenu
                key="menu"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              >
                {navItems.map((item, i) => (
                  <MobileNavLink
                    key={item.name}
                    href={item.href}
                    $active={activeSection === item.id}
                    $index={item.index}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </MobileNavLink>
                ))}
              </MobileMenu>
            </>
          )}
        </AnimatePresence>
      </NavContainer>
    </>
  );
};

export default Navigation;
