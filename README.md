# Mafia Plus

![Mafia Plus](public/mafia-banner.png)

An extended version of the popular social-deduction game — Mafia (also known as Werewolf).

Live at [mafia.rafalkwiecien.com](https://mafia.rafalkwiecien.com) (work in progress).

## Table of Contents

- [Background](#background)
- [Rules](#rules)
- [Local development](#local-development)
- [Tech stack](#tech-stack)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

When I was little, a supervisor on a kids camp I attended, taught us how to play Mafia. But his take on it was a little more advanced than straight 'doctor/detective/citizens vs mafioso' approach. Everybody was secretly and randomly assigned a named, unique character, which had its own little backstory, and most importantly, a specific ability. This enhanced way of playing was captivating, as every next game was very much different from the last. The skill in playing such version of Mafia suddenly had a tremendously more advanced learning curve - as each game, you also have to track what characters are in play, who used their ability, what even *is* every characters's ability, or even what to do with *the third faction*.

Throughout the years, me and my closest friends improved upon our version of Mafia, and I hope you can get to enjoy it as much as we do.

## Rules

The full rules and character roster live on the [site](https://mafia.rafalkwiecien.com), in English and Polish. The complete rulebook is also in this repo: [rules-en.md](rules-en.md) and [rules-pl.md](rules-pl.md).

## Local development

Requires Node 18+ (developed on Node 24).

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # static output into ./dist
npm run preview  # serve the production build locally
```

## Tech stack

- [Astro](https://astro.build) with TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- Deployed on Cloudflare Pages

## Maintainers

[Rafał Kwiecień](https://github.com/kwiecien-rafal)

## Contributing

Issues and pull requests are welcome. Open an issue to ask a question or propose a change before sending a large PR.

## License

This project is dual-licensed, because it contains two different kinds of work:

- **Code** — everything under `src/`, config files and build scripts — is
  licensed under the [MIT License](LICENSE).
- **Game content** — the rules, character names and descriptions, flavor text
  and visual assets — is licensed under
  [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE-CONTENT).

In short: reuse the code freely under MIT, and reuse the content freely too as long as you credit the original. Note that copyright covers the specific wording and art, not the game's underlying mechanics, which anyone is free to reimplement.
