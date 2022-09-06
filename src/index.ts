#!/usr/bin/env node

import { createReadStream, createWriteStream } from 'node:fs';
import * as readline from 'node:readline/promises';
import { format } from "./format";

const CODE_BLOCK_SYMBOL = '```';

export async function transformFile(source: string, destination: string): Promise<void> {
    const input = createReadStream(source);
    const output = createWriteStream(destination);
    const rl = readline.createInterface({ input, crlfDelay: Infinity });

    let inCodeBlock = false;
    let tempCodeBlock = '';
    for await (const line of rl) {
        if (line.startsWith(CODE_BLOCK_SYMBOL)) {
            tempCodeBlock += `${line}\n`;

            if (inCodeBlock) {
                output.write(`${format(tempCodeBlock)}\n`);
                tempCodeBlock = '';
            }

            inCodeBlock = !inCodeBlock;

            continue;
        }

        if (inCodeBlock) tempCodeBlock += `${line}\n`;
        else output.write(`${line}\n`);
    }

    output.end();
}

transformFile(process.argv[2], process.argv[3]);