// Copyright (c) 2023 Cloudflare, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

// @ts-ignore
import * as assert from "node:assert";
import { KnownModel, DistanceMetric } from "cloudflare:vectorize";

/**
 * @typedef {{'vector-search': VectorizeIndex}} Env
 *
 */

export const test_vector_search_vector_query = {
  /**
   * @param {unknown} ctr
   * @param {Env} env
   */
  async test(ctr, env) {
    const IDX = env["vector-search"];
    {
      // with returnVectors = true
      const results = await IDX.query(new Float32Array(new Array(5).fill(0)), {
        topK: 3,
        returnVectors: true,
      });
      assert.equal(true, results.count > 0);
      /** @type {VectorizeMatches}  */
      const expected = {
        matches: [
          {
            vectorId: "b0daca4a-ffd8-4865-926b-e24800af2a2d",
            score: 0.71151,
            vector: {
              id: "b0daca4a-ffd8-4865-926b-e24800af2a2d",
              values: [0.2331, 1.0125, 0.6131, 0.9421, 0.9661, 0.8121],
              metadata: { text: "She sells seashells by the seashore" },
            },
          },
          {
            vectorId: "a44706aa-a366-48bc-8cc1-3feffd87d548",
            score: 0.68913,
            vector: {
              id: "a44706aa-a366-48bc-8cc1-3feffd87d548",
              values: [0.2321, 0.8121, 0.6315, 0.6151, 0.4121, 0.1512],
              metadata: {
                text: "Peter Piper picked a peck of pickled peppers",
              },
            },
          },
          {
            vectorId: "43cfcb31-07e2-411f-8bf9-f82a95ba8b96",
            score: 0.94812,
            vector: {
              id: "43cfcb31-07e2-411f-8bf9-f82a95ba8b96",
              values: [0.0515, 0.7512, 0.8612, 0.2153, 0.15121, 0.6812],
              metadata: {
                text: "You know New York, you need New York, you know you need unique New York",
              },
            },
          },
        ],
        count: 3,
      };
      assert.deepStrictEqual(results, expected);
    }
    {
      // with returnVectors unset (false)
      const results = await IDX.query(new Float32Array(new Array(5).fill(0)), {
        topK: 3,
      });
      assert.equal(true, results.count > 0);
      /** @type {VectorizeMatches}  */
      const expected = {
        matches: [
          {
            vectorId: "b0daca4a-ffd8-4865-926b-e24800af2a2d",
            score: 0.71151,
          },
          {
            vectorId: "a44706aa-a366-48bc-8cc1-3feffd87d548",
            score: 0.68913,
          },
          {
            vectorId: "43cfcb31-07e2-411f-8bf9-f82a95ba8b96",
            score: 0.94812,
          },
        ],
        count: 3,
      };
      assert.deepStrictEqual(results, expected);
    }
  },
};

export const test_vector_search_vector_insert = {
  /**
   * @param {unknown} ctr
   * @param {Env} env
   */
  async test(ctr, env) {
    const IDX = env["vector-search"];
    {
      /** @type {Array<VectorizeVector>}  */
      const newVectors = [
        {
          id: "15cc795d-93d3-416d-9a2a-36fa6fac73da",
          values: new Float32Array(),
          metadata: { text: "He threw three free throws" },
        },
        {
          id: "15cc795d-93d3-416d-9a2a-36fa6fac73da",
          values: new Float32Array(),
          metadata: { text: "Which witch is which?" },
        },
      ];
      const results = await IDX.insert(newVectors);
      assert.equal(results.count, 5);
    }
  },
};

export const test_vector_search_vector_upsert = {
  /**
   * @param {unknown} ctr
   * @param {Env} env
   */
  async test(ctr, env) {
    const IDX = env["vector-search"];
    {
      /** @type {Array<VectorizeVector>}  */
      const newVectors = [
        {
          id: "15cc795d-93d3-416d-9a2a-36fa6fac73da",
          values: new Float32Array(),
          metadata: { text: "He threw three free throws" },
        },
        {
          id: "15cc795d-93d3-416d-9a2a-36fa6fac73da",
          values: [0.3611, 0.9481, 0.8121, 0.7121, 0.8121, 0.0512],
          metadata: { text: "Which witch is which?" },
        },
      ];
      const results = await IDX.upsert(newVectors);
      assert.equal(results.count, 4);
    }
  },
};

export const test_vector_search_vector_delete_ids = {
  /**
   * @param {unknown} ctr
   * @param {Env} env
   */
  async test(ctr, env) {
    const IDX = env["vector-search"];
    {
      const results = await IDX.deleteByIds([
        "vector-a",
        "vector-b",
        "vector-c",
      ]);
      assert.deepStrictEqual(results, {
        ids: ["vector-a", "vector-b", "vector-c"],
        count: 3,
      });
    }
  },
};

export const test_vector_search_vector_get_ids = {
  /**
   * @param {unknown} ctr
   * @param {Env} env
   */
  async test(ctr, env) {
    const IDX = env["vector-search"];
    {
      const results = await IDX.getByIds([
        "b0daca4a-ffd8-4865-926b-e24800af2a2d",
        "43cfcb31-07e2-411f-8bf9-f82a95ba8b96",
      ]);
      assert.deepStrictEqual(results, [
        {
          id: "b0daca4a-ffd8-4865-926b-e24800af2a2d",
          values: [0.2331, 1.0125, 0.6131, 0.9421, 0.9661, 0.8121],
          metadata: { text: "She sells seashells by the seashore" },
        },
        {
          id: "43cfcb31-07e2-411f-8bf9-f82a95ba8b96",
          values: [0.0515, 0.7512, 0.8612, 0.2153, 0.15121, 0.6812],
          metadata: {
            text: "You know New York, you need New York, you know you need unique New York",
          },
        },
      ]);
    }
  },
};

export const test_vector_search_can_use_enum_exports = {
  async test() {
    assert.equal(
      KnownModel["openapi-text-embedding-ada-002"],
      "openapi-text-embedding-ada-002"
    );
    assert.equal(DistanceMetric.COSINE, "cosine");
  },
};
