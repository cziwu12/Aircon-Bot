# Aircon WhatsApp Inquiry Bot

A trilingual (English, Chinese, Malay) customer-enquiry bot for aircon repair, cleaning and installation. It includes a polished browser demo and a dependency-free Node.js server scaffold for connecting the same conversation logic to Meta's WhatsApp Cloud API.

## Run the demo

Requires Node.js 18 or newer.

```bash
npm start
```

Open `http://localhost:3000`.

Run the tests with `npm test`.

## What the bot captures

- Service type
- Number of units
- Problem description
- Customer area
- Property type
- Preferred visit time
- Customer name
- Final confirmation

The final message deliberately says that the enquiry is **not a confirmed booking**. A staff member should confirm availability and price.

## Connect the real WhatsApp integration

1. Create a Meta developer app and add the WhatsApp product.
2. Add a WhatsApp Business phone number and obtain its phone-number ID.
3. Set `VERIFY_TOKEN`, `WHATSAPP_TOKEN`, and `PHONE_NUMBER_ID` as server environment variables. Never put tokens in frontend code.
4. Deploy this Node server on an HTTPS host.
5. In Meta, set the callback URL to `https://your-domain/webhook`, enter the same verification token, and subscribe to `messages`.
6. Replace the marked production TODO in `server.js`: extract incoming text/button replies, identify the customer by WhatsApp sender ID, pass the message to `receive()`, and send the returned reply through `/{PHONE_NUMBER_ID}/messages` on the Graph API.
7. Store sessions and completed leads in a real database before production. The included in-memory `Map` resets whenever the server restarts.

## Before using it for a real business

Replace the placeholder CoolCare name, service area, hours and escalation contact. Add explicit consent before storing personal data. Decide when the bot should hand off to a human—for example, emergencies, unclear faults, commercial jobs, complaints, or requests for a firm quote.

## THIS IS A VIBECODED APP, TO SEE PROJECTS MADE BY MADE, LEAVE THIS REPO

