import { FlatCompat } from '@eslint/eslintrc';
import sapphireEslintConfig from '@sapphire/eslint-config';

// @sapphire/eslint-config only ships an eslintrc config, written for ESLint 8 and typescript-eslint 7
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

// Rules since removed, mapped to their replacement, or dropped when Sapphire turns them off
const removedRules = {
	'@typescript-eslint/no-throw-literal': '@typescript-eslint/only-throw-error',
	'require-jsdoc': null,
	'valid-jsdoc': null
};

const rules = Object.fromEntries(
	Object.entries(sapphireEslintConfig.rules).flatMap(([name, value]) => {
		if (!(name in removedRules)) return [[name, value]];
		return removedRules[name] === null ? [] : [[removedRules[name], value]];
	})
);

export default [
	{ ignores: ['node_modules/', 'dist/'] },
	...compat.config({
		...sapphireEslintConfig,
		parserOptions: { ...sapphireEslintConfig.parserOptions, tsconfigRootDir: import.meta.dirname },
		rules
	})
];
