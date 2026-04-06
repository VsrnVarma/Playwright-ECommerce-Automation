module.exports = {
  default: {
    require: [
      'src/helpers/CustomWorld.ts', 
      'src/setup/api-hooks.ts',
      'src/step-definitions/api/**/*.ts',
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      '@cucumber/pretty-formatter',
      'json:reports/cucumber-api-report.json',
      'html:reports/cucumber-api-report.html',
    ],
    paths: ['src/features/api/**/*.feature'],
    publishQuiet: true
  },
};