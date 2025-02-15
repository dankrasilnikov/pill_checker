import pluginJs from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
// eslint-disable-next-line import/no-default-export
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      boundaries,
      import: importPlugin,
    },
    settings: {
      boundaries: {
        defaultElement: 'app',
        alias: {
          $app: './app',
          $shared: './shared',
          $features: './features',
          $entities: './entities',
          $widgets: './widgets',
          $pages: './pages',
        },
      },
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'shared', allow: ['shared'] },
            { from: 'entities', allow: ['shared', 'entities'] },
            { from: 'features', allow: ['shared', 'entities', 'features'] },
            { from: 'widgets', allow: ['shared', 'entities', 'features', 'widgets'] },
            { from: 'pages', allow: ['shared', 'entities', 'features', 'widgets', 'pages'] },
          ],
        },
      ],

      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-require-imports': 'off',
      '@typescript-eslint/no-require-imports': 'off',

      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          'alphabetize': { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-default-export': 'error',
      'import/prefer-default-export': 'off',
      'import/no-relative-parent-imports': 'error',
    },
  },
];
