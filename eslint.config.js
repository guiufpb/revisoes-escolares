module.exports = [
  {
    ignores: [
      'node_modules/**',
      'ambiente_interativo/js/app.bundle.js',
      'ambiente_interativo/screenshots/**',
      'ambiente_interativo/screenshots_mariana_matematica/**',
      'test-results/**',
      'tmp/**',
    ],
  },
  {
    files: [
      'ambiente_interativo/js/app.entry.js',
      'ambiente_interativo/js/pdfjs.entry.js',
      'ambiente_interativo/js/leitor-dedicado.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    files: ['ambiente_interativo/**/*.js'],
    ignores: [
      'ambiente_interativo/js/app.entry.js',
      'ambiente_interativo/js/pdfjs.entry.js',
      'ambiente_interativo/js/leitor-dedicado.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        cancelAnimationFrame: 'readonly',
        console: 'readonly',
        CSS: 'readonly',
        CustomEvent: 'readonly',
        document: 'readonly',
        Image: 'readonly',
        localStorage: 'readonly',
        requestAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        window: 'readonly',
      },
    },
    rules: {
      'no-constant-condition': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        __dirname: 'readonly',
        document: 'readonly',
        DOMException: 'readonly',
        localStorage: 'readonly',
        require: 'readonly',
        Storage: 'readonly',
        window: 'readonly',
      },
    },
    rules: {
      'no-constant-condition': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
