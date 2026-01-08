# CoDraw — Collaborative Whiteboard with Voice Chat

CoDraw is a real‑time collaborative whiteboard built with React, Fabric.js, and Socket.IO. Create boards, draw together, share a join code for read‑only viewers, clone boards, export as PNG, and talk with your team using built‑in group voice chat powered by WebRTC/PeerJS. An optional AI assistant can draw basic shapes from natural language prompts.

## Features

- Realtime collaboration: Fabric.js canvas synced via Socket.IO
- Join code sharing: Viewers can join a board in read‑only mode
- Clone boards: Turn a shared, read‑only board into your own editable copy
- Export: One‑click PNG export of the current canvas
- Persistence: Save boards with preview thumbnails; view your board library
- Group voice chat: Peer‑to‑peer audio per board (mute/volume controls)
- AI drawing assistant: Generate simple shapes from a text prompt
- Auth layouts and routes for login/register
- SPA‑friendly routing and Vercel rewrite config

## Tech Stack

- React 
- Tailwind CSS 4 
- Fabric.js for drawing
- Socket.IO client for realtime updates
- PeerJS (WebRTC) for voice chat

## Quick Start

Prerequisites:
- Node.js 18+ and npm

Install and run locally:

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Acknowledgements

- Fabric.js — powerful HTML5 canvas library
- Socket.IO — reliable realtime transport
- PeerJS — simple WebRTC for the web
