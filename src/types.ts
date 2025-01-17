import { Command } from './modules/command';
import { Program } from './modules/program';

export interface ParserFlags {
  bools: Record<string, boolean>;
  strings: Record<string, boolean>;
  collect: Record<string, boolean>;
  negatable: Record<string, boolean>;
  unknownFn: (arg: string, key?: string, value?: unknown) => unknown;
  allBools: boolean;
}

export interface Tools {}

export interface ParserResult {
  _: Array<string | number>;
  [key: string]: any;
}

export interface ParserOptions {
  '--'?: boolean;

  alias?: Record<string, string | string[]>;

  boolean?: boolean | string | string[];

  default?: Record<string, unknown>;

  stopEarly?: boolean;

  string?: string | string[];

  collect?: string | string[];

  negatable?: string | string[];

  unknown?: (arg: string, key?: string, value?: unknown) => unknown;
}

export interface NestedMapping {
  [key: string]: NestedMapping | unknown;
}

export interface IProgramConfig {
  parser?: ParserOptions;
  plugins?: IPlugin[];
  tools?: Partial<Tools>;
  formatters?: {
    version?: (
      this: Required<IProgramConfig>,
      version: VersionNumber,
      name: string
    ) => string;
    help?: (
      this: Required<IProgramConfig>,
      sections: HelpSection[]
    ) => HelpSection[];
  };
  printHelpOnNotFound?: boolean;
  captureErrors?: boolean;
}

export type RawArgs = (string | number | string[] | number[])[];

export type IOptions = Record<string, string | number | boolean>;

export interface Commands {}

export type ProgramEvents =
  | 'register'
  | 'error'
  | 'beforeRun'
  | 'afterRun'
  | `run:${keyof Commands}`
  | `run:*`;

export interface IParsedArg {
  required: boolean;
  value: string;
  variadic: boolean;
}

export interface ICommandConfig {
  allowUnknownOptions?: boolean;
  ignoreOptionDefaultValue?: boolean;
}

export type VersionNumber = `${number}.${number}.${number}`;

export type Action<A extends RawArgs, O extends IOptions = IOptions> = (
  this: Command<A, O>,
  args: A,
  opts: O,
  tools: Tools
) => Promise<void> | void;

export interface DefineCommandOptions<A extends RawArgs, O extends IOptions> {
  action: Action<A, O>;
  description: string;
  usage?: string;
  aliases?: string[];
  version?: VersionNumber;
  examples?: CommandExample[];
  options?: {
    raw: string;
    description: string;
    default?: any;
  }[];
  config?: ICommandConfig;
}

export type EventType = string | symbol;

export type EventsMap<
  E extends Record<EventType, unknown>,
  D = E[keyof E]
> = Map<keyof E, Listener<D>[]>;

export type Listener<D = unknown> = (data: D) => void;

export interface IPlugin {
  name: string;
  build: (program: Program) => Program;
}

export interface HelpSection {
  title?: string;
  body: string;
}

export type CommandExample = ((bin: string) => string) | string;
