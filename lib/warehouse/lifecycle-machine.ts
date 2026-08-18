import { OrderStatus } from '@/types/order.types';
import { VALID_TRANSITIONS } from './constants';

export function canTransitionOrder(current: OrderStatus, target: OrderStatus): boolean {
  if (current === target) return true;
  const allowed = VALID_TRANSITIONS[current];
  return allowed ? allowed.includes(target) : false;
}

export function validateStageTransition(current: OrderStatus, target: OrderStatus): void {
  if (!canTransitionOrder(current, target)) {
    throw new Error(
      `Invalid order stage transition from '${current}' to '${target}'. Allowed next stages: ${VALID_TRANSITIONS[current]?.join(', ') || 'none'}`
    );
  }
}
