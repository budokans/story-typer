# Story Typer

A JamStack speed-typing game for lovers of short - _very_ short - stories.

## How it came to be

Finding myself spending a lot of time on speed-typing apps like [TypeRacer](https://play.typeracer.com "TypeRacer" ), I decided to craft one of my own.

Fifty-word stories are fetched from [fiftywordstories.com](http://fiftywordstories.com "Fifty-Word Stories") via the WordPress API, and this is done daily using a Vercel CRON job that hits an 'update' serverless function.

Next.js was used for ease of development, fast build time, and flexible rendering options. Because the total stories count changes daily, the homepage is incrementally statically generated such that it forces a daily rebuild so that a reasonably up-to-date total number of stories can be displayed.

SEO is less important for the rest of the pages as they lie behind an auth wall. These are therefore entirely pre-rendered without data and render a loading state until auth, user and other data are fetched client-side.

react-query handles querying, caching, and revalidation for most data-fetching operations. useInfiniteQuery and the Intersection Observer API were used to implement infinite scrolling on the archive and favorites pages.

Because no external API needed to be provided and using a REST API would result in performance penalties, almost all data-fetching is accomplished by querying the Firestore database directly.

Component composition is heavily used throughout, with the compound or 'composite' components composed in containers.

Almost all application state is stored and manipulated in custom hooks, with global state (auth) and authenticated-only state (user, stories) passed down via context.

Partly tested with Jest, the rest of the project will be functionally tested with a combination of Jest and React Testing Library.

## Installation

Install via NPM `npm install` and run with `npm run dev`.

## Links

- [Visit Story Typer](https://storytyper.stevenwebster.co "Story Typer")
- [See my portofolio](https://stevenwebster.co "Steven Webster")
