import { Command } from 'commander';

export const program = new Command();

program
    .option(
        '-p, --port <number>',
        'Start the server with the specified port. Default: 3000',
        '3000'
    )
    .option('-o, --origin <url>', 'Specify the origin of the server.')
    .option('--clear-cache', 'Clears the cache and shuts down the server')
    .parse();
