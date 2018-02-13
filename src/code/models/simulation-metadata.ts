import { types } from "mobx-state-tree";

export const SimulationMetadata = types
  .model('SimulationMetadata', {
    launchOrigin: types.maybe(types.string),
    classId: types.maybe(types.string),
    offeringId: types.maybe(types.string),
    offeringUrl: types.maybe(types.string),
    activityName: types.maybe(types.string),
    activityUrl: types.maybe(types.string),
    launchTime: types.maybe(types.string),
    utcLaunchTime: types.maybe(types.string)
  });
export type ISimulationMetadata = typeof SimulationMetadata.Type;
export type ISimulationMetadataSnapshot = typeof SimulationMetadata.SnapshotType;

// Temporary for use in getting metadata from main.tsx to Simulation.create()
export let gSimulationMetadata = {};
export function captureSimulationMetadata(metadata: ISimulationMetadataSnapshot) {
  gSimulationMetadata = metadata;
}
