import { describe, expect, test, beforeAll } from '@jest/globals';
import EasyBrokerAPI from '../EasyBrokerAPI';
import dotenv from 'dotenv';
dotenv.config();

describe('API Key Tests', () => {
  test('Empty API key throws error', () => {
    expect(() => {
      new EasyBrokerAPI('');
    }).toThrow('No API key provided');
  });

  test('Incorrect API Key returns invalid response', async () => {
    try {
      let eb = new EasyBrokerAPI('NON_EXISTANT_API_KEY');
      await eb.getProperties(1, 50);
    } catch (e) {
      expect(e.error).toBe('Your API key is invalid');
    }
  });

  test('Correct API Key returns valid response', async () => {
    let eb = new EasyBrokerAPI(process.env.APIKEY);
    let response = await eb.getProperties();

    expect(response.content).toBeDefined();
  });
});

describe('Property Tests', () => {
  let eb;

  beforeAll(() => {
    eb = new EasyBrokerAPI(process.env.APIKEY);
  });

  test('Limit cannot be greater than 50', async () => {
    try {
      await eb.getProperties(1, 50);
    } catch (e) {
      expect(e).toBe('Limit cannot be greater than 50');
    }
  });

  test('Page number zero returns first page results', async () => {
    let response = await eb.getProperties(0, 1);
    expect(response.pagination.page).toBe(1);
  });

  test('Non-existant page returns no results', async () => {
    let response = await eb.getProperties(900, 1);
    expect(response.content.length).toBe(0);
  });

  test('Valid page and limit returns correct results', async () => {
    let response = await eb.getProperties(1, 1);
    expect(response.content.length).toBe(1);
  });
});
