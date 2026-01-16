import { type FunctionReference, type AnyApi } from "convex/server";
import type * as deals from "../deals.js";
import type * as documents from "../documents.js";
import type * as kanban from "../kanban.js";
import type * as presence from "../presence.js";
import type * as propertyDefinitions from "../propertyDefinitions.js";
import type * as versions from "../versions.js";
import type * as presentations from "../presentations.js";
import type * as presentations_generate from "../../app/actions/presentation/generate.js";

/**
 * A type describing your app's public Convex API.
 *
 * This `API` type includes information about the arguments and return
 * types of your app's query and mutation functions.
 *
 * This type should be used with type-parameterized classes like
 * `ConvexReactClient` to create a typed client.
 */
export type API = {
  deals: typeof deals;
  documents: typeof documents;
  kanban: typeof kanban;
  presence: typeof presence;
  propertyDefinitions: typeof propertyDefinitions;
  versions: typeof versions;
  presentations: typeof presentations;
};
