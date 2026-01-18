import eslintJS from '@eslint/js'
import typescriptParser from '@typescript-eslint/parser'
import { globalIgnores } from 'eslint/config'
import pluginEslintImport from 'eslint-plugin-import'
import pluginEslintJest from 'eslint-plugin-jest'
import pluginEslintPrettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import pluginEslintTypescript from 'typescript-eslint'

export default [
  globalIgnores(['dist', 'build', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
  },
  eslintJS.configs.recommended,
  ...pluginEslintTypescript.configs.strict,
  pluginEslintImport.configs.typescript,
  pluginEslintJest.configs['flat/recommended'],
  pluginEslintPrettier,
  {
    plugins: {
      import: pluginEslintImport,
    },
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2020,
      globals: globals.node,
      sourceType: 'module',
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: [2, 'never'],
      curly: 'warn',
      eqeqeq: 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-throw-literal': 'warn',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
          ignoreCase: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
]
