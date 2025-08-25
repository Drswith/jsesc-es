import { assert,  test } from 'vitest'
import jsesc from '../src';

test('advanced tests', () =>{
	let allSymbols = '';
	// Generate strings based on code points. Trickier than it seems:
	// https://mathiasbynens.be/notes/javascript-encoding
	for (let codePoint = 0x000000; codePoint <= 0x10FFFF; codePoint += 0xF) {
		const symbol = String.fromCodePoint(codePoint);
		// ok(
		// 	eval('\'' + jsesc(symbol) + '\'') == symbol,
		// 	'U+' + codePoint.toString(16).toUpperCase()
		// );
		allSymbols += symbol + ' ';
	}
	assert.ok(
		eval('\'' + jsesc(allSymbols) + '\'') == allSymbols,
		'All Unicode symbols, space-separated, default quote type (single quotes)'
	);
	assert.ok(
		eval('\'' + jsesc(allSymbols, {
			'quotes': 'single'
		}) + '\'') == allSymbols,
		'All Unicode symbols, space-separated, single quotes'
	);
	assert.ok(
		eval('`' + jsesc(allSymbols, {
			'quotes': 'backtick'
		}) + '`') == allSymbols,
		'All Unicode symbols, space-separated, template literal'
	);
	assert.ok(
		eval(jsesc(allSymbols, {
			'quotes': 'single',
			'wrap': true
		})) == allSymbols,
		'All Unicode symbols, space-separated, single quotes, auto-wrap'
	);
	assert.ok(
		eval('"' + jsesc(allSymbols, {
			'quotes': 'double'
		}) + '"') == allSymbols,
		'All Unicode symbols, space-separated, double quotes'
	);
	assert.ok(
		eval(jsesc(allSymbols, {
			'quotes': 'double',
			'wrap': true
		})) == allSymbols,
		'All Unicode symbols, space-separated, double quotes, auto-wrap'
	);

	// Some of these depend on `JSON.parse()`, so only test them in Node
	const testArray = [
		undefined, Infinity, new Number(Infinity), -Infinity,
		new Number(-Infinity), 0, new Number(0), -0, new Number(-0), +0,
		new Number(+0), 'str', function zomg() { return 'desu'; }, null,
		true, new Boolean(true), false, new Boolean(false), {
			"foo": 42, "hah": [ 1, 2, 3, { "foo" : 42 } ]
		}
	];
	assert.equal(
		jsesc(testArray, {
			'json': false
		}),
		'[undefined,Infinity,Infinity,-Infinity,-Infinity,0,0,0,0,0,0,\'str\',function zomg() { return \'desu\'; },null,true,true,false,false,{\'foo\':42,\'hah\':[1,2,3,{\'foo\':42}]}]',
		'Escaping a non-flat array with all kinds of values'
	);
	assert.equal(
		jsesc(testArray, {
			'json': true
		}),
		'[null,null,null,null,null,0,0,0,0,0,0,"str",null,null,true,true,false,false,{"foo":42,"hah":[1,2,3,{"foo":42}]}]',
		'Escaping a non-flat array with all kinds of values, with `json: true`'
	);
	assert.equal(
		jsesc(testArray, {
			'json': true,
			'compact': false
		}),
		'[\n\tnull,\n\tnull,\n\tnull,\n\tnull,\n\tnull,\n\t0,\n\t0,\n\t0,\n\t0,\n\t0,\n\t0,\n\t"str",\n\tnull,\n\tnull,\n\ttrue,\n\ttrue,\n\tfalse,\n\tfalse,\n\t{\n\t\t"foo": 42,\n\t\t"hah": [\n\t\t\t1,\n\t\t\t2,\n\t\t\t3,\n\t\t\t{\n\t\t\t\t"foo": 42\n\t\t\t}\n\t\t]\n\t}\n]',
		'Escaping a non-flat array with all kinds of values, with `json: true, compact: false`'
	);
});