import { ISerializable } from '../../core/serialization/iserializable';

export class PerformanceStatsModel implements ISerializable<PerformanceStatsModel> {
  user: string;
  state1: number;
  state2: number;
  state3: number;
  state4: number;
  state5: number;
  state6: number;

  deserialize(input: any): PerformanceStatsModel {
    Object.assign(this, input);
    return this;
  }
}
