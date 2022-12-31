export type CORS = {
  origin: string[],
  methods?: string[],
  allowedHeaders?: string[],
  credentials?: Boolean, 
  ExposeHeaders?: string[],
}

export type SocketConfig = {
  cors: CORS
}

export type ServerError = { 
  log: String,
  status: number,
  message: Message,
}

export type Message = {
  err: String
}

export type Results = { metric: {}, values: (Values[] | HistogramValues[] | PieValues[])}[]

export type Values = [number, String]

export type HistogramValues = [String, unknown]

export type PieValues = [number, String]