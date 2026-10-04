import test from 'node:test';import assert from 'node:assert/strict';import { analyze } from '../src/index.js';
test('summarizes skew per source',()=>{const r=analyze([{source:'a',sourceTime:0,receivedTime:100},{source:'a',sourceTime:1000,receivedTime:1200}]);assert.equal(r.entities[0].medianMs,100);assert.equal(r.entities[0].driftMs,100)});
test('detects clock jumps',()=>assert.equal(analyze([{source:'a',sourceTime:0,receivedTime:0},{source:'a',sourceTime:1,receivedTime:2001}],{jumpMs:100}).jumpCount,1));
test('counts future source timestamps',()=>assert.equal(analyze([{source:'a',sourceTime:100,receivedTime:0}]).entities[0].futureCount,1));
test('reports invalid records',()=>assert.equal(analyze([{source:'a'}]).invalid.length,1));
