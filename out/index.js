'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var colors = _interopDefault(require('chalk'));
var prefix = _interopDefault(require('prefix-stream'));
var execa = _interopDefault(require('execa'));

const watching = Boolean(process.env.ROLLUP_WATCH);
const noop = () => {};

function runPlugin({
  logPrefix = colors.magenta('run'),
  command = 'node',
  args,
  run,
  options = {},
  onStart = noop,
  onStop = noop,
} = {}) {
  if (!watching) { return { name: 'run' }; }

  // eslint-disable-next-line no-console
  const log = logPrefix ? console.log.bind(console, logPrefix) : console.log;

  const isFileToRun = run ?
    ({ file }) => file === run :
    ({ format }) => format === 'cjs';

  const prefixes = {
    stdout: logPrefix ? `${logPrefix} ${colors.green('log')} ` : '',
    stderr: logPrefix ? `${logPrefix} ${colors.red('err')} ` : '',
  };

  let runningProcess;

  function stop() {
    if (runningProcess) {
      log('Stopping...');

      runningProcess.kill();
      runningProcess = null;

      onStop();
    }
  }

  return {
    name: 'run',
    buildStart: stop,
    generateBundle({ file, format }) {
      if (isFileToRun({ file, format })) {
        log('Starting...');

        const current = execa(command, args || [file], options);
        runningProcess = current;

        const prefixed = {
          stdout: prefix(prefixes.stdout),
          stderr: prefix(prefixes.stderr),
        };

        prefixed.stdout.pipe(process.stdout);
        prefixed.stderr.pipe(process.stderr);
        runningProcess.stdout.pipe(prefixed.stdout);
        runningProcess.stderr.pipe(prefixed.stderr);

        runningProcess
          .then(() => {
            log('Process exitted');
            runningProcess = null;
          })
          .catch(err => {
            // console.log('CATCH');
            if (runningProcess === current) { // Prevent log on restart
              log('Error:', err);
            }
          });

        onStart(runningProcess);
      }
    },
  };
}

module.exports = runPlugin;
