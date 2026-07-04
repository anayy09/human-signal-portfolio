import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import personalInfo from '../config/personalInfo';

const FooterContainer = styled.footer`
  padding: 2rem;
  border-top: 1px solid rgba(91, 141, 239, 0.07);
  position: relative;
`;

const FooterContent = styled.div`
  max-width: 1160px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
`;

const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FooterCopy = styled.p`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: ${p => p.theme.colors.subtle};
`;

const FooterStack = styled.p`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  color: ${p => p.theme.colors.faint};

  a {
    color: rgba(91, 141, 239, 0.55);

    &:hover {
      color: ${p => p.theme.colors.primary};
    }
  }
`;

const ScrollToTop = styled(motion.button)`
  width: 34px;
  height: 34px;
  border-radius: ${p => p.theme.radius.md};
  border: 1px solid rgba(91, 141, 239, 0.15);
  background: transparent;
  color: ${p => p.theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: rgba(91, 141, 239, 0.4);
    color: ${p => p.theme.colors.primary};
    background: rgba(91, 141, 239, 0.06);
  }
`;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterLeft>
          <FooterCopy>© {year} Anay Sinhal · end of transmission</FooterCopy>
          <FooterStack>
            React · Three.js · Framer Motion ·{' '}
            <a href={personalInfo.repo} target="_blank" rel="noopener noreferrer">
              view source
            </a>
          </FooterStack>
        </FooterLeft>

        <ScrollToTop
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll to top"
        >
          <FiArrowUp size={15} />
        </ScrollToTop>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
