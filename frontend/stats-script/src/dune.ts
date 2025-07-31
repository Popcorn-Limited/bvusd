import axios from "axios";

export interface DuneResponse<Row = unknown> {
  result: { rows: Row[] };
}

const MAX_RESULTS = 1000;

export const isDuneResponse = (data: unknown): data is DuneResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "result" in data &&
    typeof data.result === "object" &&
    data.result !== null &&
    "rows" in data.result &&
    Array.isArray(data.result.rows)
  );
};

export const duneFetch = async <T extends DuneResponse>({
  apiKey,
  id,
  maxResults,
  validate,
}: {
  apiKey: string;
  id: string;
  maxResults: string;
  validate: (data: unknown) => data is T;
}): Promise<T> => {
  const url = `https://api.dune.com/api/v1/query/${id}/results?limit=${maxResults}`;

  const response = await fetch(url, {
    headers: { "X-Dune-API-Key": apiKey }
  });
  const data = await response.json();

  // console.log(
  //   `Dune response for ${url}:`,
  //   util.inspect(data, { colors: true, depth: null })
  // );

  if (!validate(data)) {
    throw new Error("Dune query returned unexpected response");
  }

  return data;
};

export const duneExecuteFetch = async <T extends DuneResponse>({
  apiKey,
  id,
  maxResults,
  validate,
}: {
  apiKey: string;
  id: string;
  maxResults: string;
  validate: (data: unknown) => data is T;
}): Promise<T> => {
  try {
    const url = `https://api.dune.com/api/v1/query/${id}/execute`;

    const execRes = await axios.post(
      url,
      {},
      {
        headers: {
          "x-dune-api-key": apiKey,
        },
      }
    );

    const executionId = execRes.data.execution_id;
    console.log(`Submitted Query. Execution ID: ${executionId}`);

    let status = "QUERY_STATE_PENDING";
    while (
      status === "QUERY_STATE_PENDING" ||
      status === "QUERY_STATE_EXECUTING"
    ) {
      const statusRes = await axios.get(
        `https://api.dune.com/api/v1/execution/${executionId}/status`,
        {
          headers: {
            "x-dune-api-key": apiKey,
          },
        }
      );

      status = statusRes.data.state;
      console.log(`Query Status: ${status}`);
      if (status === "QUERY_STATE_FAILED") throw new Error("Query failed");

      await new Promise((r) => setTimeout(r, 5000));
    }

    const data = await duneFetch({ apiKey, id, maxResults, validate });

    return data;
  } catch (err) {
    console.log(err);
  }
};
