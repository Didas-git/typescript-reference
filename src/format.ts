import { twoslasher } from "@typescript/twoslash"

// Source: https://github.com/typescript-community/community-bot/blob/master/src/modules/twoslash.ts
export function format(s: string): string {
    const ret = twoslasher(s, "ts", {
        defaultCompilerOptions: {
            target: 99,
            module: 1,
            moduleResolution: 2,
            strict: true,
            allowUnreachableCode: false,
            allowUnusedLabels: false,
            noFallthroughCasesInSwitch: true,
            noImplicitAny: true,
            noImplicitOverride: true,
            noImplicitReturns: true,
            noImplicitThis: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            strictFunctionTypes: true,
            strictNullChecks: true,
            strictPropertyInitialization: true,
            useUnknownInCatchVariables: true,
            resolveJsonModule: true,
            declaration: true,
            declarationMap: true,
            importHelpers: true,
            noEmitOnError: true,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            allowSyntheticDefaultImports: true,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            incremental: false
        }
    });

    const resultLines: string[] = [];
    const twoslashLines = ret.code.split('\n');

    twoslashLines.forEach((line, index) => {
        resultLines.push(line);

        const lineErrors = ret.errors.filter(e => e.line === index);
        const lineQueries = ret.queries.filter(e => e.line === index + 1);

        if (lineErrors.length + lineQueries.length === 0) return;

        if (lineErrors.length) {
            // Make sure all lines of errors start with a comment
            const errors = lineErrors.map(
                e => '// ' + e.renderedMessage.split('\n').join('\n// '),
            );

            // Points to errors, e.g. '       ^^^^   ^^^^^'
            const hats = lineErrors
                // only those with a valid span
                .filter(x => x.character != null && x.length != null)
                // map to [start, end (non-inclusive)]
                .map(
                    error =>
                        [
                            error.character!,
                            error.character! + error.length!,
                        ] as const,
                )
                // sort by start, ascending
                .sort((a, b) => a[0] - b[0])
                // fix overlapping ranges
                .map((cur, i, a) => {
                    let prev = a[i - 1];
                    if (!prev) return cur;
                    return [
                        Math.max(prev[1], cur[0]),
                        Math.max(prev[1], cur[1]),
                    ] as const;
                })
                // remove empty ranges
                .filter(([start, end]) => start < end)
                // map each to hats
                .map(([start, end], i, a) => {
                    let prevEnd = a[i - 1]?.[1] ?? 0;
                    return (
                        ' '.repeat(start - prevEnd) +
                        '^'.repeat(end - start)
                    );
                })
                // join the resulting strings
                .join('');

            if (hats.length > 0) {
                resultLines.push('//' + hats.slice(2));
            }

            resultLines.push(...errors);
        }

        // Inline queries for showing the LSP lookup for a token
        if (lineQueries.length) {
            let queryComment = '//';
            lineQueries.forEach(q => {
                const spaceBefore = q.offset - queryComment.length;
                queryComment += ' '.repeat(spaceBefore);
                queryComment += '^? - ';
                queryComment +=
                    q.text?.replace(
                        /\n/g,
                        '\n//' + ' '.repeat(spaceBefore),
                    ) || '';
            });
            resultLines.push(queryComment);
        }
    });

    const output = resultLines.join('\n');
    return `\`\`\`ts\n${output.slice(0, -1)}\n\`\`\``
};
