module.exports = {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          {
            breaking: true,
            release: 'major'
          },
          {
            type: 'feat',
            release: 'minor'
          },
          {
            type: '*',
            release: 'patch'
          },
          {
            scope: 'no-release',
            release: false
          }
        ]
      }
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        // eslint-disable-next-line no-template-curly-in-string
        message: 'build: ${nextRelease.version} [skip ci]'
      }
    ]
  ]
}
