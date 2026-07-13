// lib/activities/spot-the-phish.ts
import { Activity } from "./types";

/*
 * HOW EVERY QUIZ FILE WORKS (same pattern across all 6 quiz rooms):
 * This exports one `Activity` object. The `questions` array is what
 * ActivityEngine loops over. To add a question, add another object:
 *   {
 *     id:              unique within this quiz ("q1", "q2", ...)
 *     scenario?:       OPTIONAL "message box" shown above the question
 *                      { from?, subject?, body } — body required if present
 *     prompt:          the actual question text
 *     options:         array of { id, label } — the clickable answers
 *     correctOptionId: which option.id is right
 *     explanation:     shown after answering — teach the "why" here
 *   }
 * No component changes are ever needed — the engine handles the rest.
 */

export const spotThePhish: Activity = {
  slug: "spot-the-phish",
  title: "Spot the Phish",
  description: "Can you tell a real message from a fake one?",
  emoji: "🎣",
  roomNumber: 2,
  difficulty: "easy",
  kind: "quiz",
  // Intro deliberately doesn't hard-code a question count,
  // so adding questions later never breaks this line.
  intro:
    "You'll see a series of fictional messages — emails, texts and more. Decide whether each is safe or a phishing attempt, then check your reasoning against the explanation.",
  questions: [
    // ─── ORIGINAL 4 (unchanged) ──────────────────────────────────────
    {
      id: "q1",
      scenario: {
        from: "IT-Support <it-helpdesk@secure-login-verify.net>",
        subject: "URGENT: Your account will be deleted in 24 hours",
        body: "Dear User, we detected unusual activity. You MUST verify your password immediately or your account will be permanently deleted. Click here: http://schoolportal-verify.net/login",
      },
      prompt: "What should you do with this message?",
      options: [
        { id: "a", label: "Click the link and verify quickly to be safe" },
        { id: "b", label: "Treat it as phishing — don't click, report it" },
        { id: "c", label: "Reply asking if it's real" },
      ],
      correctOptionId: "b",
      explanation:
        "Phishing. Red flags: manufactured urgency, a generic 'Dear User' greeting, a sender domain that isn't your school, and a link that doesn't match any official site. Real IT teams never threaten account deletion by email. Don't click — report it.",
    },
    {
      id: "q2",
      scenario: {
        from: "School Newsletter <news@yourschool.edu>",
        subject: "This week: sports day photos and Friday's bake sale",
        body: "Hi everyone! Photos from sports day are on the school noticeboard, and the bake sale is this Friday at lunch. No action needed — see you there!",
      },
      prompt: "Is this message a threat?",
      options: [
        { id: "a", label: "Yes — delete it immediately, it's a trick" },
        { id: "b", label: "No — it looks like a normal, legitimate newsletter" },
        { id: "c", label: "Maybe — forward it to everyone to warn them" },
      ],
      correctOptionId: "b",
      explanation:
        "Legitimate. It matches the real school domain, has no urgency, asks for nothing, and has no links to click. Good security means recognising safe messages too — not panicking at everything.",
    },
    {
      id: "q3",
      scenario: {
        from: "Text from +44 7700 900123",
        body: "🎉 You've WON a £500 gift card! Claim within 1 hour: bit.ly/claim-now-prize. Reply STOP to opt out.",
      },
      prompt: "How do you handle this text?",
      options: [
        { id: "a", label: "Click the link before the hour runs out" },
        { id: "b", label: "Reply STOP so they stop messaging" },
        { id: "c", label: "Ignore and delete — it's a smishing scam" },
      ],
      correctOptionId: "c",
      explanation:
        "'Smishing' (phishing by SMS). Red flags: a prize you never entered, a countdown, and a shortened link hiding its destination. Even replying 'STOP' confirms your number is active. Just delete it.",
    },
    {
      id: "q4",
      scenario: {
        from: "Message from 'Alex' (your friend's account)",
        body: "hey!! i'm stuck and my card isn't working — can you grab me two £50 gift cards and send the codes? i'll pay you back tonight, promise. don't tell anyone it's embarrassing 😬",
      },
      prompt: "What's the safest move?",
      options: [
        { id: "a", label: "Buy the cards — it's your friend asking" },
        { id: "b", label: "Verify by calling/seeing Alex on another channel first" },
        { id: "c", label: "Send the codes but ask for a thank-you" },
      ],
      correctOptionId: "b",
      explanation:
        "Classic social engineering, often from a hacked account: urgency, untraceable gift cards, and a request for secrecy. Always verify unusual money requests through a different channel. Real friends won't mind you double-checking.",
    },

    // ─── NEW 4 ───────────────────────────────────────────────────────

    // q5 — Lookalike "cousin" domain. Teaches: read the actual domain,
    // not the brand word inside it.
    {
      id: "q5",
      scenario: {
        from: "Netflix <no-reply@netflix-billing-support.com>",
        subject: "Your payment failed — update your details to avoid suspension",
        body: "We couldn't process your latest payment. To keep watching, update your card within 48 hours at http://netflix.account-verify-uk.com/billing. — The Netflix Team",
      },
      prompt: "What's the giveaway here?",
      options: [
        { id: "a", label: "Nothing — Netflix does send billing emails" },
        { id: "b", label: "The sender and link domains aren't really netflix.com" },
        { id: "c", label: "Netflix would never email customers at all" },
      ],
      correctOptionId: "b",
      explanation:
        "Phishing. The real home is netflix.com — 'netflix-billing-support.com' and 'account-verify-uk.com' just borrow the brand name and bolt on words like 'billing' or 'verify'. Attackers register lookalike domains cheaply. When money is involved, don't use the link — type the address yourself.",
    },

    // q6 — LEGITIMATE but urgent-looking. Teaches the key heuristic:
    // "did I just trigger this action myself?"
    {
      id: "q6",
      scenario: {
        from: "SchoolPortal <no-reply@yourschool.edu>",
        subject: "Your password reset link",
        body: "You (or someone using your email) asked to reset your password two minutes ago. Use this link within 15 minutes: https://portal.yourschool.edu/reset. If you didn't request this, you can safely ignore this email.",
      },
      prompt: "You clicked 'Forgot password' a moment ago. Is this safe?",
      options: [
        { id: "a", label: "Yes — you just triggered it yourself and the domain matches your school" },
        { id: "b", label: "No — never click a link in any email, ever" },
        { id: "c", label: "No — password emails are always fake" },
      ],
      correctOptionId: "a",
      explanation:
        "Legitimate. The best test for a 'do something now' email is: did I just start this myself? You clicked 'Forgot password' seconds ago, the timing fits, and the link is on your real school domain. Distrusting absolutely everything isn't security — matching a message to an action you took is the skill.",
    },

    // q7 — Quishing (QR-code phishing). A modern attack most beginners
    // haven't heard of yet.
    {
      id: "q7",
      scenario: {
        body: "A poster appears in the school car park: 'Parking is now cashless — scan this QR code to pay.' The QR sticker looks slightly crooked, as if it was stuck on top of the original sign.",
      },
      prompt: "What's the safe move?",
      options: [
        { id: "a", label: "Scan it — QR codes are just links, they're harmless" },
        { id: "b", label: "Scan it but only enter half your card number" },
        { id: "c", label: "Don't scan it; a stuck-on QR code can lead to a fake payment page" },
      ],
      correctOptionId: "c",
      explanation:
        "This is 'quishing' — phishing via QR codes. A code hides its destination until you've already opened it, and criminals physically stick fake codes over real ones to capture card details. Pay through the official app or website you already know, never a random scanned code.",
    },

    // q8 — Malicious attachment. Teaches: unexpected attachment = red flag,
    // whatever the cover story says.
    {
      id: "q8",
      scenario: {
        from: "Accounts <invoices@delivery-notice.co>",
        subject: "Invoice #48213 attached — payment overdue",
        body: "Please find your overdue invoice attached. Open the file (Invoice_48213.html) and confirm payment today to avoid a late fee.",
      },
      prompt: "You never ordered anything. What now?",
      options: [
        { id: "a", label: "Open the attachment to see what the invoice is for" },
        { id: "b", label: "Don't open it — an unexpected attachment is a classic malware trick" },
        { id: "c", label: "Forward it to friends to ask if they ordered it" },
      ],
      correctOptionId: "b",
      explanation:
        "Phishing with a malicious attachment. You didn't order anything, the sender domain is unfamiliar, and '.html' attachments often open a fake login page that steals your password. Never open unexpected attachments — delete and report.",
    },
  ],
};
