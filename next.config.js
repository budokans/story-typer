/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require("next-transpile-modules")(["firelordjs"]);

module.exports = withTM({
  /* Any Next.js config */
});
