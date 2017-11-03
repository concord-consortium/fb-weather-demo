import { Grid } from "../models/grid";

describe("Testing Grid Class", () => {
  let grid = Grid.create();
  test("construction", () => {
    expect(grid).toMatchObject({
      columns:7,
      rows:7,
      id:expect.stringMatching(/[a-z|0-9]+/),
      gridCells:expect.arrayContaining([])
    });
  });
  test("Adding the grid cells", () => {
    grid.createCells();
    expect(grid.gridCells.length).toBe(49);
  });
  test("finding a station at row, column", () => {
    grid.createCells();
    let station = grid.stationAt(0,0);
    expect(station.lat).toBe(0.5);
    expect(station.long).toBe(0.5);
    station = grid.stationAt(1,1);
    expect(station.lat).toBe(1.5);
    expect(station.long).toBe(1.5);
  });
});