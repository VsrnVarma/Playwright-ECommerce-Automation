import { Before, After, BeforeAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { mkdirSync } from 'fs';
import { CustomWorld } from '../helpers/CustomWorld';
import { config } from '../../config/config';

setDefaultTimeout(config.defaultTimeout);

BeforeAll(async function () {
  try {
    mkdirSync('reports', { recursive: true });
  } catch {}
});

Before(async function (this: CustomWorld, scenario) {
  this.scenarioName = scenario.pickle.name;
  console.log(`\n[API] Starting: "${this.scenarioName}"`);
  await this.initApiClient();
});

After(async function (this: CustomWorld, scenario) {
  const failed = scenario.result?.status === Status.FAILED;
  if (failed) {
    console.error(`\n[API] FAILED: "${this.scenarioName}"`);
    if (this.apiResponse) {
      await this.attach(JSON.stringify(this.apiResponse, null, 2), 'text/plain');
    }
  } else {
    console.log(`\n[API] PASSED: "${this.scenarioName}"`);
  }
  await this.disposeApiClient();
});
