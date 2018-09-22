import builtinModules from 'builtin-modules';
import { dependencies } from './package.json';

export default {
  input: './src/index.js',
  external: builtinModules
    .concat(Object.keys(dependencies)),
  output: {
    file: './out/index.js',
    format: 'cjs',
  },
};
