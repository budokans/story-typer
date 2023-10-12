
# Story Typer

A JamStack speed-typing game for lovers of short - _very_ short - stories.

## How it came to be

Finding myself enjoying speed-typing games like [TypeRacer](https://play.typeracer.com "TypeRacer" ), I decided to craft one of my own.

Fifty-word stories are fetched from [fiftywordstories.com](http://fiftywordstories.com "Fifty-Word Stories") via the WordPress API, and this operation is triggered daily by a Vercel CRON job that hits a serverless function at a Next.js API endpoint.

I chose Next.js as a framework for its built-in routing, fast build time, and flexible rendering options. I employed its incremental static page generation on the homepage to balance a fast load time with up-to-date stories counter data.

I used TanStack Query to manage asynchronous state. It supplies a `useInfiniteQuery` hook, which I combined with the Intersection Observer API to implement infinite scrolling on the Archive and Favorites pages.

Component composition is used throughout, with minimally-complex React components composed in containers to improve readability and maintainability.

Almost all application state is managed in custom hooks, with global state (auth) and authenticated-only state (user, stories) accessible via the Context API.

The scraper and parser were built using test-driven development with Jest. Firebase security rules were also written using TDD. UI and integration tests are noticeably absent - I will write them when time permits. Until then, having used a stringent TypeScript configuration and [FirelordJS](https://github.com/tylim88/FirelordJS "FirelordJS"), (a TypeScript wrapper around the Firebase SDK) has imbued me with a reasonable level of confidence in the codebase.

I recently refactored this project using the [fp-ts](https://github.com/gcanti/fp-ts "fp-ts") library, which I like because it forces me to follow good practices like keeping functions pure, acknowledging and handling all error cases, and making impossible states unrepresentable. Because some of the APIs used for convenience (TanStack Query, for example) aren't geared toward functional programming, the code on the border of the application is not strictly functional.

## Installation

Install with `npm install` and spin up a Next.js dev server with `npm run dev`.

## Links

- [Visit Story Typer](https://storytyper.stevenwebster.co "Story Typer")
- [See my portofolio](https://stevenwebster.co "Steven Webster")
