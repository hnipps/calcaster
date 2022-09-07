export type Time = {
  datetime: string;
  timezone: string;
};

export type EventData = {
  start?: Time;
  end?: Time;
};

export type Event = {
  data: EventData;
  merkleRoot: string;
  signature: string;
};
