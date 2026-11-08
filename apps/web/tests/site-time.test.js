import test from 'node:test';
import assert from 'node:assert/strict';
import {siteWallTime,siteDateTimeToUtc,atSiteHour} from '../src/office/site-time.js';
test('Ecuador date does not roll forward with UTC midnight',()=>{assert.equal(siteWallTime('2026-11-08T01:00:00Z','America/Guayaquil'),'2026-11-07T20:00:00');assert.equal(atSiteHour('2026-11-08T01:00:00Z','09:15:05.250','America/Guayaquil'),'2026-11-07T14:15:05.250Z');});
test('a second site uses its declared timezone',()=>{assert.equal(siteDateTimeToUtc('2026-11-07T08:00','Europe/Madrid'),'2026-11-07T07:00:00.000Z');});
test('a nonexistent spring civil time is not silently moved',()=>{assert.throws(()=>siteDateTimeToUtc('2026-03-29T02:30','Europe/Madrid'),/no existe/);});
test('an ambiguous fall civil time requires an unambiguous instant',()=>{assert.throws(()=>siteDateTimeToUtc('2026-10-25T02:30','Europe/Madrid'),/ambigua/);});
