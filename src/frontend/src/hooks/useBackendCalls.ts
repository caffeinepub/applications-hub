/**
 * useBackendCalls - wrapper around useActor that provides typed backend methods
 * for use in event handlers (not during render).
 */
import { useActor } from './useActor';
import type { backendInterface } from '../backend.d';

export function useBackendCalls() {
  const { actor, isFetching } = useActor();
  return { actor: actor as backendInterface | null, isReady: !!actor && !isFetching };
}
