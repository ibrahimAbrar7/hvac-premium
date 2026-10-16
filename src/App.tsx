import { useEffect, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Clipboard, House, Menu, Phone, Plus, Settings2, Sun, Wind, X } from 'lucide-react';

const PHONE = '(914) 258-6101';
const TEL = 'tel:+19142586101';
// Replace this copy only after the business confirms its actual coverage.
const SERVICE_AREA = { title: 'Is your home in our service area?', description: 'The exact service area is being confirmed. Call JHI Services LLC with your location to ask whether service is available for your home.' };
const services = [
  { number: '01', title: 'Air conditioning', description: 'A home that is not cooling as expected can make every day feel longer. Tell us what is happening with your system, and we can discuss your cooling needs.', icon: Wind, query: 'Cooling concern' },
  { number: '02', title: 'Residential heating', description: 'From uneven warmth to a heating system that needs attention, start a conversation about keeping your indoor spaces comfortable.', icon: Sun, query: 'Heating concern' },
  { number: '03', title: 'Installation & replacement', description: 'Considering a change to your home heating or cooling equipment? Share what you have in mind and ask about the options available to you.', icon: House, query: 'Installation or replacement question' },
  { number: '04', title: 'Maintenance & care', description: 'Have a question about caring for your system through the seasons? Get in touch to discuss your home and the next sensible step.', icon: Settings2, query: 'Maintenance question' },
];
const faqs = [
  { question: 'What kinds of home comfort needs can I ask about?', answer: 'JHI Services LLC focuses on residential heating and cooling. You can get in touch about a cooling concern, a heating concern, or questions about your home HVAC system. Specific service availability can be confirmed when you call.' },
  { question: 'Can I ask about a new system or replacement?', answer: 'Yes. Describe your current equipment and what you hope to change. JHI Services LLC can discuss your enquiry and confirm which options are available for your home.' },
  { question: 'When might an HVAC system need replacing?', answer: 'Frequent problems, inconsistent comfort, or changing needs at home can be reasons to ask about replacement. The right decision depends on the condition of your equipment and your home; a conversation is a good place to start.' },
  { question: 'What should I include in my enquiry?', answer: 'Your name, a way to reach you, your general location, the type of system involved if you know it, and a brief description of what you are noticing are all useful details.' },
  { question: 'Which areas do you serve?', answer: 'The exact service area has not yet been confirmed for this website. Please call with your location to ask whether JHI Services LLC can assist at your home.' },
];
type FormValues = { name: string; phone: string; email: string; service: string; details: string; preference: string };
const initialForm: FormValues = { name: '', phone: '', email: '', service: '', details: '', preference: 'Phone' };

function shouldShowIntro() {
  if (typeof window === 'undefined') return false;
  if (window.location.pathname !== '/' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try { return sessionStorage.getItem('jhi-intro-seen') !== 'yes'; } catch { return true; }
}

function BrandIntro() {
  const [visible, setVisible] = useState(shouldShowIntro);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const duration = 2000;
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const startExit = window.setTimeout(() => {
      setLeaving(true);
      try { sessionStorage.setItem('jhi-intro-seen', 'yes'); } catch { /* storage may be disabled */ }
    }, 1720);
    const remove = window.setTimeout(() => setVisible(false), 2070);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(startExit); window.clearTimeout(remove); };
  }, [visible]);

  if (!visible) return null;
  return (
    <div className={`brand-intro ${leaving ? 'brand-intro-leaving' : ''}`} aria-hidden="true">
      <div className="brand-intro-backdrop" />
      <div className="brand-intro-glow brand-intro-glow-a" />
      <div className="brand-intro-glow brand-intro-glow-b" />
      <div className="brand-intro-grid" />
      <div className="brand-intro-inner">
        <div className="brand-intro-top">
          <span className="brand-intro-eyebrow">Est. Residential HVAC — Orange County, NY Area</span>
          <span className="brand-intro-badge">NOW PREPARING YOUR EXPERIENCE</span>
        </div>
        <div className="brand-intro-lockup">
          <span className="brand-intro-mark">JHI<span /></span>
          <div className="brand-intro-titles">
            <span className="brand-intro-name">SERVICES LLC</span>
            <span className="brand-intro-tagline">Comfort, Considered — In Every Season</span>
          </div>
        </div>
        <div className="brand-intro-loader" aria-hidden="true">
          <div className="brand-intro-track">
            <div className="brand-intro-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="brand-intro-stats">
            <span className="brand-intro-pct">{String(progress).padStart(2, '0')}%</span>
            <span className="brand-intro-msg">Calibrating home comfort preview</span>
          </div>
        </div>
      </div>
      <div className="brand-intro-foot">
        <span>(914) 258-6101</span>
        <span className="brand-intro-foot-dot" />
        <span>Residential Heating & Cooling</span>
        <span className="brand-intro-foot-dot" />
        <span>Trusted Local Guidance</span>
      </div>
    </div>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return <a className={`logo ${light ? 'logo-light' : ''}`} href="/#home" aria-label="JHI Services LLC, home"><span className="logo-mark" aria-hidden="true">JHI<span className="logo-slash" /></span><span className="logo-name">SERVICES <span>LLC</span></span></a>;
}
function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => { const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, []);
  const close = () => setOpen(false);
  return <header className="site-header"><div className="header-inner container"><Logo /><nav className={`main-nav ${open ? 'is-open' : ''}`} id="main-navigation" aria-label="Main navigation"><a href="/#home" onClick={close}>Home</a><a href="/#services" onClick={close}>Services</a><a href="/#about" onClick={close}>About</a><a href="/#service-area" onClick={close}>Service Area</a><a href="/#contact" onClick={close}>Contact</a><a className="nav-call-mobile" href={TEL} onClick={close}><Phone size={17} /> {PHONE}</a></nav><a className="header-call" href={TEL} aria-label={`Call JHI Services LLC at ${PHONE}`}><Phone size={16} strokeWidth={2.2} /><span>{PHONE}</span><ArrowUpRight size={16} /></a><button className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-controls="main-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={25} /> : <Menu size={25} />}</button></div></header>;
}
function Label({ children, light = false }: { children: React.ReactNode; light?: boolean }) { return <div className={`section-label ${light ? 'section-label-light' : ''}`}><span className="label-rule" />{children}</div>; }
function ServiceLink({ query }: { query: string }) {
  return <a className="text-link" href="/#contact" onClick={(e) => { if (window.location.pathname !== '/') return; e.preventDefault(); window.dispatchEvent(new CustomEvent('select-service', { detail: query })); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Ask about this service<ArrowUpRight size={17} /></a>;
}
function Hero() {
  return <section className="hero" id="home" aria-labelledby="hero-heading"><img className="hero-image" src="/images/hero-home-hvac.jpg" alt="Residential home with an outdoor heating and cooling unit" width="2048" height="1152" fetchPriority="high" /><div className="hero-shade" /><div className="container hero-content"><div className="hero-copy"><div className="hero-brand"><span className="hero-brand-line" />JHI SERVICES LLC <span className="hero-brand-divider">/</span> RESIDENTIAL HVAC</div><h1 id="hero-heading">Comfort at Home.<br /><em>Confidence in</em><br />Every Season.</h1><p>Residential heating and cooling solutions from JHI Services LLC, helping homeowners create a more comfortable indoor environment throughout the year.</p><div className="hero-actions"><a className="button button-gold" href={TEL}><Phone size={17} />Call JHI Services<ArrowUpRight size={18} /></a><a className="button button-outline" href="#contact">Request Service<ArrowRight size={18} /></a></div></div></div><a href="#about" className="hero-scroll" aria-label="Scroll to learn more"><span>EXPLORE</span><ArrowDown size={17} /></a></section>;
}
function TrustStrip() { return <div className="trust-strip"><div className="container trust-inner"><span>Made for the way you live</span><span>Residential heating</span><span>Home air conditioning</span><span>One conversation starts here</span></div></div>; }
function Intro() {
  return <section className="intro section-space" id="about"><div className="container intro-grid"><div className="intro-content"><Label>WELCOME TO JHI SERVICES LLC</Label><h2>Your home deserves <em>reliable comfort.</em></h2><p className="lead">The best days at home are the ones when the temperature just feels right.</p><p>JHI Services LLC focuses on residential heating and cooling, helping homeowners address their indoor comfort needs with appropriate HVAC services. Whatever the season brings, a clearer path forward begins with a conversation.</p><a className="text-link" href="#contact">Let's talk about your home<ArrowUpRight size={18} /></a></div><div className="intro-visual"><img src="/images/welcome-hvac.jpg" alt="HVAC technician inspecting a residential heating and cooling system" width="1920" height="1280" loading="lazy" /><div className="intro-visual-bar" aria-hidden="true" /></div></div></section>;
}
function Services() {
  return <section className="services section-space" id="services"><div className="container"><div className="section-heading services-heading"><div><Label>WHAT WE CAN TALK ABOUT</Label><h2>Heating and cooling<br /><em>for your home.</em></h2></div><p>Explore common residential HVAC needs and tell us what is happening in your space. Specific service availability can be confirmed when you get in touch.</p></div><div className="services-grid">{services.map((service, index) => { const Icon = service.icon; return <div className="service-grid-part" key={service.number}><article className="service-item"><div className="service-top"><span className="service-number">{service.number} / 04</span><Icon size={31} strokeWidth={1.35} aria-hidden="true" /></div><div><h3>{service.title}</h3><p>{service.description}</p><ServiceLink query={service.query} /></div></article>{index === 1 && <div className="service-imagery"><img src="/images/residential-cooling.jpg" alt="Outdoor residential air-conditioning equipment beside a home" width="1920" height="1280" loading="lazy" decoding="async" /><img src="/images/residential-heating.jpg" alt="Residential heating equipment being inspected" width="1920" height="1280" loading="lazy" decoding="async" /></div>}</div>; })}</div></div></section>;
}
function Approach() {
  const principles = [['01', 'Start with listening', 'A useful conversation begins with what you are experiencing at home, not a one-size-fits-all answer.'], ['02', 'Keep it clear', 'Understand the concern and the available next steps in language that makes sense to you.'], ['03', 'Focus on your home', 'Consider comfort, everyday routines, and the space where your heating and cooling system works.']];
  return <section className="approach section-space" aria-labelledby="approach-heading"><div className="container approach-grid"><div className="approach-title"><Label light>THE WAY WE THINK ABOUT COMFORT</Label><h2 id="approach-heading">A thoughtful approach to <em>home comfort.</em></h2><p>These simple principles shape the kind of conversation every homeowner should be able to have about their HVAC needs.</p></div><div className="principles">{principles.map(([number, title, text]) => <div className="principle" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>;
}
function Process() {
  const steps = [['Get in touch', 'Call or prepare an enquiry describing your heating or cooling concern.'], ['Discuss your needs', 'Share what is going on at home and ask about an appropriate next step.'], ['Confirm next steps', 'Discuss relevant service information and arrangements directly with JHI Services LLC.']];
  return <section className="process section-space" aria-labelledby="process-heading"><div className="container"><div className="process-header"><Label>AN EASY PLACE TO BEGIN</Label><h2 id="process-heading">Getting started <em>is simple.</em></h2></div><div className="process-steps">{steps.map(([title, text], index) => <div className="process-step" key={title}><div className="step-number">0{index + 1}</div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>;
}
function Seasonal() { return <section className="seasonal" aria-labelledby="seasonal-heading"><div className="seasonal-image"><img src="/images/service-hvac.jpg" alt="Technician inspecting residential heating and cooling equipment at a home" width="1920" height="1280" loading="lazy" /></div><div className="seasonal-copy"><div className="seasonal-copy-inner"><Label>THROUGH EVERY SEASON</Label><h2 id="seasonal-heading">Ready for the <em>season ahead?</em></h2><p>Whether your home needs heating support during colder weather or cooling assistance during warmer days, JHI Services LLC is your point of contact for residential HVAC enquiries.</p><a className="button button-burgundy" href="#contact">Get in touch<ArrowUpRight size={18} /></a></div></div></section>; }
function ServiceArea() { return <section className="area-section section-space" id="service-area"><div className="container area-grid"><div><Label>SERVICE AREA</Label><h2>{SERVICE_AREA.title}</h2></div><div className="area-detail"><p>{SERVICE_AREA.description}</p><a className="text-link" href={TEL}>Ask about your location<ArrowUpRight size={18} /></a></div></div></section>; }
function FAQ() {
  const [active, setActive] = useState<number | null>(0);
  return <section className="faq section-space" id="faq"><div className="container faq-grid"><div className="faq-intro"><Label>GOOD TO KNOW</Label><h2>Questions before <em>you call?</em></h2><p>Here are a few helpful starting points. For details specific to your home, the best next step is to speak with JHI Services LLC.</p><a className="text-link" href={TEL}>Call {PHONE}<ArrowUpRight size={18} /></a></div><div className="faq-list">{faqs.map((faq, index) => <div className={`faq-item ${active === index ? 'active' : ''}`} key={faq.question}><h3><button type="button" aria-expanded={active === index} aria-controls={`faq-answer-${index}`} onClick={() => setActive(active === index ? null : index)}><span>{faq.question}</span><Plus size={20} aria-hidden="true" /></button></h3><div id={`faq-answer-${index}`} className="faq-answer" hidden={active !== index}><p>{faq.answer}</p></div></div>)}</div></div></section>;
}
function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [prepared, setPrepared] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => { const select = (event: Event) => { setValues((current) => ({ ...current, service: (event as CustomEvent<string>).detail })); setPrepared(false); }; window.addEventListener('select-service', select); return () => window.removeEventListener('select-service', select); }, []);
  const setValue = (key: keyof FormValues, value: string) => { setValues((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); setPrepared(false); setCopied(false); };
  const summary = `JHI Services LLC service enquiry\nName: ${values.name}\nPhone: ${values.phone}\nEmail: ${values.email || 'Not provided'}\nService: ${values.service}\nPreferred contact: ${values.preference}\nDetails: ${values.details}`;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) next.name = 'Please enter your name.';
    if (!values.phone.trim() || !/^[+()\d\s.-]{7,}$/.test(values.phone.trim()) || values.phone.replace(/\D/g, '').length < 7) next.phone = 'Please enter a valid phone number.';
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Please enter a valid email address.';
    if (!values.service) next.service = 'Please select a topic.';
    if (!values.details.trim()) next.details = 'Please briefly describe your request.';
    if (values.preference === 'Email' && !values.email.trim()) next.email = 'Please enter an email for email contact.';
    setErrors(next);
    if (Object.keys(next).length) { requestAnimationFrame(() => document.getElementById(`field-${Object.keys(next)[0]}`)?.focus()); return; }
    setPrepared(true);
  };
  const copy = async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); } catch { setCopied(false); } };
  return <form className="contact-form" onSubmit={submit} noValidate><div className="form-heading"><span className="form-kicker">SERVICE ENQUIRY</span><h3>Tell us what is going on.</h3><p>This form prepares your details but does not send them online. After preparing your request, call JHI Services LLC to share it.</p></div><div className="form-row"><div className="form-field"><label htmlFor="field-name">Full name <span>*</span></label><input id="field-name" value={values.name} onChange={(e) => setValue('name', e.target.value)} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'error-name' : undefined} placeholder="Your name" />{errors.name && <span className="field-error" id="error-name">{errors.name}</span>}</div><div className="form-field"><label htmlFor="field-phone">Phone number <span>*</span></label><input id="field-phone" type="tel" value={values.phone} onChange={(e) => setValue('phone', e.target.value)} autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'error-phone' : undefined} placeholder="(000) 000-0000" />{errors.phone && <span className="field-error" id="error-phone">{errors.phone}</span>}</div></div><div className="form-row"><div className="form-field"><label htmlFor="field-email">Email address <span className="optional">Optional</span></label><input id="field-email" type="email" value={values.email} onChange={(e) => setValue('email', e.target.value)} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'error-email' : undefined} placeholder="you@example.com" />{errors.email && <span className="field-error" id="error-email">{errors.email}</span>}</div><div className="form-field"><label htmlFor="field-service">What can we discuss? <span>*</span></label><div className="select-wrap"><select id="field-service" value={values.service} onChange={(e) => setValue('service', e.target.value)} aria-invalid={!!errors.service} aria-describedby={errors.service ? 'error-service' : undefined}><option value="">Select a topic</option><option>Cooling concern</option><option>Heating concern</option><option>Installation or replacement question</option><option>Maintenance question</option><option>Other home comfort question</option></select><ChevronDown size={17} aria-hidden="true" /></div>{errors.service && <span className="field-error" id="error-service">{errors.service}</span>}</div></div><div className="form-field"><label htmlFor="field-details">Tell us a little more <span>*</span></label><textarea id="field-details" value={values.details} onChange={(e) => setValue('details', e.target.value)} rows={3} aria-invalid={!!errors.details} aria-describedby={errors.details ? 'error-details' : undefined} placeholder="What is happening with your heating or cooling?" />{errors.details && <span className="field-error" id="error-details">{errors.details}</span>}</div><div className="form-bottom"><div className="form-field"><label htmlFor="field-preference">Preferred contact method</label><div className="select-wrap"><select id="field-preference" value={values.preference} onChange={(e) => setValue('preference', e.target.value)}><option>Phone</option><option>Email</option></select><ChevronDown size={17} aria-hidden="true" /></div></div><button className="button button-gold" type="submit">Prepare request<ArrowUpRight size={18} /></button></div>{prepared && <div className="prepared-request" role="status"><div className="prepared-title"><Check size={19} /><strong>Your request is ready</strong></div><p>Your details have not been sent or saved by this website. Copy them for your records, then call JHI Services LLC to share your request.</p><pre>{summary}</pre><div className="prepared-actions"><button type="button" className="button button-burgundy" onClick={copy}><Clipboard size={17} />{copied ? 'Copied' : 'Copy details'}</button><a className="text-link" href={TEL}>Call {PHONE}<ArrowUpRight size={17} /></a></div></div>}</form>;
}
function Contact() { return <section className="contact-section" id="contact"><div className="container contact-grid"><div className="contact-copy"><Label light>LET'S CONNECT</Label><h2>Let's get your home <em>comfortable again.</em></h2><p>Contact JHI Services LLC to discuss your residential heating or cooling needs.</p><a className="contact-phone" href={TEL}><span>CALL JHI SERVICES LLC</span><strong>{PHONE}</strong><ArrowUpRight size={26} /></a><div className="contact-rule" /><p className="contact-note">Prefer to organize your thoughts first? Use the request builder to prepare what you want to discuss, then give us a call.</p></div><ContactForm /></div></section>; }
function Footer() { return <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Logo light /><p>Residential heating and cooling conversations start here. Get in touch about what comfort means for your home.</p></div><div className="footer-links"><div><h3>Explore</h3><a href="/#home">Home</a><a href="/#about">About</a><a href="/#services">Services</a><a href="/#service-area">Service area</a><a href="/#faq">FAQs</a></div><div><h3>Get in touch</h3><a href="/#contact">Prepare a request</a><a href={TEL}>{PHONE}</a><span>Service area: please call to confirm availability.</span></div></div></div><div className="footer-bottom"><span>&copy; {new Date().getFullYear()} JHI Services LLC</span><span>Comfort starts with a conversation.</span><a href="/privacy">Privacy information</a></div></div></footer>; }
function PrivacyPage() { return <><Header /><main className="privacy-page"><div className="container privacy-content"><Label>PRIVACY INFORMATION</Label><h1>Your information, <em>your choice.</em></h1><p>This website does not currently send online form submissions to JHI Services LLC. The request builder prepares a summary in your browser so that you can copy it and share it by phone. We do not store that form information on a website server.</p><p>If you choose to call, the information you share is part of your direct conversation with JHI Services LLC. Please call <a href={TEL}>{PHONE}</a> with questions about your information.</p><a className="button button-burgundy" href="/">Back to home<ArrowRight size={18} /></a></div></main><Footer /></>; }
export default function App() { if (window.location.pathname === '/privacy' || window.location.pathname === '/privacy/') return <PrivacyPage />; return <><BrandIntro /><Header /><main><Hero /><TrustStrip /><Intro /><Services /><Approach /><Process /><Seasonal /><ServiceArea /><FAQ /><Contact /></main><Footer /></>; }
