import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMaximize, FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CVContainer = styled.div`
  min-height: 100vh;
  background: ${p => p.theme.gradients.cosmic};
  padding: 2rem;

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    padding: 1rem;
  }

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    padding: 0.75rem 0.5rem;
  }
`;

const Header = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto 2rem;
  max-width: 1400px;

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
    margin-bottom: 1rem;
  }
`;

const HeaderButton = styled.a`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.74rem;
  letter-spacing: 0.1em;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${p => p.theme.colors.light};
  padding: 0.6rem 1.1rem;
  border: 1px solid rgba(91, 141, 239, 0.25);
  border-radius: ${p => p.theme.radius.sm};
  background: ${p => p.theme.colors.surface};
  transition: all 0.25s ease;

  &:hover {
    background: rgba(91, 141, 239, 0.1);
    border-color: rgba(91, 141, 239, 0.4);
    color: ${p => p.theme.colors.light};
  }
`;

const Title = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-align: center;
`;

const TitleLabel = styled.span`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.6rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.subtle};
`;

const TitleMain = styled.span`
  font-family: ${p => p.theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 640;
  letter-spacing: -0.02em;
  color: ${p => p.theme.colors.light};
`;

const Controls = styled(motion.div)`
  display: flex;
  gap: 0.6rem;
  align-items: center;

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    justify-content: center;
  }
`;

const PDFContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const PDFEmbed = styled.iframe`
  width: ${p => (p.$fullscreen ? '92vw' : '860px')};
  height: calc(100vh - 170px);
  max-height: 1200px;
  border: 1px solid rgba(91, 141, 239, 0.15);
  border-radius: ${p => p.theme.radius.md};
  display: block;
  background: #fff;

  @media (max-width: ${p => p.theme.breakpoints.laptop}) {
    width: 100%;
    max-width: 860px;
  }

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    height: calc(100vh - 130px);
    min-height: 450px;
  }
`;

const CVViewer = () => {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <CVContainer>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Header>
          <HeaderButton as={Link} to="/">
            <FiArrowLeft />
            portfolio
          </HeaderButton>

          <Title>
            <TitleLabel>research dossier</TitleLabel>
            <TitleMain>Curriculum Vitae</TitleMain>
          </Title>

          <Controls>
            <HeaderButton href="/CV_Sinhal_Anay.pdf" download aria-label="Download CV">
              <FiDownload />
            </HeaderButton>
            <HeaderButton
              as="button"
              onClick={() => setFullscreen(f => !f)}
              aria-label="Toggle width"
            >
              <FiMaximize />
            </HeaderButton>
          </Controls>
        </Header>

        <PDFContainer>
          <PDFEmbed
            src="/CV_Sinhal_Anay.pdf#toolbar=1&navpanes=0&scrollbar=1"
            title="Anay Sinhal, Curriculum Vitae"
            $fullscreen={fullscreen}
          />
        </PDFContainer>
      </motion.div>
    </CVContainer>
  );
};

export default CVViewer;
