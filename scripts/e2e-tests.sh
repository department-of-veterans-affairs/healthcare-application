#!/bin/bash
# For running integration tests in travis.  This should happen any time we merge to staging.
npm run webpack-prod;
ln -sf generated/prod generated/dev; # TODO(alexose): find a better workaround 
npm run serve &
sleep 3;
nightwatch --config test/e2e/nightwatch.js --env travis
