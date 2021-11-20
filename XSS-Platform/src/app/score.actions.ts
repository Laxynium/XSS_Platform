import { createAction, props } from '@ngrx/store';

export const increment = createAction('[Score Component] Increment', props<{ byScore: number }>());
export const reset = createAction('[Score Component] Reset');
