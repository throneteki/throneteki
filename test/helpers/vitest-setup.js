import { install as installTestContext } from './test-context.js';
import { install as installMatchers } from './matchers.js';
import { install as installIntegration } from './integrationhelper.js';

installTestContext();
installMatchers();
installIntegration();
