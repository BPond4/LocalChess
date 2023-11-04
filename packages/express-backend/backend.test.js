import mut from './module.js';

test('Testing sum--success', () => {
	const expected = 30;
	const got = mut.sum(12, 18);
	expect(got).toBe(expected);
})

test('Testing division (4/2)==2.0', ()=>{
	const got = mut.div(4,2);
	expect(got).toEqual(2.0);
})

test('Testing division (4/2)==2', ()=>{
	const got = mut.div(4,2);
	expect(got).toEqual(2);
})

test('Testing division (5/2)==2.5', () => {
	const got = mut.div(5,2);
	expect(got).toEqual(2.5);
})

test('Testing div (2/0)==Infinity', () => {
	const got = mut.div(2, 0);
	expect(got).toEqual(Infinity);
})

test('Testing div (-2/0)==-Infinity', () => {
	const got = mut.div(-2, 0);
	expect(got).toEqual(-Infinity);
})

test('Testing containsNumbers Empty Text', () => {
	const got = mut.containsNumbers("");
	expect(got).toBe(false);
})

test('Testing containsNumbers abcdefghijklmnopqrstuvwxyz`~-+=[]{}', () => {
	const got = mut.containsNumbers("abcdefghijklmnopqrstuvwxyz`~-+=[]{}");
	expect(got).toBe(false);
})

test('Testing containsNumbers abcd0', () => {
	const got = mut.containsNumbers("abcd0");
	expect(got).toBe(true);
})

test('Testing containsNumbers \n     \t', () => {
	const got = mut.containsNumbers("\n     \t");
	expect(got).toBe(false);
})