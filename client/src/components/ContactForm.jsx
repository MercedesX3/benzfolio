'use client';

import { useState } from 'react';
import { EMAIL } from '../data/site';
import './ContactForm.css';

/**
 * There is no backend, so the form composes a mail draft and hands it to the
 * visitor's mail client. It is a real <form>, so Enter submits and the browser
 * enforces the required fields before anything is composed.
 */
export default function ContactForm({ resume }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');

    const subject = encodeURIComponent('Hi Mercedes — from your portfolio');
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    setSent(true);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <form className="form" onSubmit={onSubmit} data-reveal>
      <div className="form__row">
        <label className="form__field">
          <span className="form__label">Your name</span>
          <input
            className="form__input"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </label>

        <label className="form__field">
          <span className="form__label">Your email</span>
          <input
            className="form__input"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Your email"
            required
          />
        </label>
      </div>

      <label className="form__field">
        <span className="form__label">What are we building?</span>
        <textarea
          className="form__input"
          name="message"
          rows={4}
          placeholder="What are we building?"
          required
        />
      </label>

      <div className="form__foot">
        <p className="form__note" role="status">
          {sent
            ? 'Your mail app should be open — see you in the inbox.'
            : `Goes straight to ${EMAIL}`}
        </p>

        <div className="form__actions">
          <a
            href={resume}
            className="btn btn--ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download resume ↓
          </a>
          <button type="submit" className="btn btn--send">
            Send it →
          </button>
        </div>
      </div>
    </form>
  );
}
