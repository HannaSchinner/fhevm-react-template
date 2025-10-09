# Demo Video Creation Guide

This guide provides comprehensive instructions for creating a professional demo video showcasing the Universal FHEVM SDK.

---

## Table of Contents

- [Overview](#overview)
- [Video Requirements](#video-requirements)
- [Recommended Tools](#recommended-tools)
- [Pre-Recording Checklist](#pre-recording-checklist)
- [Video Script and Structure](#video-script-and-structure)
- [Scene-by-Scene Breakdown](#scene-by-scene-breakdown)
- [Technical Setup](#technical-setup)
- [Recording Tips](#recording-tips)
- [Post-Production](#post-production)
- [Final Checklist](#final-checklist)

---

## Overview

The demo video should effectively communicate:

1. **What** the Universal FHEVM SDK is
2. **Why** developers need it (problem it solves)
3. **How** easy it is to use (developer experience)
4. **What** can be built with it (real-world examples)

**Target Audience**: Web3 developers, blockchain enthusiasts, and technical decision-makers

**Goal**: Convince viewers that the SDK makes FHEVM accessible and practical

---

## Video Requirements

### Duration

- **Recommended**: 5-8 minutes
- **Minimum**: 3 minutes
- **Maximum**: 10 minutes

**Rationale**: Long enough to cover all features, short enough to maintain attention

### Format Specifications

| Specification | Requirement |
|--------------|-------------|
| **Resolution** | 1920x1080 (1080p) or higher |
| **Frame Rate** | 30 fps or 60 fps |
| **Format** | MP4 (H.264 codec) |
| **Audio** | 48kHz, stereo, -14 LUFS target |
| **Bitrate** | 8-10 Mbps (video), 192-320 kbps (audio) |
| **File Name** | `demo.mp4` |

### Content Requirements

Must demonstrate:

- [x] SDK installation process
- [x] Quick start example (< 10 lines of code)
- [x] React hooks usage
- [x] Encryption and decryption flows
- [x] At least one complete example application
- [x] Multi-framework support
- [x] Developer experience highlights

---

## Recommended Tools

### Screen Recording

| Tool | Platform | Price | Best For |
|------|----------|-------|----------|
| **OBS Studio** | Windows, Mac, Linux | Free | Professional quality, customizable |
| **Camtasia** | Windows, Mac | Paid ($299) | Easy editing, built-in effects |
| **ScreenFlow** | Mac | Paid ($169) | Mac-native, excellent quality |
| **Loom** | Web, Desktop | Free/Paid | Quick recordings, easy sharing |
| **ShareX** | Windows | Free | Lightweight, flexible |

**Recommendation**: **OBS Studio** for recording + **DaVinci Resolve** for editing (both free)

### Audio Recording

- **Built-in microphone**: Acceptable for internal demos
- **External USB microphone**: Recommended (Blue Yeti, Audio-Technica ATR2100)
- **Headset microphone**: Good alternative (HyperX, SteelSeries)

### Code Editor Setup

- Use a clean theme with good contrast
- Recommended: **VS Code** with **One Dark Pro** or **GitHub Dark** theme
- Font size: **16-18pt** minimum for readability
- Hide minimap and unnecessary panels
- Enable **Screencast Mode** (View → Appearance → Screencast Mode)

### Terminal Setup

- Use clean, readable terminal (Windows Terminal, iTerm2, Hyper)
- Font size: **16-18pt**
- Color scheme: High contrast (Dracula, One Dark, Solarized Dark)
- Clear command history before recording

---

## Pre-Recording Checklist

### Environment Setup

- [ ] Close all unnecessary applications
- [ ] Disable notifications (OS, Slack, email, etc.)
- [ ] Clear browser tabs except required ones
- [ ] Clean desktop (hide icons or use clean wallpaper)
- [ ] Prepare all code examples in advance
- [ ] Test all commands to ensure they work
- [ ] Have deployment links ready

### Project Setup

- [ ] Fresh monorepo clone (shows real installation)
- [ ] Contracts deployed to testnet
- [ ] Wallet funded with test ETH
- [ ] All examples tested and working
- [ ] Network connection stable

### Recording Setup

- [ ] Recording software tested and configured
- [ ] Audio levels checked (not too quiet or loud)
- [ ] Screen resolution set to 1920x1080
- [ ] Microphone positioned correctly
- [ ] Quiet environment (no background noise)
- [ ] Glass of water nearby (for speaking)

### Content Preparation

- [ ] Script written and rehearsed
- [ ] Code snippets prepared
- [ ] Demo accounts created
- [ ] Browser bookmarks for quick navigation
- [ ] Talking points outlined

---

## Video Script and Structure

### Opening (30-45 seconds)

**Visual**: Title slide or landing page

**Script**:
> "Hey everyone! Today I'm excited to show you the Universal FHEVM SDK - a game-changing toolkit that makes building privacy-preserving blockchain applications incredibly simple.
>
> If you've ever wanted to build dApps where user data stays encrypted on-chain, but found the complexity overwhelming, this SDK is for you.
>
> Let's dive in and see how easy it is to get started."

### Problem Statement (30-45 seconds)

**Visual**: Traditional blockchain vs FHEVM comparison

**Script**:
> "Traditional blockchain applications have a major limitation - all data is publicly visible. Your balance, your transactions, your game state - everything is exposed.
>
> Zama's FHEVM solves this with Fully Homomorphic Encryption, allowing smart contracts to compute on encrypted data. But integrating FHEVM has been complex - until now.
>
> The Universal FHEVM SDK wraps all that complexity into a simple, wagmi-like API that web3 developers already know how to use."

### Features Overview (45-60 seconds)

**Visual**: README features section or feature highlights

**Script**:
> "The SDK is framework-agnostic - use it with React, Next.js, Vue, Node.js, or any JavaScript environment.
>
> It provides a familiar wagmi-like API with React hooks, Vue composables, and vanilla JavaScript functions.
>
> Everything you need is included: encryption, decryption, key management, and contract interactions - all with comprehensive TypeScript support.
>
> And the best part? You can get started in less than 10 lines of code."

### Quick Start Demo (90-120 seconds)

**Visual**: VS Code with quick start example

**Script**:
> "Let me show you just how easy it is. Here's a complete example that encrypts data and sends it to a smart contract.
>
> [Type and explain each line]
>
> First, we import the SDK and create a client. It automatically detects your wallet provider.
>
> Then we encrypt a value - say, a transfer amount of 1000 tokens.
>
> Next, we send it to our smart contract. The encrypted value is processed on-chain without ever being decrypted.
>
> Finally, when we need to view the result, we decrypt it with one line of code.
>
> That's it - private transactions in under 10 lines!"

### Installation & Setup (60-90 seconds)

**Visual**: Terminal showing installation

**Script**:
> "Getting started is straightforward. Let me show you the monorepo setup.
>
> [Show commands]
>
> Clone the repository, run npm install to set up the monorepo with all packages and examples.
>
> Build the SDK package, and you're ready to start developing.
>
> The monorepo includes three complete examples: a Next.js music royalty platform, a basic React app, and a Node.js CLI tool.
>
> Each example demonstrates different aspects of the SDK."

### React Integration Deep Dive (90-120 seconds)

**Visual**: React example code and running application

**Script**:
> "For React developers, the SDK provides purpose-built hooks that feel just like wagmi.
>
> [Show FhevmProvider setup]
>
> Wrap your app with the FhevmProvider to make the SDK available throughout your component tree.
>
> [Show hooks usage]
>
> Use useFhevm to access the client, useEncrypt to encrypt values, and useDecrypt to reveal encrypted data.
>
> [Show running application]
>
> Here's the React example running. Notice how smooth the experience is - encryption happens seamlessly in the background."

### Featured Example: Music Royalty Platform (2-3 minutes)

**Visual**: Next.js music royalty app walkthrough

**Script**:
> "Now let's look at a real-world example - a privacy-preserving music royalty distribution platform built with Next.js.
>
> [Show application UI]
>
> Musicians can register their tracks and set royalty percentages for collaborators, all while keeping sensitive financial data encrypted on-chain.
>
> [Show smart contract interaction]
>
> When a track generates revenue, the smart contract automatically splits payments according to the encrypted royalty shares - without ever revealing individual percentages to the public.
>
> [Show encryption in action]
>
> Watch as we add a new track. The royalty percentage gets encrypted before being sent to the blockchain.
>
> [Show decryption]
>
> As an authorized user, I can decrypt and view my own royalty information, but other users cannot.
>
> This demonstrates the power of FHEVM - privacy-preserving business logic that's actually usable.
>
> [Show contract code briefly]
>
> The Solidity contracts use Zama's FHEVM library, and the SDK handles all the complexity of interacting with encrypted types."

### Multi-Framework Support (60-90 seconds)

**Visual**: Quick cuts between different framework examples

**Script**:
> "The SDK isn't limited to React. Let me quickly show you the same functionality in different environments.
>
> [Show Vue example]
>
> Here's a Vue component using the core SDK functions.
>
> [Show Node.js CLI]
>
> And here's a Node.js CLI tool for backend automation - perfect for admin tasks or data processing.
>
> [Show code comparison]
>
> Notice how the core API stays consistent across all frameworks. Learn it once, use it everywhere."

### Architecture & Design (45-60 seconds)

**Visual**: Architecture diagram from README

**Script**:
> "Let's talk about the architecture briefly.
>
> The SDK is built in layers: a framework-agnostic core that handles all FHEVM operations, and framework-specific adapters that provide the best developer experience for each environment.
>
> It wraps Zama's fhevmjs library with a simpler API, manages encryption instances, handles provider connections, and provides comprehensive error handling.
>
> Everything is TypeScript-first with full type safety, and the modular design means you only bundle what you use."

### Developer Experience Highlights (45-60 seconds)

**Visual**: Documentation, TypeScript IntelliSense, error handling

**Script**:
> "Developer experience was a top priority.
>
> [Show TypeScript IntelliSense]
>
> Full TypeScript support means you get autocomplete and type checking everywhere.
>
> [Show documentation]
>
> Comprehensive documentation with examples for every use case.
>
> [Show error handling]
>
> Helpful error messages that guide you to solutions.
>
> [Show hot reload]
>
> And fast iteration with hot reload across all examples."

### Deployment & Live Demo (30-45 seconds)

**Visual**: Browser showing deployed application

**Script**:
> "The examples are deployed live so you can try them right now.
>
> [Show deployed app]
>
> Here's the music royalty platform running on Sepolia testnet with real encrypted transactions.
>
> [Show transaction on block explorer]
>
> You can verify the data is encrypted on-chain - the values are not human-readable on the blockchain."

### Call to Action & Resources (30-45 seconds)

**Visual**: GitHub repository, documentation links

**Script**:
> "Ready to build privacy-preserving dApps?
>
> The repository is open source and available now. Clone it, explore the examples, and start building.
>
> You'll find comprehensive documentation, multiple working examples, and an active community ready to help.
>
> Check out the links in the description for the repository, documentation, and live deployments.
>
> If you build something cool with the SDK, we'd love to see it - share it in the discussions!"

### Closing (15-30 seconds)

**Visual**: Thank you slide or return to repository

**Script**:
> "Thanks for watching! The Universal FHEVM SDK makes privacy-preserving blockchain development accessible to every developer.
>
> Don't forget to star the repository and join the community.
>
> Happy building, and welcome to the future of privacy-first dApps!"

---

## Scene-by-Scene Breakdown

### Scene 1: Introduction
- **Duration**: 30-45 seconds
- **Visuals**: Title slide → README header
- **Audio**: Energetic introduction
- **Text Overlay**: "Universal FHEVM SDK", "Privacy-First dApps Made Simple"

### Scene 2: Problem/Solution
- **Duration**: 30-45 seconds
- **Visuals**: Diagram or comparison slide
- **Audio**: Problem explanation
- **Text Overlay**: Key pain points and solution

### Scene 3: Features
- **Duration**: 45-60 seconds
- **Visuals**: Features list, bullet points
- **Audio**: Feature overview
- **Text Overlay**: Framework icons (React, Vue, Node.js)

### Scene 4: Quick Start Code
- **Duration**: 90-120 seconds
- **Visuals**: VS Code with code being typed
- **Audio**: Code explanation line by line
- **Text Overlay**: Line numbers, key concepts
- **Note**: Type code in real-time (or realistic speed) for authenticity

### Scene 5: Installation
- **Duration**: 60-90 seconds
- **Visuals**: Terminal with commands
- **Audio**: Installation walkthrough
- **Text Overlay**: Command being executed

### Scene 6: React Hooks
- **Duration**: 90-120 seconds
- **Visuals**: Code + running React app side-by-side
- **Audio**: Hook explanation and demo
- **Text Overlay**: Hook names and purposes

### Scene 7: Featured Example
- **Duration**: 2-3 minutes
- **Visuals**: Music royalty app walkthrough
- **Audio**: Feature demonstration
- **Text Overlay**: Key features, transaction flow
- **Note**: Show actual interactions, not just static screens

### Scene 8: Multi-Framework
- **Duration**: 60-90 seconds
- **Visuals**: Quick cuts between frameworks
- **Audio**: Framework comparison
- **Text Overlay**: Framework names

### Scene 9: Architecture
- **Duration**: 45-60 seconds
- **Visuals**: Architecture diagram
- **Audio**: Design explanation
- **Text Overlay**: Layer names

### Scene 10: Developer Experience
- **Duration**: 45-60 seconds
- **Visuals**: Various DX features
- **Audio**: DX highlights
- **Text Overlay**: Feature names

### Scene 11: Live Deployment
- **Duration**: 30-45 seconds
- **Visuals**: Browser with deployed app
- **Audio**: Deployment showcase
- **Text Overlay**: Deployment URLs

### Scene 12: Call to Action
- **Duration**: 30-45 seconds
- **Visuals**: GitHub repo, links
- **Audio**: CTA and resources
- **Text Overlay**: URLs, GitHub stars

### Scene 13: Closing
- **Duration**: 15-30 seconds
- **Visuals**: Thank you slide
- **Audio**: Closing remarks
- **Text Overlay**: "Thank You", Social links

---

## Technical Setup

### OBS Studio Configuration

#### Canvas Resolution
```
Settings → Video
Base (Canvas) Resolution: 1920x1080
Output (Scaled) Resolution: 1920x1080
FPS: 60 or 30
```

#### Output Settings
```
Settings → Output
Output Mode: Advanced
Encoder: x264 or Hardware (NVIDIA NVENC, AMD VCE)
Rate Control: CBR
Bitrate: 8000-10000 Kbps
Keyframe Interval: 2
CPU Preset: veryfast (for x264)
```

#### Audio Settings
```
Settings → Audio
Sample Rate: 48 kHz
Channels: Stereo
Desktop Audio: Monitor output (for system sounds)
Microphone: Your microphone device
```

#### Scene Setup

**Scene 1: Full Screen**
- Display Capture (full screen)
- Audio: Desktop + Microphone

**Scene 2: Code Focus**
- Display Capture (VS Code)
- Crop to editor area
- Audio: Desktop + Microphone

**Scene 3: Terminal Focus**
- Display Capture (Terminal)
- Crop to terminal
- Audio: Desktop + Microphone

**Scene 4: Browser Demo**
- Window Capture (Browser)
- Audio: Desktop + Microphone

**Scene 5: Picture-in-Picture**
- Display Capture (main)
- Webcam (corner overlay - optional)
- Audio: Desktop + Microphone

### Audio Recording Tips

1. **Microphone Position**: 6-8 inches from mouth, slightly off-axis
2. **Room Treatment**: Record in quiet room, use soft furnishings to reduce echo
3. **Audio Levels**: Aim for -12dB to -6dB peak levels
4. **Pop Filter**: Use to reduce plosives (p, b, t sounds)
5. **Test Recording**: Record 30 seconds and listen back before full recording

### Screen Recording Settings

#### VS Code
```json
{
  "editor.fontSize": 18,
  "editor.lineHeight": 26,
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "none",
  "workbench.colorTheme": "One Dark Pro",
  "screencastMode.enabled": true,
  "screencastMode.fontSize": 56,
  "screencastMode.verticalOffset": 10
}
```

#### Terminal
- Font: Fira Code, JetBrains Mono, or Cascadia Code
- Font Size: 16-18pt
- Opacity: 95-100%
- Cursor: Block or Underline (visible)

#### Browser
- Zoom level: 110-125% (for readability)
- Dev tools: Closed unless demonstrating
- Extensions: Hide toolbar icons
- Fullscreen mode: For app demos

---

## Recording Tips

### Before Recording

1. **Rehearse**: Practice your script 2-3 times
2. **Hydrate**: Drink water (avoid dairy/coffee right before)
3. **Warm Up**: Practice talking out loud for 5 minutes
4. **Deep Breath**: Take a few deep breaths to relax

### During Recording

1. **Speak Clearly**: Articulate words, don't rush
2. **Maintain Energy**: Keep enthusiastic tone throughout
3. **Pause Naturally**: Allow natural pauses between topics
4. **Cursor Awareness**: Move cursor deliberately, don't dart around
5. **Typing Speed**: Type at normal speed (can speed up in post if needed)
6. **Mistakes Are OK**: Pause, take a breath, and continue (you'll edit later)

### Recording Strategy

**Option A: All at Once**
- Record the entire video in one take
- Pros: Natural flow, authentic
- Cons: May need multiple attempts

**Option B: Scene by Scene**
- Record each scene separately
- Pros: Perfect each section, easier to fix mistakes
- Cons: Need to stitch together in editing

**Recommendation**: Scene by scene for first-time creators

### Common Mistakes to Avoid

- [ ] Speaking too fast
- [ ] Not pausing between topics
- [ ] Mouse cursor jumping erratically
- [ ] Notification popups during recording
- [ ] Background noise (AC, traffic, keyboard clicks)
- [ ] Forgetting to record audio
- [ ] Screen resolution too low
- [ ] Code font too small
- [ ] Mumbling or low energy
- [ ] Going off-script for too long

---

## Post-Production

### Video Editing (DaVinci Resolve / Camtasia)

#### Basic Editing Steps

1. **Import Footage**: Import all recorded scenes
2. **Rough Cut**: Arrange scenes in order
3. **Trim**: Remove mistakes, long pauses, "ums"
4. **Transitions**: Add simple cuts or fades (don't overdo)
5. **Text Overlays**: Add titles, URLs, code highlights
6. **Background Music**: Add subtle music (low volume, royalty-free)
7. **Color Correction**: Adjust brightness/contrast if needed
8. **Audio Cleanup**: Remove background noise, normalize levels

#### Text Overlays

Add text overlays for:
- Video title (opening)
- Key concepts (during explanation)
- URLs and links (when mentioned)
- Code highlights (important lines)
- Framework names (during comparisons)
- Call to action (closing)

**Text Settings**:
- Font: Clean sans-serif (Open Sans, Roboto, Inter)
- Size: 48-72pt for titles, 36-48pt for body
- Color: High contrast with background
- Position: Lower third or upper third
- Duration: 3-5 seconds minimum

#### Royalty-Free Music Sources

- YouTube Audio Library (free)
- Epidemic Sound (paid subscription)
- Artlist (paid subscription)
- Bensound (free with attribution)
- Free Music Archive (free)

**Music Guidelines**:
- Volume: -20dB to -25dB (background only)
- Genre: Tech, upbeat, modern
- No vocals unless instrumental version
- Fade in at start, fade out at end

### Audio Post-Processing

Use Audacity or Adobe Audition:

1. **Noise Reduction**: Remove background hiss
2. **Compression**: Even out volume levels
3. **EQ**: Boost clarity (200-300Hz cut, 2-5kHz boost)
4. **Normalization**: Target -14 LUFS for online video
5. **Limiting**: Prevent clipping peaks

### Export Settings

#### DaVinci Resolve
```
Format: MP4
Codec: H.264
Resolution: 1920x1080
Frame Rate: Match source (30 or 60 fps)
Quality: Automatic (or 8-10 Mbps)
Audio Codec: AAC
Audio Bitrate: 192-320 kbps
```

#### Camtasia
```
Format: MP4 - Smart Player (Web)
Video Settings: 1080p HD
Frame Rate: 60 or 30 fps
Quality: High (or Production Quality)
Audio: AAC, 192 kbps
```

### File Size Optimization

Target file size: < 500MB for easy upload

If too large:
- Reduce bitrate to 6-8 Mbps
- Use 30 fps instead of 60 fps
- Trim any unnecessary sections
- Use 2-pass encoding for better quality at lower bitrate

---

## Final Checklist

### Before Publishing

- [ ] Video length appropriate (3-10 minutes)
- [ ] Resolution is 1080p
- [ ] Audio is clear and loud enough
- [ ] No background noise or glitches
- [ ] All text overlays are visible and correct
- [ ] Transitions are smooth
- [ ] Code is readable
- [ ] URLs are correct
- [ ] No typos in text overlays
- [ ] Music volume is appropriate
- [ ] Opening is engaging
- [ ] Closing has clear call to action
- [ ] File name is `demo.mp4`
- [ ] File size is reasonable (< 500MB preferred)

### Content Verification

- [ ] SDK installation demonstrated
- [ ] Quick start code shown
- [ ] React hooks explained
- [ ] Encryption/decryption flows covered
- [ ] At least one full example shown
- [ ] Multi-framework support mentioned
- [ ] Developer experience highlighted
- [ ] Live deployment shown
- [ ] Call to action included
- [ ] Credits to Zama included

### Technical Quality

- [ ] Video plays smoothly (no stuttering)
- [ ] Audio syncs with video
- [ ] Colors are accurate
- [ ] Text is legible at all sizes
- [ ] No visual artifacts or glitches
- [ ] Aspect ratio correct (16:9)
- [ ] Framerate consistent throughout

### Accessibility

- [ ] Speaking pace is reasonable
- [ ] Technical terms are explained
- [ ] Code is well-commented in demos
- [ ] Visual elements support audio
- [ ] Text overlays reinforce key points

---

## Upload and Sharing

### Recommended Platforms

1. **YouTube** - Best for public sharing, SEO
2. **Vimeo** - High quality, professional
3. **Google Drive** - Easy sharing with link
4. **GitHub Releases** - Attach to repository release

### YouTube Upload Guidelines

**Title**: "Universal FHEVM SDK - Build Privacy-Preserving dApps with Ease"

**Description**:
```
A comprehensive walkthrough of the Universal FHEVM SDK - a framework-agnostic
toolkit for building confidential blockchain applications with Fully Homomorphic
Encryption.

🔗 Links:
GitHub: [your-repo-url]
Documentation: [docs-url]
Live Demo: [demo-url]

⏱️ Timestamps:
0:00 Introduction
0:45 Problem & Solution
1:30 Features Overview
2:15 Quick Start Demo
4:00 React Integration
6:00 Music Royalty Example
8:30 Multi-Framework Support
9:45 Call to Action

🏷️ Topics:
#blockchain #web3 #encryption #fhevm #privacy #ethereum #react #nextjs

Built for Zama's FHEVM ecosystem: https://www.zama.ai/
```

**Tags**:
- blockchain
- web3
- ethereum
- privacy
- encryption
- fhevm
- zama
- react
- nextjs
- sdk
- typescript
- tutorial

**Thumbnail**: Create custom thumbnail with:
- SDK logo/title
- Key visual (code or app screenshot)
- Bright, contrasting colors
- Text: "Privacy-First dApps Made Simple"

---

## Example Timeline

For a 7-minute video:

```
00:00 - 00:30  Introduction & hook
00:30 - 01:00  Problem statement
01:00 - 01:45  Features overview
01:45 - 03:00  Quick start demo (typing code)
03:00 - 04:00  Installation & setup
04:00 - 05:30  React integration demo
05:30 - 08:00  Featured example (music royalty)
08:00 - 09:00  Multi-framework showcase
09:00 - 09:45  Architecture & developer experience
09:45 - 10:15  Live deployment
10:15 - 10:45  Call to action & resources
10:45 - 11:00  Closing
```

---

## Additional Resources

### Learning Resources
- [OBS Studio Quickstart](https://obsproject.com/wiki/OBS-Studio-Quickstart)
- [DaVinci Resolve Tutorials](https://www.blackmagicdesign.com/products/davinciresolve/training)
- [Camtasia Tutorials](https://www.techsmith.com/tutorial-camtasia.html)

### Inspiration
- [wagmi Documentation Videos](https://wagmi.sh/)
- [Vercel Product Demos](https://vercel.com/)
- [GitHub Product Launches](https://www.youtube.com/@GitHub)

### Stock Assets
- [Unsplash](https://unsplash.com/) - Free images
- [Pexels](https://www.pexels.com/) - Free videos
- [Undraw](https://undraw.co/) - Free illustrations

---

## Need Help?

If you encounter issues during video creation:

1. Check the OBS/recording software documentation
2. Test with a short 1-minute sample first
3. Ask for feedback on rough cuts before final editing
4. Consider hiring a video editor if post-production is challenging

---

**Good luck with your demo video! Your demonstration of the Universal FHEVM SDK will help countless developers build privacy-preserving applications.**
