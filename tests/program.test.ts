import { describe, expect, it } from 'vitest';
import { Program } from '../src';
import { IProgramConfig } from '../src/types';

describe('Program()', () => {
  it('creates a new Program instance with the given name and version', () => {
    const name = 'Test';
    const version = '0.0.0';
    const program = new Program(name, version);

    expect(program).toBeInstanceOf(Program);
    expect(program.versionNumber).toBe(version);
    expect(program.name).toBe(name);
  });

  it('should accept an configuration object', () => {
    const config: IProgramConfig = {
      plugins: [],
      tools: {},
      captureErrors: false,
      formatters: {},
      parser: {},
      printHelpOnNotFound: true,
    };

    const program = new Program('Test', '0.0.0', config);

    expect(program.config).toEqual(config);
  });

  it('should accept an object of tools', () => {
    const mockLogger = (...args: any[]) => console.log(...args);

    const config: IProgramConfig = {
      tools: {
        mockLogger,
        hello: 'World',
      },
    };

    const program = new Program('Test', '0.0.0', config);

    expect(program.tools).toEqual(config.tools);
  });

  it('should parse regular arguments', () => {
    const program = new Program('Test');

    const argv = ['hello world', 'create', 'init'];

    const parsed = program.parse(argv);

    expect(parsed).toEqual({
      args: ['hello world', 'create', 'init'],
      options: {
        v: false, // Default Version flag
      },
    });
  });

  it('should parse variadic arguments', () => {
    const program = new Program('Test');

    program.command('create <...files>', 'Create command');

    const argv = ['index.html', 'app.js', 'styles.css'];

    const parsed = program.parse(argv);

    expect(parsed).toEqual({
      args: ['index.html', 'app.js', 'styles.css'],
      options: {
        v: false, // Default Version flag
      },
    });
  });

  it('should parse regular options', () => {
    const program = new Program('Test');

    program
      .command('', 'Default command')
      .option('-t, --type', 'Type of thing')
      .option('--name', 'Name of the thing', { default: 'Unknown' })
      .option('--email-address [email]', 'Email of the thing');

    const argv = ['--type=human', '--email-address=thing@gmail.com', '--i'];

    const parsed = program.parse(argv);

    expect(parsed).toEqual({
      args: [],
      options: {
        type: 'human',
        t: 'human',
        name: 'Unknown',
        'email-address': 'thing@gmail.com',
        i: true,
        v: false, // Default Version flag
      },
    });
  });

  it('should parse negated options', () => {
    const program = new Program('Test');

    program
      .command('', 'Default command')
      .option('--commit', 'Should commit files')
      .option('--emit', 'Should emit output');

    const argv = ['--no-emit', '--no-commit'];

    const parsed = program.parse(argv);

    expect(parsed).toEqual({
      args: [],
      options: {
        commit: false,
        emit: false,
        'no-commit': true,
        'no-emit': true,
        v: false, // Default Version flag
      },
    });
  });

  it('should parse dot-nested options', () => {
    const program = new Program('Test');

    program
      .command('', 'Default command')
      .option('--env', 'variables to inject in environment')
      .option('--user', 'user properties');

    const argv = ['--user.name=sid', '--env.secret=supersecret'];

    const parsed = program.parse(argv);

    expect(parsed).toEqual({
      args: [],
      options: {
        user: {
          name: 'sid',
        },
        env: {
          secret: 'supersecret',
        },
        v: false, // Default Version flag
      },
    });
  });
});
