module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['tsconfig.json', 'tsconfig.dev.json'],
		sourceType: 'module',
	},
	rules: {
		'quote-props': [
			'error',
			'as-needed'
		],
		semi: [
			'error',
			'never'
		],
		quotes: [
			'error',
			'single'
		],
		indent: [
			'error',
			'tab'
		],
		'array-element-newline': ['error', {
			ArrayExpression: 'consistent',
			ArrayPattern: {
				minItems: 3
			}
		}],
		'object-property-newline': ['error', {
			allowAllPropertiesOnSameLine: false
		}],
		'no-multiple-empty-lines': ['error', {
			max: 1,
			maxEOF: 1
		}],
		'object-curly-newline': ['error', 'always']
	}
}
