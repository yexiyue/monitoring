import {injectJsError} from './lib/jsErroe'
import {injectXHR} from './lib/xhr'
import {injectBlankScreen} from './lib/blinkScreen'
import { injectTiming } from './lib/timing';
injectJsError();
injectXHR();
injectBlankScreen();
injectTiming();