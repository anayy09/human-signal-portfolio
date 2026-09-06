import React, { useRef, useState } from 'react';
import personalInfo from '../config/personalInfo';
import { Arrow, Pulse } from '../components/StoryUI';

export default function Contact() {
  const form = useRef(null);
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const config = personalInfo.apis.emailjs;
  const configured = Boolean(
    config.serviceId && config.templateId && config.publicKey
  );
  async function send(event) {
    event.preventDefault();
    if (sending || !configured) return;
    setStatus(null);
    setSending(true);
    try {
      const { default: emailjs } = await import('@emailjs/browser');
      await emailjs.sendForm(
        config.serviceId,
        config.templateId,
        form.current,
        { publicKey: config.publicKey }
      );
      setStatus({
        ok: true,
        text: 'Message sent. Thank you for reaching out.',
      });
      form.current.reset();
    } catch {
      setStatus({
        ok: false,
        text: 'The message could not be sent. Please try again or use the email link.',
      });
    } finally {
      setSending(false);
    }
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
    } catch {
      setStatus({
        ok: false,
        text: 'Copy is unavailable here. You can select the email address or open the email link.',
      });
    }
  }
  return (
    <section id="contact" data-chapter className="contact-section">
      <div className="container">
        <div className="contact-grid">
          <div>
            <span className="eyebrow">
              <span className="chapter-number">06</span> WHAT COMES NEXT
            </span>
            <h2>
              The next breakthrough
              <br />
              starts with a<br />
              <span className="cyan">conversation.</span>
            </h2>
            <p>
              Have a research question, a role, or an ambitious idea?
              <br />
              Let’s build something that makes a difference.
            </p>
            <div className="contact-availability">
              <span className="status-dot" />
              {personalInfo.hero.status}
            </div>
            <div className="email-row">
              <a href={'mailto:' + personalInfo.email}>
                {personalInfo.email} <Arrow diagonal />
              </a>
              <button onClick={copyEmail} aria-label="Copy email address">
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <div className="social-links">
              <a href={personalInfo.github} target="_blank" rel="noreferrer">
                GitHub <Arrow diagonal />
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <Arrow diagonal />
              </a>
              <a
                href={'https://orcid.org/' + personalInfo.orcid}
                target="_blank"
                rel="noreferrer"
              >
                ORCID <Arrow diagonal />
              </a>
            </div>
          </div>
          {configured ? (
            <form className="contact-form" ref={form} onSubmit={send}>
              <div className="form-heading">
                <span className="eyebrow">OPEN A CONVERSATION</span>
                <Pulse />
              </div>
              <div className="form-row">
                <label>
                  Your name
                  <input
                    required
                    maxLength={120}
                    autoComplete="name"
                    name="name"
                    placeholder="Alex Morgan"
                  />
                </label>
                <label>
                  Email address
                  <input
                    required
                    maxLength={254}
                    type="email"
                    autoComplete="email"
                    name="email"
                    placeholder="alex@company.com"
                  />
                </label>
              </div>
              <label>
                What’s on your mind?
                <input
                  required
                  maxLength={200}
                  name="subject"
                  placeholder="Research, a role, a collaboration…"
                />
              </label>
              <label>
                Your message
                <textarea
                  required
                  maxLength={5000}
                  name="message"
                  rows={4}
                  placeholder="Tell me a little about your idea."
                />
              </label>
              <button
                className="button primary"
                type="submit"
                disabled={sending}
              >
                {sending ? 'Sending…' : 'Send message'}
                <Arrow diagonal />
              </button>
              <p className="form-note">Sent directly to my inbox.</p>
            </form>
          ) : (
            <div className="contact-invitation">
              <Pulse />
              <span className="eyebrow">A DIRECT LINE</span>
              <h3>
                Good ideas
                <br />
                are worth sharing.
              </h3>
              <p>
                Research collaborations, full-time opportunities, and thoughtful
                technical conversations are welcome.
              </p>
              <a
                href={'mailto:' + personalInfo.email}
                className="button primary"
              >
                Say hello <Arrow diagonal />
              </a>
            </div>
          )}
        </div>
        {status && (
          <p
            className={'form-status ' + (status.ok ? 'success' : 'error')}
            role="status"
          >
            {status.text}
          </p>
        )}
        <div className="contact-signoff">
          <Pulse />
          <span>HUMAN CURIOSITY. COMPUTATIONAL POSSIBILITY.</span>
          <span>THE STORY CONTINUES ↗</span>
        </div>
      </div>
    </section>
  );
}
