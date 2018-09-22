# rollup-plugin-run

> Run a bundled node module while watching for changes.

## Installation

```
npm i --save-dev rollup-plugin-run
```

## Usage

Include the following in the rollup config:

```javascript
import run from 'rollup-plugin-run';

export default {
  ...
  plugins: [
    run(/* options */),
  ],
  output: {
    file: './out/server.js',
    format: 'cjs',
  }
  ...
}
```

## Options

> For a full list of options browse the source code.

The plugin decides what command / module to run based on some options:

- `command` The command to run. Defaults to `'node'`.
- `args` An array with arguments to pass. Useful in combination with *command*.

- `run` The file to watch. If no *args* are passed *run* is passed to *command*. Defaults to the first file in the *output* configuration with *format* set to `'cjs'`.

**Examples:**

Assuming *output* is set to `{ file: './out/server.js', format: 'cjs' }` in the rollup configuration.

```javascript
run() // 'node ./out/server.js' is run after each build
run({ run: './another.js' }) // 'node ./another.js' is run
run({ command: 'echo' }) // 'echo ./out/server.js' is run
run({ command: 'micro-dev', args: [] }) // 'micro' is run
```

