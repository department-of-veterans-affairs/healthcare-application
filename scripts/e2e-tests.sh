#!/bin/bash
# For running integration tests in travis.  This should happen any time we merge to staging.
npm run webpack-prod &&
npm run serve &
sleep 5;
nightwatch --config test/e2e/nightwatch.js --env travis
