import { giveTypeMaps } from "./typeMapProvider";
import giveRandomResponse from "./randomMockDataGenerator";
import { buildSchema, parse } from "graphql";
import { getQueryEndpoint, getSchema } from "./chromeStorageOptions";

export const fastRandomize = async (id: string): Promise<any> => {
  const queryEndpoint = await getQueryEndpoint(id);
  if (queryEndpoint !== undefined) {
    const [query, endpointHost, endpointPath] = queryEndpoint.split("__");
    const schemaString = await getSchema(endpointHost, endpointPath);
    if (schemaString !== undefined) {
      const [fieldTypes, enumTypes, unionTypes, interfaceTypes] =
        await giveTypeMaps(buildSchema(schemaString).getTypeMap());
      const dataSet = {
        stringLength: 8,
        arrayLength: 4,
        isSpecialAllowed: true,
        booleanValues: "RANDOM",
        numRangeEnd: 1000,
        numRangeStart: 1,
        digitsAfterDecimal: 2,
      };

      try {
        return {
          data: giveRandomResponse(
            parse(query),
            fieldTypes,
            enumTypes,
            unionTypes,
            interfaceTypes,
            dataSet
          ),
          message: "SUCCESS",
        };
      } catch {
        return { data: {}, message: "ERROR_GENERATING_RANDOM_RESPONSE" };
      }
    }
  }
  return undefined;
};
