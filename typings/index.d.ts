export type AmqpConnectionConfig = {
  port: number;
  host: string;
};

export type ProbeService = {
  name: string;
  probe: () => Promise<void>
};