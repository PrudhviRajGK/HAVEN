<div align="center">

```
██╗  ██╗ █████╗ ██╗   ██╗███████╗███╗   ██╗
██║  ██║██╔══██╗██║   ██║██╔════╝████╗  ██║
███████║███████║██║   ██║█████╗  ██╔██╗ ██║
██╔══██║██╔══██║╚██╗ ██╔╝██╔══╝  ██║╚██╗██║
██║  ██║██║  ██║ ╚████╔╝ ███████╗██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝
```

**Parametric micro-insurance for India's gig workers.**  
*When the storm hits, HAVEN pays — automatically.*

---

![Status](https://img.shields.io/badge/status-prototype-e8c97e?style=flat-square)
![Track](https://img.shields.io/badge/track-fintech%20%2F%20social%20impact-4fa8a8?style=flat-square)
![Event](https://img.shields.io/badge/hackathon-DevTrails%202026-ffffff?style=flat-square)
![Platform](https://img.shields.io/badge/platform-india--first-c46a6a?style=flat-square)

</div>

---

## What is HAVEN?

India has over 15 million gig workers — delivery riders, auto drivers, daily-wage earners — whose income disappears the moment a monsoon, flood, or urban disruption forces them off the road. They cannot afford traditional insurance. Traditional insurance was not built for them.

HAVEN is a parametric micro-insurance platform that triggers automatic payouts when a verified disruption event occurs in a worker's active location. No claim forms. No phone calls. No jargon. Just a WhatsApp message and money in their account.

> **Parametric insurance** means the payout is tied to an event trigger — not a manual claim. If it rains above a defined threshold in your area while you are active, you get paid. Period.

---

## The Problem Space

| What gig workers face | Why existing solutions fail |
|---|---|
| Income loss during weather disruptions | Traditional insurance requires paperwork and waiting periods |
| No financial buffer for unpredictable days | Weekly or monthly premium structures are unaffordable |
| Distrust of institutions that charge regardless | Products charge premiums even during inactive weeks |
| Language and literacy barriers | Policy documents are dense, jargon-heavy, and inaccessible |
| GPS-based fraud risk from platforms | No fraud-resilient income verification exists at this scale |

---

## Coverage Tiers

| Tier | Weekly Premium | Max Weekly Payout | Target Worker |
|---|---|---|---|
| Basic | ₹29 | ₹1,500 | Part-time, new riders |
| Standard | ₹59 | ₹3,000 | Regular active riders |
| Pro | ₹99 | ₹6,000 | Full-time verified riders |

Premiums adjust dynamically based on a worker's **GigScore** (1.0–5.0). Higher scores unlock lower premiums. New riders start at a neutral 3.0 and are recalibrated after 4 active weeks of real behaviour.

---

## Core Features

### F-01 — Hourly Micro-Coverage
Workers activate coverage only for the hours they are online. A rider working 3 hours pays for 3 hours — not a full week. The parametric trigger only fires if the disruption occurs during their active window, not just somewhere in the week.

```
Going online now?  Tap to activate  ₹5/hour coverage.
```

---

### F-02 — Streak-Based Loyalty Coverage
Unbroken weekly policy streaks automatically unlock better coverage. No applications, no paperwork.

| Streak | Reward |
|---|---|
| 4 weeks | +10% payout on next claim |
| 8 weeks | Coverage ceiling raised by ₹500 |
| 12 weeks | Premium locked at current rate for 3 months |
| 6 months | Standard tier at Basic pricing — renewable monthly |

---

### F-03 — Zero-Jargon WhatsApp Certificate
When a worker buys coverage, they instantly receive a plain-language policy summary on WhatsApp. No insurance terminology. No PDF attachments.

```
You are covered this week (Mar 11–17)

  If it rains heavily in your area  →  ₹2,000 paid to you
  If it gets too hot                →  ₹2,000 paid to you

  No forms. No calls. Automatic.
  Premium paid: ₹49. Valid until Sunday midnight.
```

---

### F-04 — GigScore Rating System
A 1.0–5.0 score derived from claim history, activity consistency, and coverage tenure. Higher scores lower premiums. Lower scores trigger review, not automatic rejection.

---

### F-05 — One-Tap SOS Mode
During an active disruption, an SOS button appears on the home screen. A single tap does three things simultaneously:

1. Files a claim with the worker's live GPS coordinates and timestamp
2. Sends their location to a registered emergency contact
3. Surfaces the nearest safe shelters on a map

This extends HAVEN beyond income protection into genuine worker safety.

---

### F-06 — Income Calendar
A monthly calendar view — colour-coded across every working day:

- **Green** — worked, earned normally
- **Red** — disruption, could not work
- **Gold** — disruption occurred, payout received

Over time, this builds a visible personal income-protection history.

```
HAVEN has protected ₹2,840 of your income over the last 6 weeks.
```

---

### F-07 — Smart Pause
Policy auto-renews every Monday. If a worker has been inactive on the delivery platform for 5 or more consecutive days, the system detects this via the platform activity API and automatically pauses the premium.

```
Looks like you have been offline this week.
We have paused your premium.
Reply RESUME when you are back on the road.
```

No charge for weeks they were not working. No friction to restart. This is the opposite of how traditional insurance behaves.

---

### F-08 — Worker Dignity Score
A non-financial badge system that tracks how consistently a worker has protected themselves:

| Badge | Name | Tangible Benefit |
|---|---|---|
| Level 1 | Protector | Priority customer support |
| Level 2 | Guardian | One free premium week per quarter |
| Level 3 | ShieldMaster | Permanent 10% premium reduction |

---

### F-09 — Night Shift Premium Discount
Workers primarily active between 10PM and 4AM face statistically lower weather disruption risk — peak storm activity in Indian cities occurs in the afternoon and evening. The system auto-detects active hours and applies a discounted premium rate without the worker needing to apply.

```
You are a night rider.
Your risk is 30% lower than daytime workers.
Your premium: ₹34/week instead of ₹49.
```

---

## AI Disruption Engine

No single data source can authorise a payout. The engine fuses three independent signal layers before any claim is processed.

```
GPS Layer        Live Location  →  Jump Analysis  →  Spoofing Flag Check
                                                              │
Weather Layer    IMD / API      →  Hyperlocal Data →  Threshold Breach
                                                              │
News Layer       Local Feeds    →  Event Parsing   →  Area Verification
                                                              │
                                              Signal Fusion Engine
                                             /                 \
                                    Payout Authorised     Flagged for Review
```

### GPS Spoofing Detection

Mock location apps are a known fraud vector in gig platforms. HAVEN cross-references:

- Accelerometer and sensor data against claimed movement
- Location jump velocity (teleportation detection)
- Platform activity log consistency
- Cross-platform presence signals

A flagged GPS signal does not automatically deny a claim — it routes it to the review queue with human oversight.

---

## Technology Stack

**Frontend**
- React Native + Expo
- TailwindCSS (NativeWind)

**Backend**
- Node.js + Express
- PostgreSQL (policy and payout records)
- Redis (job queue for scheduled payout triggers)

**Integrations**
- WhatsApp Business API (certificate delivery, Smart Pause notifications)
- IMD Weather API (hyperlocal disruption data)
- Google Maps SDK (SOS shelter mapping)
- Razorpay (premium collection and payout disbursement)
- Simulated Delivery Platform API (activity detection for Smart Pause)

**Intelligence Layer**
- Disruption signal fusion model
- GPS spoofing detection heuristics
- GigScore actuarial engine

---

## How a Payout Works

```
1.  Worker is active on platform  →  HAVEN detects active hours
2.  Weather threshold breached in worker's area
3.  Local news feed corroborates disruption event
4.  GPS location verified (spoofing checks pass)
5.  All three signals converge  →  payout authorised
6.  Worker receives WhatsApp notification + UPI credit
    within minutes of the event trigger
```

---

## Project Scope — DevTrails 2026

This repository contains the prototype built during the DevTrails 2026 Startup Simulation Hackathon, fintech and social impact track.

**Prototype includes:**
- End-to-end policy purchase flow (Basic, Standard, Pro)
- Simulated disruption trigger and automated payout
- WhatsApp certificate delivery integration
- Income Calendar UI
- SOS Mode UI with shelter map
- Smart Pause logic via simulated platform API
- GigScore computation model

**Out of scope for prototype:**
- Live IMD API integration (mocked)
- Real UPI disbursement (Razorpay sandbox)
- Full actuarial backtesting

---

<div align="center">

---

**HAVEN** — DevTrails 2026 &nbsp;·&nbsp; Fintech / Social Impact Track

*Built for the invisible workforce of India.*

</div>
