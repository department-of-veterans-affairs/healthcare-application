#!/bin/sh
# For running integration tests in travis.  This should happen any time we merge to staging.

npm run webpack-prod

# Run webpack-prod and start server
HCA_MOCK_API=1 npm start &

# Wait for server to begin accepting connections
# via http://unix.stackexchange.com/questions/5277
while ! echo exit | nc localhost 3000; do sleep 1; done

# Grab list of test environments from nightwatch.js
environments=$(node -e "console.log(require('./test/e2e/nightwatch.js').saucelabs_environments.join())")

./node_modules/nightwatch/bin/nightwatch --config ./test/e2e/nightwatch.js --env $environments
