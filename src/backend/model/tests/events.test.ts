import axios from 'axios';
import { loadNewsFeedData } from '../events';
import type { newsFeedDataInterface } from '../interfaces';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('loadNewsFeedData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('correctly maps event data with video URL', async () => {
    const mockData = {
      data: {
        results: [
          {
            description: 'Test description',
            date: '2024-07-01',
            name: 'Test Event',
            type: { name: 'Test Type' },
            vid_urls: ['https://youtube.com/test'],
            info_urls: [],
            image: { image_url: 'https://image.com/test.jpg' }
          }
        ]
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockData);

    const result = await loadNewsFeedData();
    expect(result).toHaveLength(1);

    const event: newsFeedDataInterface = result![0];
    expect(event.bodyText).toBe('Test description');
    expect(event.date).toBe('2024-07-01');
    expect(event.headline).toBe('Test Event');
    expect(event.eventType).toBe('Test Type');
    expect(event.sourceURL).toBe('https://youtube.com/test');
    expect(event.imageURL).toBe('https://image.com/test.jpg');
  });

  test('falls back to info URL when video URL is missing', async () => {
    const mockData = {
      data: {
        results: [
          {
            description: 'No video URL',
            date: '2024-07-02',
            name: 'Fallback Event',
            type: { name: 'Type 2' },
            vid_urls: [],
            info_urls: ['https://info.com/fallback'],
            image: { image_url: 'https://img.com/2.jpg' }
          }
        ]
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockData);

    const result = await loadNewsFeedData();
    expect(result![0].sourceURL).toBe('https://info.com/fallback');
  });

  test('sets sourceURL to null when both URLs are missing', async () => {
    const mockData = {
      data: {
        results: [
          {
            description: 'No URLs',
            date: '2024-07-03',
            name: 'Null Event',
            type: { name: 'Type 3' },
            vid_urls: [],
            info_urls: [],
            image: { image_url: 'https://img.com/3.jpg' }
          }
        ]
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockData);

    const result = await loadNewsFeedData();
    expect(result![0].sourceURL).toBeNull();
  });

  test('handles API failure gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API failure'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await loadNewsFeedData();
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching events', expect.any(Error));

    consoleSpy.mockRestore();
  });
});