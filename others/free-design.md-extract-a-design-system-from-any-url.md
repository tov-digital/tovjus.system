---
name: Free design.md — extract a design system from any URL
description: Paste a URL. We headlessly load the page, capture its colors, fonts, and shapes, and render a portable design.md spec. Sign in to enrich it with Claude.
colors:
  primary: "160.118 84.08% 39.412%"
  background: "#ffffff"
  text: "#121212"
typography:
  heading-1:
    fontFamily: Poppins
    fontFamilyStack: "Poppins, Avenir, Helvetica, Arial, sans-serif"
    fontSize: 48px
    fontWeight: 600
  heading-2:
    fontFamily: Poppins
    fontFamilyStack: "Poppins, Avenir, Helvetica, Arial, sans-serif"
    fontSize: 18px
    fontWeight: 600
  heading-3:
    fontFamily: Poppins
    fontFamilyStack: "Poppins, Avenir, Helvetica, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 600
  body:
    fontFamily: Poppins
    fontFamilyStack: "Poppins, Avenir, Helvetica, Arial, sans-serif"
    fontWeight: 400
rounded:
  md: .3125rem
  button: 5px
  card: 5px
spacing:
  scale: ["6px", "8px", "10px", "12px", "16px", "20px"]
components:
  card:
    background: "oklab(0.954232 0.000043422 0.0000190735 / 0.25)"
    color: "#121212"
    radius: 5px
    padding: 16px
    border: "1px solid #121212"
  link:
    color: "#121212"
    textDecoration: none
    fontWeight: 400
  headings:
    h1:
      lineHeight: 48px
      letterSpacing: -1.2px
      color: "#121212"
    h2:
      lineHeight: 28px
      letterSpacing: -0.45px
      color: "#121212"
    h3:
      lineHeight: 20px
      letterSpacing: normal
      color: "#121212"
---

## Overview

Paste a URL. We headlessly load the page, capture its colors, fonts, and shapes, and render a portable design.md spec. Sign in to enrich it with Claude.

## Colors

- **Primary** — `{colors.primary}` — `160.118 84.08% 39.412%`
- **Background** — `{colors.background}` — `#ffffff`
- **Text** — `{colors.text}` — `#121212`

## Typography

- **Headings** — `Poppins`, weight `600`. Sizes: h1 48px / h2 18px / h3 14px.
- **Body** — `Poppins`, weight `400`.

## Shapes

- Border radius: `.3125rem`

## Spacing

- Scale: `6px / 8px / 10px / 12px / 16px / 20px`

## Components

### Card

- Background — `{components.card.background}` — `oklab(0.954232 0.000043422 0.0000190735 / 0.25)`
- Color — `#121212`
- Radius — `5px`
- Padding — `16px`
- Border — `1px solid #121212`

### Link

- Color — `{components.link.color}` — `#121212`
- Decoration — `none`
- Weight — `400`

### Headings

- **h1** — line-height `48px`, letter-spacing `-1.2px`, color `#121212`.
- **h2** — line-height `28px`, letter-spacing `-0.45px`, color `#121212`.
- **h3** — line-height `20px`, letter-spacing `normal`, color `#121212`.
