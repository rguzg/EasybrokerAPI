import { describe, expect, test, beforeAll } from '@jest/globals';
import EasyBrokerAPI from '../dist/EasyBrokerAPI';
import { SerializeStatusOptions } from '../dist/OptionsSerializers';
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
      await eb.getPropertyList(1, 50);
    } catch (e) {
      expect(e.error).toBe('Your API key is invalid');
    }
  });

  test('Correct API Key returns valid response', async () => {
    let eb = new EasyBrokerAPI(process.env.APIKEY);
    let response = await eb.getPropertyList();

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
      await eb.getPropertyList(1, 50);
    } catch (e) {
      expect(e).toBe('Limit cannot be greater than 50');
    }
  });

  test('Page number zero returns first page results', async () => {
    let response = await eb.getPropertyList(0, 1);
    expect(response.pagination.page).toBe(1);
  });

  test('Non-existant page returns no results', async () => {
    let response = await eb.getPropertyList(900, 1);
    expect(response.content.length).toBe(0);
  });

  test('Valid page and limit returns correct results', async () => {
    let response = await eb.getPropertyList(1, 1);
    expect(response.content.length).toBe(1);
  });

  test('Adding status search options produces the correct next_page URL', async () => {
    let response = await eb.getPropertyList(1, 1, {
      status: new Set(['published', 'not_published']),
    });

    expect(response.pagination.next_page).toBe(
      'https://api.stagingeb.com/v1/properties?limit=1&page=2&search%5Bstatuses%5D%5B%5D=published&search%5Bstatuses%5D%5B%5D=not_published'
    );
  });

  test('Invalid status search options are ignored', async () => {
    let response = await eb.getPropertyList(1, 1, {
      invalid_option: new Set(['published', 'not_published']),
    });

    expect(response.pagination.next_page).toBe(
      'https://api.stagingeb.com/v1/properties?limit=1&page=2'
    );
  });

  test('Empty status search options are ignored', async () => {
    let response = await eb.getPropertyList(1, 1, {
      status: undefined,
    });

    expect(response.pagination.next_page).toBe(
      'https://api.stagingeb.com/v1/properties?limit=1&page=2'
    );
  });
});

describe('Status Option Serializer Tests', () => {
  test('Valid status options are serialized correctly', () => {
    expect(
      SerializeStatusOptions(new Set(['published', 'not_published']))
    ).toBe('search[statuses][]=published&search[statuses][]=not_published');
  });
});