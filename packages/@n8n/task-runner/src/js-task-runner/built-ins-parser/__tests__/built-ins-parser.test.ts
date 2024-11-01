import { BuiltInsParser } from '../built-ins-parser';
import { BuiltInsParserState } from '../built-ins-parser-state';

describe('BuiltInsParser', () => {
	const parser = new BuiltInsParser();

	const parseAndExpectOk = (code: string) => {
		const result = parser.parseUsedBuiltIns(code);
		if (!result.ok) {
			fail(result.error);
		}

		return result.result;
	};

	describe('Env, input, execution and prevNode', () => {
		const cases: Array<[string, BuiltInsParserState]> = [
			['$env', new BuiltInsParserState({ needs$env: true })],
			['$execution', new BuiltInsParserState({ needs$execution: true })],
			['$prevNode', new BuiltInsParserState({ needs$prevNode: true })],
		];

		test.each(cases)("should identify built-ins in '%s'", (code, expected) => {
			const state = parseAndExpectOk(code);
			expect(state).toEqual(expected);
		});
	});

	describe('Input', () => {
		it('should mark input as needed when $input is used', () => {
			const state = parseAndExpectOk(`
				$input.item.json.age = 10 + Math.floor(Math.random() * 30);
				$input.item.json.password = $input.item.json.password.split('').map(() => '*').join("")
				delete $input.item.json.lastname
				const emailParts = $input.item.json.email.split("@")
				$input.item.json.emailData = {
					user: emailParts[0],
					domain: emailParts[1]
				}

				return $input.item;
			`);

			expect(state).toEqual(new BuiltInsParserState({ needs$input: true }));
		});

		it('should mark input as needed when $json is used', () => {
			const state = parseAndExpectOk(`
				$json.age = 10 + Math.floor(Math.random() * 30);
				return $json;
				`);

			expect(state).toEqual(new BuiltInsParserState({ needs$input: true }));
		});
	});

	describe('$(...)', () => {
		const cases: Array<[string, BuiltInsParserState]> = [
			[
				'$("nodeName").first()',
				new BuiltInsParserState({ neededNodeNames: new Set(['nodeName']) }),
			],
			[
				'$("nodeName").all(); $("secondNode").matchingItem()',
				new BuiltInsParserState({ neededNodeNames: new Set(['nodeName', 'secondNode']) }),
			],
		];

		test.each(cases)("should identify nodes in '%s'", (code, expected) => {
			const state = parseAndExpectOk(code);
			expect(state).toEqual(expected);
		});

		it('should need all nodes when $() is called with a variable', () => {
			const state = parseAndExpectOk('var n = "name"; $(n)');
			expect(state).toEqual(new BuiltInsParserState({ needsAllNodes: true }));
		});

		it('should require all nodes when there are multiple usages of $() and one is with a variable', () => {
			const state = parseAndExpectOk(`
				$("nodeName");
				$("secondNode");
				var n = "name";
				$(n)
			`);
			expect(state).toEqual(new BuiltInsParserState({ needsAllNodes: true }));
		});

		test.each([
			['without parameters', '$()'],
			['number literal', '$(123)'],
		])('should ignore when $ is called %s', (_, code) => {
			const state = parseAndExpectOk(code);
			expect(state).toEqual(new BuiltInsParserState());
		});

		test.each([
			'$("node").item',
			'$("node")["item"]',
			'$("node")[variable]',
			'var a = $("node")',
			'let a = $("node")',
			'const a = $("node")',
			'a = $("node")',
		])('should require all nodes if %s is used', (code) => {
			const state = parseAndExpectOk(code);
			expect(state).toEqual(new BuiltInsParserState({ needsAllNodes: true }));
		});

		test.each(['$("node").first()', '$("node").last()', '$("node").all()', '$("node").params'])(
			'should require only accessed node if %s is used',
			(code) => {
				const state = parseAndExpectOk(code);
				expect(state).toEqual(
					new BuiltInsParserState({ needsAllNodes: false, neededNodeNames: new Set(['node']) }),
				);
			},
		);
	});

	describe('ECMAScript syntax', () => {
		describe('ES2020', () => {
			it('should parse optional chaining', () => {
				parseAndExpectOk(`
					const a = { b: { c: 1 } };
					return a.b?.c;
				`);
			});

			it('should parse nullish coalescing', () => {
				parseAndExpectOk(`
					const a = null;
					return a ?? 1;
				`);
			});
		});

		describe('ES2021', () => {
			it('should parse numeric separators', () => {
				parseAndExpectOk(`
					const a = 1_000_000;
					return a;
				`);
			});
		});
	});
});
