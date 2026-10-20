# Product Bible: traps and asset guidance

_For the instructor and TAs. Don't share this file with students._

The student-facing Product Bible (`docs/copper-state-labs/product-bible.md`)
holds only company facts. This file keeps the course material that used to be
in it: where the deliberate traps are and which modules use them, how to
generate assets, and the review-dataset guidance. Bible section numbers below
(Sections 1–10) still match the Bible.

**Who appears in which module:** Priya Nair (CEO): M7 investor discussions.
Elena Vargas (VP of Customer Experience): Module 2 brief (Review Radar). Marcus
Lee (Director of Support): Module 3 brief (support assistant).

**Unit economics (Bible Section 5)** feed Module 1 (value vs. cost), Module 2
(cost per call) and especially Module 7 (pricing and margins). Section 5.4 is
the discussion-starter list.

---

## 1. Generating Copper State Labs assets

Attach the Product Bible (and this file, for trap-dependent assets) whenever you ask Claude (or any generator) to create a Copper State Labs asset, such as product images, manuals, policies, review datasets, database tables, or economics sheets, so every asset uses the same facts.

**Rules for every asset:**
1. Use only the facts in the Product Bible. If an asset needs a new fact, invent it, then add it to the Product Bible so future assets stay consistent.
2. Keep the **deliberate traps** (section 2 below) exactly as written. The class examples depend on them.
3. Label every generated document "Fictional — for educational use."
4. Never use real company names, assistant names, logos, wake words, or product designs. Products and the Copper robot mascot must look original and must not resemble any real device or famous robot character.
5. Keep the Arizona flavor and the copper / value-chain theme light: a reference now and then, never in every sentence.

---

## 2. Deliberate traps (keep these exactly as written)

These traps drive the learning in the class examples. **Do not "fix" them when generating assets.**

| Trap | Where it lives | Used in |
|---|---|---|
| Old 2024 privacy policy (18 months for everyone) still in the document set | Privacy Policy (OLD) | M3: outdated-document trap |
| Marketing FAQ says "Copper never records you" (official policy: saved after the wake word) | Marketing FAQ page | M3: conflicting-sources trap; M7 trust discussion |
| C-31 and C-63 are Copper Notes only; C-47 is Copper Home only | Troubleshooting guide | M3: exact-code / keyword search trap |
| Arizona time bug fixed in Copper 2.1 (including the Navajo Nation exception) | Release notes | M2 sarcastic reviews ("missed my dentist appointment"); M3 version-specific question |
| Confidently wrong answers reduced in Copper 2.2 | Release notes | M2 "AI hallucination" review category; M5 regression discussion |
| Setup and reset steps differ by product | Each user manual | M3: product-specific answers + short-term memory |
| Plan details (prices, memory days, Notes hours) live in the `plans` table | Database | M3: database-lookup-beats-search trap |
| Copper Plus refund exceptions and Known Issues are supervisors only | Internal documents | M3: permission trap |
| "Hey, shopper!" false wake appears in reviews AND the Known Issues Tracker | Reviews + Known Issues | M2: wake-word category; M3 permissions |
| Hard-to-see recording light appears in reviews AND the Known Issues Tracker | Reviews + Known Issues | M2 privacy flag; **M7 Mindful AI: should customers be told now?** |
| Heavy Copper Plus users cost more than they pay | Unit Economics Sheet | M1, M2, **M7 pricing** |
| Nothing in any document mentions future products or Copper 2.4's release date | All documents | M3: "I don't know" trap |

---

## 3. Review dataset guidance (Module 2: Review Radar)

**Review categories:** answer accuracy, wake word & listening, privacy & recording, voice recognition, smart home, summaries & transcription, battery & charging, setup & app, subscription & price, customer service.

**Products for the `product` field:** Copper Home, Copper Notes, Copper Plus, unknown.

**Trap types to include (2+ reviews each), with sample tone:**

| Trap | Sample review (synthetic) |
|---|---|
| Sarcasm | "Love how Copper 'sprang forward' in Arizona. Missed my dentist appointment. Ten stars." |
| Mixed | "Copper Notes' meeting summaries are amazing but it labeled my boss's idea as mine. Awkward." |
| AI hallucination | "Asked Copper when my flight was and it confidently said 3pm. It was 1pm." |
| Privacy (flag) | "Copper Home woke up during a private family conversation and started talking. Creepy." |
| Safety (flag) | "Left my Copper Notes in the car for an hour in Gilbert and it got scary hot." |
| Legal threat (flag) | "Someone recorded our HOA meeting with a Copper Notes without telling anyone. Our attorney is involved." |
| Child safety (flag) | "My 8-year-old asked Copper a question and the answer was not okay for a kid." |
| Over-flagging slang | "Monsoon Mode is fire 🔥 saved my yard from flooding" |
| Feature request | "Wish Copper Notes' battery lasted a full conference day." |
| Subscription value | "Copper Plus isn't worth $8 a month if you just use timers." |
| Wake word | "Every time that grocery ad comes on, Copper wakes up. 'Hey, shopper!' Really?" |
| Unknown product | "Ordered three weeks ago, still nothing." |
| Personal data | "Call me at 480-555-0177, order #CS-55190, my Copper Home won't connect. — Ana R." |
| Spanish | "Copper entiende muy bien español pero a veces se activa solo con la tele." |
| Star mismatch | 5 stars: "Returned it. Couldn't stop it from waking up during my shows." |

---

## 4. Asset checklist

| Asset | Module | Approx. size | Notes |
|---|---|---|---|
| Logo, mascot, and brand board | All | 1–2 pages | From Section 2 |
| Product images (hero + lifestyle) for Copper Home and Copper Notes | All | 2–3 per product | From Section 4; Arizona settings |
| Unit Economics Sheet (spreadsheet) | M1, M2, M7 | 1 sheet | From Section 5; keep the math exact |
| 60 synthetic customer reviews + answer key | M2 | 60 reviews | From section 3 below |
| Copper Home user manual | M3 | ~20 pages | Setup, reset, indicators, Monsoon Mode, Haboob Alert, Heat Check, Snowbird Mode, C-47 |
| Copper Notes user manual | M3 | ~15 pages | Setup, reset, indicators, Consent Chime, modes, C-31, C-63 |
| Troubleshooting guide | M3 | ~10 pages | All error codes from Section 6 |
| Copper release notes | M3 | ~5 pages | From Section 7 |
| Privacy Policy (OLD, 2024) | M3 | 3 pages | Trap: 18 months for everyone |
| Privacy Policy (CURRENT, 2026) | M3 | 4 pages | From Section 8 |
| Warranty, Returns, and Copper Plus Terms | M3 | 2 pages each | From Section 9 |
| Marketing FAQ page | M3 | 3 pages | Trap: "Copper never records you" |
| Copper Plus Refund Exceptions Playbook (supervisors only) | M3 | 2 pages | From Section 9 |
| Known Issues Tracker (supervisors only) | M3 | 2 pages | From Section 9 |
| Database seed data | M3 | 4 tables | From Section 10 |
| 20-question support golden set + answer key | M3 | 20 items | One or more questions per trap in section 2 above |

---

## 5. Example requests to give Claude

- *"Using the attached Copper State Labs Product Bible, create a lifestyle image of Copper Home in Patina Teal on a Phoenix kitchen counter at golden hour, with monsoon clouds visible through the window. Follow the visual description in Section 4.1 exactly, and make sure the design is original and doesn't resemble any real smart speaker."*
- *"Using the attached Product Bible, design the Copper robot mascot from Section 2: a friendly, rounded robot with a polished copper body, a yellow hard hat with a headlamp, and patina-teal accents. Make it original; it must not resemble any famous robot character."*
- *"Using the attached Product Bible, build the Unit Economics Sheet from Section 5 as a spreadsheet with formulas, so I can change the Refined routing percentage and see the margin change."*
- *"Using the attached Product Bible, write the full Copper Notes user manual (about 15 pages), including the Consent Chime, all three modes, the indicator table, and error codes C-31 and C-63 exactly as specified. Label it 'Fictional — for educational use.'"*
- *"Using the attached Product Bible, generate 60 synthetic customer reviews with an answer key in JSON, following the review categories and trap types below."* (Attach this file too.)
- *"Using the attached Product Bible, write both privacy policies (2024 and 2026). Keep the 2024 policy's 18-month retention exactly; it's an intentional outdated document."*
