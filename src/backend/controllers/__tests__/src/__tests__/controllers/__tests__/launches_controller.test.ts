import {
  loadLaunchesOverTimePeriod,
  getLaunches,
  getLaunch,
} from "../launches_controller";

import * as model from "../../model/launches";

jest.mock("../../model/launches");

describe("launches_controller.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadLaunchesOverTimePeriod", () => {
    it("calls model.loadLaunchesOverTime with correct arguments", async () => {
      const mockLaunches = [{ id: "1" }, { id: "2" }];
      (model.loadLaunchesOverTime as jest.Mock).mockResolvedValue(mockLaunches);

      const startDate = "2023-01-01";
      const endDate = "2023-12-31";
      const result = await loadLaunchesOverTimePeriod(startDate, endDate);

      expect(model.loadLaunchesOverTime).toHaveBeenCalledWith(startDate, endDate);
      expect(result).toEqual(mockLaunches);
    });

    it("returns an empty array if model returns nothing", async () => {
      (model.loadLaunchesOverTime as jest.Mock).mockResolvedValue(undefined);

      const result = await loadLaunchesOverTimePeriod("2023-01-01", "2023-12-31");
      expect(result).toBeUndefined();
    });
  });

  describe("getLaunches", () => {
    it("calls getLaunchesAsList and returns result", () => {
      const mockList = [{ id: "A" }, { id: "B" }];
      (model.getLaunchesAsList as jest.Mock).mockReturnValue(mockList);

      const result = getLaunches();
      expect(model.getLaunchesAsList).toHaveBeenCalled();
      expect(result).toEqual(mockList);
    });

    it("returns empty array when model returns empty array", () => {
      (model.getLaunchesAsList as jest.Mock).mockReturnValue([]);

      const result = getLaunches();
      expect(result).toEqual([]);
    });
  });

  describe("getLaunch", () => {
    it("calls getLaunchById with correct id and returns launch", () => {
      const mockLaunch = { id: "abc123", name: "Test Launch" };
      (model.getLaunchById as jest.Mock).mockReturnValue(mockLaunch);

      const result = getLaunch("abc123");

      expect(model.getLaunchById).toHaveBeenCalledWith("abc123");
      expect(result).toEqual(mockLaunch);
    });

    it("returns null if launch is not found", () => {
      (model.getLaunchById as jest.Mock).mockReturnValue(null);

      const result = getLaunch("nonexistent");
      expect(result).toBeNull();
    });
  });
});
