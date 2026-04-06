import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
    baseUrl: process.env.BASE_URL || '',
    apiBaseUrl: process.env.API_BASE_URL || '',

    // Authentication
    testUserEmail: process.env.TEST_USER_EMAIL || '',
    testUserPassword: process.env.TEST_USER_PASSWORD || '',
    testUserName: process.env.TEST_USER_NAME || '',

    // Browser
    browser: (process.env.BROWSER || 'chromium') as 'chromium' | 'firefox' | 'webkit',
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO || '0', 10),
    viewportWidth: parseInt(process.env.VIEWPORT_WIDTH || '1280', 10),
    viewportHeight: parseInt(process.env.VIEWPORT_HEIGHT || '720', 10),

    // Artifacts
    screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
    videoOnFailure: process.env.VIDEO_ON_FAILURE === 'true',
    traceOnFailure: process.env.TRACE_ON_FAILURE !== 'false',

    maxRetries: parseInt(process.env.MAX_RETRIES || '2', 10),
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000', 10),
    expectTimeout: parseInt(process.env.EXPECT_TIMEOUT || '10000', 10),

};

export const API_ENDPOINTS = {
  productsList: '/productsList',
  brandsList: '/brandsList',
  searchProduct: '/searchProduct',
  verifyLogin: '/verifyLogin',
  createAccount: '/createAccount',
  deleteAccount: '/deleteAccount',
  updateAccount: '/updateAccount',
  getUserDetail: '/getUserDetailByEmail',
};
