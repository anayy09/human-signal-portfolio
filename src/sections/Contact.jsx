import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { FiMail, FiGithub, FiLinkedin, FiCheck, FiX, FiSend } from 'react-icons/fi';
import personalInfo from '../config/personalInfo';
import {
  Section,
  Container,
  SectionHeader,
  SpotlightPanel,
  trackSpotlight,
  revealVariants,
} from '../components/ui/Section';

const GOLD = '#D4A574';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 1.5rem;
  margin-top: 3rem;

  @media (max-width: ${p => p.theme.breakpoints.tabletL}) {
    grid-template-columns: 1fr;
  }
`;

const Channels = styled(SpotlightPanel)`
  padding: 1.75rem 1.9rem;
  display: flex;
  flex-direction: column;
`;

const Availability = styled.p`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.label};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.success};
  margin-bottom: 1.5rem;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${p => p.theme.colors.success};
    box-shadow: 0 0 8px rgba(72, 187, 120, 0.7);
    animation: ${pulse} 2.4s ease-in-out infinite;
  }
`;

const ChannelIntro = styled.p`
  font-size: ${p => p.theme.type.small};
  line-height: 1.7;
  color: ${p => p.theme.colors.muted};
  margin-bottom: 1.75rem;
`;

const ChannelList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;

const Channel = styled.a`
  display: grid;
  grid-template-columns: 1.6rem 5.5rem 1fr;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.25rem;
  border-top: 1px solid rgba(91, 141, 239, 0.08);
  color: inherit;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: 1px solid rgba(91, 141, 239, 0.08);
  }

  &:hover {
    background: rgba(212, 165, 116, 0.05);
    .value { color: ${GOLD}; }
  }

  .icon {
    display: flex;
    color: ${p => p.theme.colors.subtle};
  }

  .label {
    font-family: ${p => p.theme.fonts.code};
    font-size: ${p => p.theme.type.tick};
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${p => p.theme.colors.subtle};
  }

  .value {
    font-size: ${p => p.theme.type.small};
    color: ${p => p.theme.colors.muted};
    transition: color 0.2s ease;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const FormPanel = styled(SpotlightPanel)`
  padding: 1.75rem 1.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem;

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const Label = styled.label`
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.tick};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.subtle};

  &::before {
    content: '> ';
    color: ${GOLD};
  }
`;

const inputStyles = p => `
  font-family: ${p.theme.fonts.main};
  font-size: 0.9rem;
  color: ${p.theme.colors.light};
  background: rgba(8, 12, 20, 0.6);
  border: 1px solid rgba(91, 141, 239, 0.12);
  border-radius: ${p.theme.radius.md};
  padding: 0.7rem 0.9rem;
  transition: border-color 0.2s ease, background 0.2s ease;

  &::placeholder {
    color: ${p.theme.colors.faint};
  }

  &:focus {
    outline: none;
    border-color: rgba(212, 165, 116, 0.45);
    background: rgba(8, 12, 20, 0.85);
  }
`;

const Input = styled.input`
  ${p => inputStyles(p)}
`;

const Textarea = styled.textarea`
  ${p => inputStyles(p)}
  min-height: 130px;
  resize: vertical;
`;

const SubmitRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SubmitButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
  color: #14100a;
  background: ${GOLD};
  border-radius: ${p => p.theme.radius.md};
  transition: background 0.2s ease, box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    background: #e0b585;
    box-shadow: 0 0 26px rgba(212, 165, 116, 0.3);
  }

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
`;

const StatusLine = styled(motion.p)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.label};
  letter-spacing: 0.06em;
  color: ${p => (p.$ok ? p.theme.colors.success : p.theme.colors.error)};
`;

const Contact = ({ email, linkedin, github, orcid }) => {
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const { serviceId, templateId, publicKey } = personalInfo.apis.emailjs;
    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
      setFormStatus({ ok: true, message: 'transmission received. I will reply soon.' });
      formRef.current.reset();
    } catch {
      setFormStatus({ ok: false, message: `transmission failed. email me: ${email}` });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFormStatus(null), 6000);
    }
  };

  return (
    <Section id="contact">
      <Container>
        <SectionHeader
          index="08"
          name="transmission"
          title={<>Get in <em>Touch</em></>}
          accent={GOLD}
          intro="Research collaborations, full-time roles from December 2026, or a good technical conversation."
        />

        <Grid
          variants={revealVariants.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Channels
            variants={revealVariants.item}
            onMouseMove={trackSpotlight}
            $spot="rgba(212, 165, 116, 0.07)"
            $spotBorder="rgba(212, 165, 116, 0.4)"
          >
            <Availability>Open to full-time roles · Dec 2026</Availability>
            <ChannelIntro>
              Based in Gainesville, Florida. The fastest channel is email; everything
              else forwards there eventually.
            </ChannelIntro>
            <ChannelList>
              <Channel href={`mailto:${email}`}>
                <span className="icon"><FiMail size={14} /></span>
                <span className="label">email</span>
                <span className="value">{email}</span>
              </Channel>
              <Channel href={linkedin} target="_blank" rel="noopener noreferrer">
                <span className="icon"><FiLinkedin size={14} /></span>
                <span className="label">linkedin</span>
                <span className="value">in/anaysinhal</span>
              </Channel>
              <Channel href={github} target="_blank" rel="noopener noreferrer">
                <span className="icon"><FiGithub size={14} /></span>
                <span className="label">github</span>
                <span className="value">anayy09</span>
              </Channel>
              {orcid && (
                <Channel
                  href={`https://orcid.org/${orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="icon" style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: '0.7rem' }}>
                    iD
                  </span>
                  <span className="label">orcid</span>
                  <span className="value">{orcid}</span>
                </Channel>
              )}
            </ChannelList>
          </Channels>

          <FormPanel
            variants={revealVariants.item}
            onMouseMove={trackSpotlight}
            $spot="rgba(212, 165, 116, 0.07)"
            $spotBorder="rgba(212, 165, 116, 0.4)"
          >
            <Form ref={formRef} onSubmit={handleSubmit}>
              <FormRow>
                <Field>
                  <Label htmlFor="name">name</Label>
                  <Input type="text" id="name" name="name" required placeholder="Your name" />
                </Field>
                <Field>
                  <Label htmlFor="email">reply-to</Label>
                  <Input type="email" id="email" name="email" required placeholder="you@email.com" />
                </Field>
              </FormRow>
              <Field>
                <Label htmlFor="subject">subject</Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  placeholder="Research, collaboration, role..."
                />
              </Field>
              <Field>
                <Label htmlFor="message">message</Label>
                <Textarea id="message" name="message" required placeholder="Your message" />
              </Field>
              <SubmitRow>
                <SubmitButton
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FiSend size={13} />
                  {isSubmitting ? 'Transmitting' : 'Transmit'}
                </SubmitButton>
                {formStatus && (
                  <StatusLine
                    $ok={formStatus.ok}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="status"
                  >
                    {formStatus.ok ? <FiCheck size={13} /> : <FiX size={13} />}
                    {formStatus.message}
                  </StatusLine>
                )}
              </SubmitRow>
            </Form>
          </FormPanel>
        </Grid>
      </Container>
    </Section>
  );
};

export default Contact;
