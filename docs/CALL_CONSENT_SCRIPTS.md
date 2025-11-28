# Call Consent Scripts - Bolti AI

**Last Updated: November 28, 2025**

These are compliant voice scripts for TRAI/ITA regulations. Customize the company name and use exact wording.

## Inbound Call Consent (IVR - Played Automatically)

```
🎤 ENGLISH:
"Hello! Welcome to [COMPANY_NAME]. This call is being recorded and monitored 
for quality assurance, compliance, and training purposes. Your call may be transferred 
to other departments. By continuing this call, you consent to recording. 
Press 1 to continue or hang up to exit."

🎤 HINDI:
"नमस्ते! [COMPANY_NAME] में आपका स्वागत है। यह कॉल गुणवत्ता आश्वासन, अनुपालन और 
प्रशिक्षण उद्देश्यों के लिए रिकॉर्ड और निगरानी की जा रही है। आपकी कॉल अन्य विभागों को 
स्थानांतरित की जा सकती है। इस कॉल को जारी रखने के लिए, आप रिकॉर्डिंग के लिए सहमत हैं। 
जारी रखने के लिए 1 दबाएं या बाहर निकलने के लिए कॉल काटें।"
```

## Outbound Call Consent (AI Agent Introduction)

```
🤖 ENGLISH:
"Hi [NAME]! This is [AI_AGENT_NAME] from [COMPANY_NAME]. I'm an AI assistant calling 
to help you with [PURPOSE]. This call is being recorded. Do you have a moment to talk?"

If user says "no" or hangs up: Stop immediately. Don't call again for 30 days unless 
user initiates contact.

If user asks "Are you a robot?": Respond with "Yes, I'm an AI assistant. I can connect 
you to our team anytime if you prefer to speak with a human. Would you like me to do that?"

🤖 HINDI:
"नमस्ते [NAME]! मैं [COMPANY_NAME] से [AI_AGENT_NAME] हूँ। मैं आपकी मदद करने के लिए 
एक AI असिस्टेंट हूँ। यह कॉल रिकॉर्ड की जा रही है। क्या आपके पास बात करने का समय है?"
```

## Escalation to Human Agent

```
🎤 ENGLISH:
"Let me connect you with one of our team members who can better assist you. 
Please hold while I transfer your call. Thank you!"

🎤 HINDI:
"मैं आपको हमारी टीम के सदस्य से जोड़ता हूँ जो आपकी बेहतर मदद कर सकते हैं। 
कृपया अपनी कॉल ट्रांसफर होने का इंतजार करें। धन्यवाद!"
```

## Opt-Out Instructions (Post-Call Message)

```
SMS (Auto-sent after call):
"Thank you for contacting [COMPANY_NAME]. To opt-out of future calls, 
reply STOP. Std message rates apply. Visit [WEBSITE] for details."

WhatsApp (Auto-sent):
"Hi! Thank you for speaking with [COMPANY_NAME]. To stop receiving messages, 
reply STOP. We respect your choice. #[COMPANY_NAME]"
```

## Call Rejection (If Criteria Met)

```
🎤 ENGLISH:
"We're sorry, but this call cannot be completed. Reason: [DND/BLOCKED/FRAUD_CHECK]. 
Please contact [SUPPORT_NUMBER] for assistance."

If DND Number Detected (Should NOT happen):
System immediately: Don't call. Log as DND violation attempt.
Callback: None.
```

## Survey Call Consent (If Applicable)

```
🎤 ENGLISH:
"Hi [NAME], this is a brief customer satisfaction survey from [COMPANY_NAME]. 
This takes 2-3 minutes. May I proceed? This call is being recorded."

🎤 HINDI:
"नमस्ते [NAME], यह [COMPANY_NAME] का एक संक्षिप्त ग्राहक संतुष्टि सर्वेक्षण है। 
इसमें 2-3 मिनट लगते हैं। क्या मैं आगे बढ़ सकता हूँ? यह कॉल रिकॉर्ड की जा रही है।"
```

## Important Notes

✅ **DO:**
- Play full consent message before call interaction
- Get explicit acknowledgment (press 1, say yes, etc.)
- Include company name, purpose, and recording mention
- Offer human escalation always

❌ **DON'T:**
- Cut off or abbreviate consent scripts
- Make silent calls (ring-to-hangup without greeting)
- Call DND numbers (automatic system filter prevents this)
- Use misleading caller IDs (must match company/registered number)
- Robo-call without consent (violations = ₹1,00,000+ penalties)

---

**Compliance Verified**: ✓ TRAI | ✓ ITA | ✓ TDSAT  
**Last Audit**: November 2025

For legal concerns: legal@bolti.ai
