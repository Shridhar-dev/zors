import { findAllBrackets, removeBrackets } from './lib/utils';
import { Command } from './modules/command';
import { Program } from './modules/program';
import {
  DefineCommandOptions,
  IOptions,
  IProgramConfig,
  RawArgs,
  VersionNumber,
} from './types';

/**
 * A fascade function to create a new instance of Command
 */
export function defineCommand<
  A extends RawArgs = RawArgs,
  O extends IOptions = IOptions
>(raw: string, options: DefineCommandOptions<A, O>) {
  const command = new Command<A, O>(
    removeBrackets(raw),
    options.description,
    options.config
  );

  command.raw = raw;

  command.args = findAllBrackets(raw);

  options.aliases?.forEach((al) => command.alias(al));

  options.options?.forEach((el) =>
    command.option(el.raw, el.description, {
      default: el.default,
    })
  );

  options.examples?.forEach((el) => command.example(el));

  command.action(options.action);

  return command;
}

/**
 * Creates a new Program
 * @param name Name of the CLI program
 * @param version Version number (SEMVER)
 * @param config
 * @returns
 */
export function zors(
  name: string,
  version?: VersionNumber,
  config?: Omit<IProgramConfig, 'tools'> & { tools?: Record<string, any> }
): Program {
  return new Program(name, version, config || {});
}
