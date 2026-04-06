
module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: [
            'src/helpers/CustomWorld.ts', 
            'src/setup/hooks.ts',
            'src/step-definitions/**/*.steps.ts',
        ],
        format: [   
            'progress-bar',
            '@cucumber/pretty-formatter',
            'json:reports/cucumber-report.json',
            'html:reports/cucumber-report.html'
        ],
        paths: ['src/features/ui/**/*.feature'],
        tags: 'not @skip',
        publishQuiet: true,
    }   
}