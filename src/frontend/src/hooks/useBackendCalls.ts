import type { backendInterface } from "../backend.d";
/**
 * useBackendCalls - wrapper around useActor that provides typed backend methods
 * for use in event handlers (not during render).
 */
import { useActor } from "./useActor";

export function useBackendCalls() {
  const { actor, isFetching } = useActor();
  return {
    actor: actor as backendInterface | null,
    isReady: !!actor && !isFetching,
  };
}
