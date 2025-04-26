# Bot

## Setup

To manage dependencies, it is recommended to use Yarn, using `yarn --immutable` to install dependencies.

Create a `.env.development.local` file inside the `src` directory, copying the template from the `.env` file in the same
directory, and then fill in the fields. The ENV loader is powered by
[`@skyra/env-utilities`](https://www.npmjs.com/package/@skyra/env-utilities), more information in the package.
