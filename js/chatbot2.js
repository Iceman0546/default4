/**
 * THINK DIFFERENTLY — CHAT ASSISTANT WIDGET
 * Floating chatbot: greets the visitor, offers quick-reply topics,
 * and answers free-typed questions with keyword matching.
 * Works on every page (home, about, gallery, contact) and adapts to mobile.
 */

'use strict';

(function () {
  const toggleBtn      = document.getElementById('chatbot-toggle');
  const windowEl        = document.getElementById('chatbot-window');
  const closeBtn        = document.getElementById('chatbot-close');
  const messagesEl      = document.getElementById('chatbot-messages');
  const quickRepliesEl  = document.getElementById('chatbot-quick-replies');
  const form            = document.getElementById('chatbot-form');
  const input           = document.getElementById('chatbot-input');

  // Bail out gracefully if the widget markup isn't present on a page
  if (!toggleBtn || !windowEl || !messagesEl || !form || !input) return;

  let hasGreeted = false;

  // ---- Core contact info, kept in one place so it's easy to update ----
  const CONTACT_DETAILS =
    "Here are our contact details:\n" +
    "📞 Phone: +44 7557 234915 (WhatsApp: +44 7557 234915)\n" +
    "📧 Email: admin@thinkdifferentlydyslexia.co.uk\n" +
    "📍 Address: 254 Widney Lane, Solihull, B91 3JY\n"

  // ---- Quick-reply buttons shown after the greeting ----
  const QUICK_REPLIES = [
    {
      label: 'Get in touch',
      reply: () =>
        "You can use our example message template on the Contact page, or reach out directly:\n\n" +
        CONTACT_DETAILS
    },
    {
      label: 'Pricing',
      reply: () =>
        "Our rates:\n• Full Diagnostic Dyslexia Assessment — £480\n• Dyslexia Screening Assessment — £100\n• Specialist Group Tuition — £25 a session"
    },
    {
      label: 'Contact details',
      reply: () => CONTACT_DETAILS
    }
  ];

  // ---- Keyword matching for free-typed questions ----
  const KEYWORD_RESPONSES = [
    { keywords: ['book', 'trial', 'session', 'start', 'sign up', 'consult'], reply: () => QUICK_REPLIES[0].reply() },
    { keywords: ['price', 'cost', 'fee', 'rate', 'much', 'pound', '£'], reply: () => QUICK_REPLIES[1].reply() },
    { keywords: ['contact', 'phone', 'email', 'address', 'reach', 'call', 'number', 'located', 'where'], reply: () => QUICK_REPLIES[2].reply() },
    {
      keywords: ['dyslexia', 'assessment', 'diagnostic', 'literacy', 'screening'],
      reply: () =>
        "We provide professional diagnostic dyslexia assessments, carried out by a qualified teacher holding an " +
        "Assessment Practising Certificate (APC). Reports are recognised by schools, colleges, exam boards, and for DSA applications.\n\n" +
        "Want to book an assessment?\n\n" + CONTACT_DETAILS
    },
    {
      keywords: ['group', 'tuition', 'monday'],
      reply: () =>
        "Our Specialist Group Tuition runs on Mondays (4:00–4:50pm and 5:10–6pm) at £25 a session, using phonics-based, multisensory teaching methods to build literacy skills step by step."
    },
    {
      keywords: ['age', 'old', 'young', 'university'],
      reply: () =>
        "We typically assess children, young people and students aged 8 through to university or full-time education. If your child is younger or older, get in touch and we can discuss whether an assessment is right for them."
    },
    {
      keywords: ['human', 'person', 'speak to', 'talk to someone', 'real person', 'advisor'],
      reply: () => "Of course! Our team is happy to speak with you directly.\n\n" + CONTACT_DETAILS
    },
    {
      keywords: ['thank', 'thanks', 'cheers'],
      reply: () => "You're very welcome! Is there anything else I can help you with?"
    },
    {
      keywords: ['hi', 'hello', 'hey'],
      reply: () => "Hello again! 👋 Ask me about booking, pricing, or our dyslexia assessments."
    }
  ];

  const FALLBACK_REPLY =
    "I'm not totally sure about that one, but our team would love to help you directly!\n\n" + CONTACT_DETAILS;

  // ---- Helpers ----
  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-message ' + sender;
    bubble.innerHTML = text
      .split('\n')
      .map((line) => escapeHtml(line))
      .join('<br>');
    messagesEl.appendChild(bubble);
    scrollToBottom();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function showTyping(callback) {
    const typing = document.createElement('div');
    typing.className = 'chat-message bot typing';
    typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    messagesEl.appendChild(typing);
    scrollToBottom();
    const delay = 550 + Math.random() * 450;
    setTimeout(() => {
      typing.remove();
      callback();
    }, delay);
  }

  function botReply(text) {
    showTyping(() => addMessage(text, 'bot'));
  }

  function renderQuickReplies() {
    quickRepliesEl.innerHTML = '';
    QUICK_REPLIES.forEach((qr) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-quick-btn';
      btn.textContent = qr.label;
      btn.addEventListener('click', () => {
        addMessage(qr.label, 'user');
        botReply(qr.reply());
      });
      quickRepliesEl.appendChild(btn);
    });
  }

  function handleUserMessage(text) {
    const lower = text.toLowerCase();
    const match = KEYWORD_RESPONSES.find((k) => k.keywords.some((word) => lower.includes(word)));
    botReply(match ? match.reply() : FALLBACK_REPLY);
  }

  // ---- Open / close behaviour ----
  function openChat() {
    windowEl.classList.add('open');
    windowEl.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.classList.add('open');
    document.body.classList.add('chatbot-open');

    if (!hasGreeted) {
      hasGreeted = true;
      showTyping(() => {
        addMessage("Hi there! 👋 I'm your Think Differently Assistant.", 'bot');
        showTyping(() => {
          addMessage(
            "I can help with contact details, pricing, or our diagnostic dyslexia assessments. What would you like to know?",
            'bot'
          );
          renderQuickReplies();
        });
      });
    }

    setTimeout(() => input.focus(), 300);
  }

  function closeChat() {
    windowEl.classList.remove('open');
    windowEl.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.classList.remove('open');
    document.body.classList.remove('chatbot-open');
  }

  toggleBtn.addEventListener('click', () => {
    if (windowEl.classList.contains('open')) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn && closeBtn.addEventListener('click', closeChat);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    handleUserMessage(text);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && windowEl.classList.contains('open')) closeChat();
  });

  // Close when clicking outside the widget (desktop convenience)
  document.addEventListener('click', (e) => {
    const widget = document.querySelector('.chatbot-widget');
    if (!widget) return;
    if (windowEl.classList.contains('open') && !widget.contains(e.target)) {
      closeChat();
    }
  });
})();
