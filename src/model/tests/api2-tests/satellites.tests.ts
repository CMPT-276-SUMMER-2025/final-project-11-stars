import * as satellites from '../../satellites.ts';
import type { satellitePositionInterface } from '../../interfaces.ts';

describe('satellites.ts', () => {
  test('parseRawTLEStringIntoTLEObjectArray correctly parses TLE strings', () => {
    const satellites_RawString = 
`ATLAS CENTAUR 2         
1 00694U 63047A   25217.55738761  .00001129  00000+0  12677-3 0  9996
2 00694  30.3573 322.4594 0552238 337.1556  20.5333 14.10943170101060
THOR AGENA D R/B        
1 00733U 64002A   25217.49128190  .00000202  00000+0  89688-4 0  9992
2 00733  99.1167 214.1200 0033186 166.0690 194.1416 14.33846936207313`;

    const expected = [
      {
        name: 'ATLAS CENTAUR 2',
        line1: '1 00694U 63047A   25217.55738761  .00001129  00000+0  12677-3 0  9996',
        line2: '2 00694  30.3573 322.4594 0552238 337.1556  20.5333 14.10943170101060',
      },
      {
        name: 'THOR AGENA D R/B',
        line1: '1 00733U 64002A   25217.49128190  .00000202  00000+0  89688-4 0  9992',
        line2: '2 00733  99.1167 214.1200 0033186 166.0690 194.1416 14.33846936207313',
      }
    ];

    const result = satellites.parseRawTLEStringIntoTLEObjectArray(satellites_RawString);
    expect(result).toHaveLength(expected.length);

    for (let i = 0; i < expected.length; i++) {
      expect(result[i].name).toBe(expected[i].name);
      expect(result[i].line1).toBe(expected[i].line1);
      expect(result[i].line2).toBe(expected[i].line2);
    }
  });

  test('deduplicateSatelliteNamesAndIDs returns correct number of satellites with unique names', () => {
    const testSatellites: satellitePositionInterface[] = [
      { name: "Starlink", id: "sl", alt: 0, lng: 0, lat: 0 },
      { name: "Starlink", id: "sl", alt: 0, lng: 0, lat: 0 },
      { name: "Galileo", id: "gal", alt: 0, lng: 0, lat: 0 },
      { name: "Starlink", id: "sl", alt: 0, lng: 0, lat: 0 },
    ];

    const expectedNames = ["Starlink", "Starlink (1)", "Starlink (2)", "Galileo"];

    const result = satellites.deduplicateSatelliteNamesAndIDs(testSatellites);

    expect(result).toHaveLength(4);
    for (const expectedName of expectedNames) {
      expect(result.find(sat => sat.name === expectedName)).toBeDefined();
    }
  });

  test('getSatellitePositionAtTime returns null for invalid TLEs and times', () => {
    const invalidTLE1 = "INVALID";
    const invalidTLE2 = "INVALID";
    const invalidTime = new Date("bad-date");

    expect(satellites.getSatellitePositionAtTime(invalidTLE1, invalidTLE2, new Date("2024-11-02T12:00:00Z"))).toBeNull();
    expect(satellites.getSatellitePositionAtTime(
      "1 00733U 64002A   25217.49128190  .00000202  00000+0  89688-4 0  9992",
      "2 00733  99.1167 214.1200 0033186 166.0690 194.1416 14.33846936207313",
      invalidTime
    )).toBeNull();
  });

  test('getSatellitePositionAtTime returns valid data for good TLE and time', () => {
    const tle1 = "1 00733U 64002A   25217.49128190  .00000202  00000+0  89688-4 0  9992";
    const tle2 = "2 00733  99.1167 214.1200 0033186 166.0690 194.1416 14.33846936207313";
    const time = new Date("2024-11-02T12:00:00Z");

    const result = satellites.getSatellitePositionAtTime(tle1, tle2, time);
    expect(result).not.toBeNull();
    expect(typeof result?.lat).toBe("number");
    expect(typeof result?.lng).toBe("number");
    expect(typeof result?.alt).toBe("number");
  });
});
