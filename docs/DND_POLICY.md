# DND (Do-Not-Call) Opt-Out Policy - Bolti AI

**Last Updated: November 28, 2025**

## Overview

Bolti AI respects user privacy and complies with TRAI's National Do-Not-Call Registry (DND) rules. This document explains how users can opt-out of receiving calls.

## How to Opt-Out

### Method 1: SMS Keyword
1. Send SMS: `STOP` to the number you received call from
2. Instant response: "You've been added to DND. No further calls from this number."
3. Effective: Immediately (verified within 1 second)
4. Duration: Permanent until user re-opts in

### Method 2: Dashboard
1. Login to Bolti AI dashboard
2. Go to: Settings > Communication Preferences > DND
3. Toggle: "Opt-out of calls and SMS"
4. Effective: Within 30 minutes

### Method 3: Email
1. Send email: dnd-opt-out@bolti.ai
2. Include: Phone number, tenant company name
3. Processing: 24 hours
4. Confirmation: Email sent with opt-out confirmation

## DND Compliance Rules

### Sender (Business) Responsibilities
- Maintain internal DND list (updated daily from SMS responses)
- **NEVER call a user who's opted out**
- Remove number from all campaigns immediately
- Penalty: ₹1,00,000 per TRAI per violation

### Bolti AI Responsibilities
- Maintain DND database (Redis-backed for instant lookup)
- Update within 1 second of STOP SMS
- Prevent queued calls to DND numbers
- Quarterly DND list validation
- Compliance audit: Monthly

## Exception Cases

**Calls still allowed after DND opt-out:**
1. **Service Provider**: If user is existing customer
2. **Transactional**: Account alerts, order confirmations, OTP
3. **Customer Initiated**: If user calls you first
4. **Emergency**: Medical/safety emergencies only
5. **Government/Legal**: Court orders, tax authorities

## Re-Opting In

Users can reactivate calls:
1. Send SMS: "OPT-IN" to same number
2. Or enable in dashboard: Settings > Communication > Allow Calls
3. Effective: Immediately
4. Confirmation: SMS sent "You've opted back in"

## DND List Management

### For Businesses Using Bolti AI

Your Bolti dashboard includes:
- **Live DND Count**: Real-time users who opted out
- **DND Export**: Download as CSV for compliance audits
- **Violation Alert**: If we detect calls to DND numbers
- **Report**: Monthly DND compliance report

### CSV Upload (Campaigns)

If uploading lead list for campaign:
- **Automatic Filtering**: System removes DND numbers before calling
- **Report**: Shows how many filtered due to DND
- **Compliance**: You're automatically compliant

## Penalties & Legal

**Violations by Businesses:**
- First offense: Warning + call suspension (48 hours)
- Second offense: ₹50,000 penalty + 7-day suspension
- Repeated violations: Account termination + reporting to TRAI

**TRAI Fines** (if applicable):
- ₹1,00,000 per unauthorized call to DND number
- Paid by business (Bolti AI not liable)

## Technical Implementation

```
Call Flow Check:
1. User calls inbound → Check DND list
2. Campaign outbound → Filter DND before queue
3. SMS "STOP" received → Within 1 sec: Add to DND
4. DND list sync → All servers updated in <2 sec
```

## FAQ

**Q: If I opt-out, will I receive calls?**
A: No. We maintain an updated DND list and filter all calls before making them.

**Q: How long does opt-out take?**
A: SMS opt-out is effective within 1 second. Dashboard takes 30 minutes. Email takes 24 hours.

**Q: Can I opt-out temporarily?**
A: Not directly. Send OPT-IN SMS to re-enable. You can manually manage preferences in dashboard.

**Q: What if I opt-out but still receive calls?**
A: Report immediately to support@bolti.ai + customer business. We investigate within 24 hours.

**Q: Do I need to opt-out from each business separately?**
A: Yes. DND is per business (per caller ID). Each company maintains separate list.

**Q: Is DND free?**
A: Yes. Completely free to opt-out.

---

**Support**: support@bolti.ai  
**TRAI Complaint**: https://www.trai.gov.in/
**Report DND Violation**: dnd-complaint@bolti.ai
