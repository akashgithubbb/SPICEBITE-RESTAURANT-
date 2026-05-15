/* ═══════════════════════════════════════════════════════
   SPICEBITE RESTAURANT — JAVASCRIPT
   script.js
═══════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════
   1. NAVBAR — scroll + hamburger
══════════════════════════════════════════════════ */

(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobOverlay = document.getElementById('mobOverlay');
  let mobOpen = false;

  // Sticky on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    mobOpen = !mobOpen;
    mobOverlay.classList.toggle('open', mobOpen);
    if (mobOpen) {

      document.body.style.overflow = 'hidden';
    
      if (typeof lenis !== "undefined") {
        lenis.stop();
      }
    
    } else {
    
      document.body.style.overflow = 'auto';
    
      if (typeof lenis !== "undefined") {
        lenis.start();
      }
    
    }

    const spans = hamburger.querySelectorAll('span');
    if (mobOpen) {
      spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => s.removeAttribute('style'));
    }
  });

  // Expose close for inline onclick
  window.closeMob = function () {

    mobOpen = false;
  
    mobOverlay.classList.remove('open');
  
    document.body.style.overflow = 'auto';
  
    document.documentElement.style.overflow = 'auto';
  
    if (typeof lenis !== "undefined") {
      lenis.start();
    }
  
    hamburger.querySelectorAll('span').forEach(s => {
      s.removeAttribute('style');
    });
  
  };
})();


/* ══════════════════════════════════════════════════
   2. SCROLL FADE-IN ANIMATIONS
══════════════════════════════════════════════════ */
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════════
   3. TOAST NOTIFICATION
══════════════════════════════════════════════════ */
let toastTimer;

window.toastMsg = function (message, color) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.background = color || 'var(--orange)';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
};


/* ══════════════════════════════════════════════════
   4. RESERVATION FORM
══════════════════════════════════════════════════ */



/* ══════════════════════════════════════════════════
   5. AI CHATBOT
══════════════════════════════════════════════════ */
(function initChatbot() {

  /* ── SYSTEM PROMPT ────────────────────────────────
     Full knowledge base about SpiceBite Restaurant.
     Claude AI will only answer based on this context.
  ─────────────────────────────────────────────── */
  const SYSTEM_PROMPT = `
You are SpiceBite Assistant — the charming, warm, and knowledgeable AI chatbot for SpiceBite Restaurant located on Baner Road, Pune, India.

YOUR PERSONALITY:
- Friendly, welcoming, concise, and enthusiastic about food
- Use occasional food emojis (🍛🌶️🍽️✨) to add warmth
- Keep replies to 2–4 sentences unless listing items
- If asked something unrelated to the restaurant, gently and warmly redirect back

RESTAURANT DETAILS:
- Name: SpiceBite Restaurant
- Address: 12, Baner Road, Near Balewadi Stadium, Pune – 411045
- Phone: +91 98765 43210
- Email: hello@spicebite.in
- Google/Zomato Rating: 4.8★ (2,400+ reviews)
- Established: 2018
- Cuisine: Premium Indian & Modern Gastronomy
- Delivery: Available via Zomato & Swiggy

OPENING HOURS:
- Monday to Friday: 11:00 AM – 11:00 PM
- Saturday & Sunday: 10:00 AM – 11:30 PM
- Closed on: National holidays (call ahead to confirm)

FULL MENU WITH PRICES:
STARTERS:
- Seekh Kebab Platter – ₹340 (hand-minced lamb, live charcoal grilled)
- Paneer Tikka – ₹240 (charred cottage cheese, mint chutney)
- Veg Spring Rolls – ₹180

MAIN COURSE:
- Butter Chicken Royale – ₹380 (Chef's Pick; slow simmered tomato cream sauce, 4 hours)
- Dum Gosht Biryani – ₹450 (Best Seller; fragrant mutton, saffron, long-grain basmati)
- Dal Makhani Signature – ₹220 (overnight cooked black lentils, butter & cream)
- Paneer Tikka Masala – ₹290 (smoky spiced tomato gravy)
- Kashmiri Rogan Josh – ₹520 (Premium; slow-braised lamb shanks)
- Royal Thali – ₹650 (8-dish curated platter — complete SpiceBite experience)
- Palak Paneer – ₹260 (creamy spinach, cottage cheese)

BREADS:
- Naan Basket (Assorted) – ₹120 (butter, garlic, laccha, kulcha)
- Tandoori Roti – ₹40

DESSERTS:
- Gulab Jamun Soufflé – ₹180 (modern take, rabri ice cream)
- Kulfi Falooda – ₹150
- Gajar Ka Halwa – ₹130

DRINKS:
- Mango Lassi – ₹90 (thick, house-made)
- Masala Chai – ₹60
- Fresh Lime Soda – ₹80

RESERVATIONS & POLICIES:
- Reserve online via the website form or call +91 98765 43210
- Reservations confirmed within 30 minutes
- 30-minute grace period policy applies
- Groups of 10+: must call directly
- Birthday/anniversary: complimentary dessert (mention when reserving)
- Window seating & private dining available on request
- Parking: available in adjacent lot

WHAT MAKES SPICEBITE SPECIAL:
- Farm-fresh ingredients sourced daily from local Pune farms
- Chefs with 15+ years experience (trained at India's top hospitality institutions)
- Food served to every table within 15 minutes guaranteed
- 50,000+ happy guests since 2018
- Vegetarian-friendly menu with dedicated veg section
- Jain options available on request
`;

  /* ── QUICK REPLY OPTIONS ──────────────────────── */
  const QUICK_REPLIES = [
    '📋 What\'s on the menu?',
    '⏰ Opening hours',
    '📍 Where are you located?',
    '🍽 How to reserve?',
    '⭐ Best dishes?',
  ];

  /* ── STATE ─────────────────────────────────────── */
  let chatOpen    = false;
  let chatHistory = [];
  let isBusy      = false;
  let welcomed    = false;

  /* ── DOM REFS ──────────────────────────────────── */
  const chatBtn    = document.getElementById('chatBtn');
  const chatWindow = document.getElementById('chatWindow');
  const chatMsgs   = document.getElementById('chatMessages');
  const chatInput  = document.getElementById('chatInput');
  const chatSend   = document.getElementById('chatSendBtn');
  const chatNotif  = document.getElementById('chatNotif');

  /* ── TOGGLE ─────────────────────────────────────── */
  window.chatToggle = function () {
    chatOpen = !chatOpen;
    chatWindow.classList.toggle('open', chatOpen);
    chatBtn.classList.toggle('open', chatOpen);

    // Hide notification badge on open
    if (chatOpen) {
        chatNotif.classList.add('hide');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        document.documentElement.style.overflow = 'hidden'; // Prevent scrolling
        if (!welcomed) {
            welcomed = true;
            setTimeout(() => {
                addBotMessage(
                    "Namaste! 🙏 I'm your SpiceBite Assistant. Ask me anything — our menu, hours, reservations, location, or anything else about SpiceBite! How can I help you today?",
                    true
                );
            }, 380);
        }
        setTimeout(() => chatInput.focus(), 420);
    } else {
        document.body.style.overflow = 'auto'; // Restore scrolling
        document.documentElement.style.overflow = 'auto'; // Restore scrolling
    }
};

  /* ── ADD USER MESSAGE ───────────────────────────── */
  function addUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'chat-msg user';
    el.innerHTML = `
      <div class="chat-ico">👤</div>
      <div class="chat-bubble">${escapeHtml(text)}</div>
    `;
    chatMsgs.appendChild(el);
    scrollToBottom();
  }

  /* ── ADD BOT MESSAGE ────────────────────────────── */
  function addBotMessage(text, withQuickReplies = false) {
    // Show typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg bot';
    typingEl.id = 'typing-indicator';
    typingEl.innerHTML = `
      <div class="chat-ico">🍛</div>
      <div class="chat-bubble">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    `;
    chatMsgs.appendChild(typingEl);
    scrollToBottom();

    const delay = 800 + Math.random() * 700;

    setTimeout(() => {
      // Remove typing indicator
      document.getElementById('typing-indicator')?.remove();

      // Build quick replies HTML
      let qrHtml = '';
      if (withQuickReplies) {
        const btns = QUICK_REPLIES
          .map(q => `<button class="qr-btn" onclick="chatQuickReply('${escapeAttr(q)}')">${q}</button>`)
          .join('');
        qrHtml = `<div class="qr-wrap">${btns}</div>`;
      }

      const el = document.createElement('div');
      el.className = 'chat-msg bot';
      el.innerHTML = `
        <div class="chat-ico">🍛</div>
        <div class="chat-bubble">${formatText(text)}${qrHtml ? '<br>' + qrHtml : ''}</div>
      `;
      chatMsgs.appendChild(el);
      scrollToBottom();

      isBusy = false;
      chatSend.disabled = false;
    }, delay);
  }

  /* ── SEND MESSAGE ───────────────────────────────── */
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isBusy) return;
  
    chatInput.value = '';
    chatAutoResize(chatInput);
    isBusy = true;
    chatSend.disabled = true;
  
    addUserMessage(text);
    chatHistory.push({ role: 'user', content: text });
  
    try {
      const response = await fetch("https://spicebite-backend-dvqi.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `${SYSTEM_PROMPT}\nUser: ${text}\nAssistant:`
        })
      });
  
      const data = await response.json();
      const reply = data.reply || "⚠️ Try again";
  
      chatHistory.push({ role: 'assistant', content: reply });
      addBotMessage(reply);
  
    } catch (err) {
      console.error('Chat API error:', err);
      chatHistory.pop();
      addBotMessage("Oops! Network issue 🙏 Try again.");
    }
  }

  /* ── QUICK REPLY ─────────────────────────────────── */
  window.chatQuickReply = function (text) {
    // Strip emoji prefix for cleaner query
    const clean = text.replace(/^[\p{Emoji}\s]*/u, '').trim();
    chatInput.value = clean;
    sendMessage();
  };

  /* ── KEY HANDLER ─────────────────────────────────── */
  window.chatKeyDown = function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ── AUTO RESIZE TEXTAREA ──────────────────────── */
  window.chatAutoResize = function (el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  };

  /* ── HELPERS ─────────────────────────────────────── */
  function scrollToBottom() {
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function formatText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    return str.replace(/'/g, "\\'");
  }

  /* ── SEND BUTTON CLICK ──────────────────────────── */
  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
  }

})(); // end chatbot IIFE


/* ══════════════════════════════════════════════════
   6. SMOOTH HOVER — active nav link highlight
══════════════════════════════════════════════════ */
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => observer.observe(sec));
})();




let bookingInProgress = false;

async function submitReservation() {

  if (bookingInProgress) return;

  bookingInProgress = true;

  const button = document.querySelector(
    'button[onclick="submitReservation()"]'
  );

  button.disabled = true;
  button.innerText = "Processing...";

  const name = document.getElementById("rName").value;
  const phone = document.getElementById("rPhone").value;
  const date = document.getElementById("rDate").value;
  const guests = document.getElementById("rGuests").value;
  const note = document.getElementById("rNote").value;

  try {

    const response = await fetch(
      "https://spicebite-backend-dvqi.onrender.com/book",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          phone,
          date,
          guests,
          note
        })
      }
    );

    const data = await response.json();

    if (data.success) {

      toastMsg("✅ Reservation Confirmed!", "#16a34a");

      document.getElementById("rName").value = "";
      document.getElementById("rPhone").value = "";
      document.getElementById("rDate").value = "";
      document.getElementById("rGuests").value = "";
      document.getElementById("rNote").value = "";

    } else {

      toastMsg("❌ " + data.message, "#dc2626");

    }

  } catch (err) {

    console.error(err);
    toastMsg("❌ Server error", "#dc2626");

  }

  bookingInProgress = false;

  button.disabled = false;
  button.innerText = "CONFIRM RESERVATION ✦";
}


(function initThemeToggle(){

  const btn = document.getElementById("themeToggle");

  if(localStorage.getItem("theme") === "light"){

    document.body.classList.add("light-mode");
    btn.innerText = "☀️";

  }

  btn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    const isLight =
      document.body.classList.contains("light-mode");

    btn.innerText = isLight ? "☀️" : "🌙";

    localStorage.setItem(
      "theme",
      isLight ? "light" : "dark"
    );

  });

})();

AOS.init({
  duration: 1000,
  once: true
});

// Cursor Section

// Cursor Section — Desktop Only

if (window.innerWidth > 768) {

  const cursor = document.querySelector(".custom-cursor");

  if (cursor) {

    document.addEventListener("mousemove", (e) => {

      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";

    });

    const hoverItems = document.querySelectorAll(
      "a, button, .menu-card"
    );

    hoverItems.forEach((item) => {

      item.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
      });

      item.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
      });

    });

  }

}

// Smooth Scrolling

let lenis = null;

// Disable Lenis on mobile
if (window.innerWidth > 768) {

  lenis = new Lenis({
    smoothWheel: true,
    easing: (t) => 1 - Math.pow(1 - t, 4),
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

}

const chatMessages = document.querySelector('.chat-messages');

chatMessages.addEventListener(
  'wheel',
  (e) => {
    e.stopPropagation();
  },
  { passive: true }
);

chatMessages.addEventListener('mouseenter', () => {
  lenis.stop();
});

chatMessages.addEventListener('mouseleave', () => {
  lenis.start();
});


document.querySelectorAll('.mob-overlay a').forEach(link => {

  link.addEventListener('click', function(e) {

    e.preventDefault();

    const targetId = this.getAttribute('href');

    if (lenis) {

      lenis.scrollTo(targetId, {
        duration: 1.2
      });
    
    } else {
    
      document.querySelector(targetId)
        .scrollIntoView({
          behavior: "smooth"
        });
    
    }

    window.closeMob();

  });

});