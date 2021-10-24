import { createReducer, on } from '@ngrx/store';
import { increment, reset } from './score.actions';

export const initialState = 0;

const _scoreReducer = createReducer(
  initialState,
  on(increment, (state, { byScore }) => state + byScore),
  on(reset, (state) => 0)
);

export function scoreReducer(state: any, action: any) {
  return _scoreReducer(state, action);
}
