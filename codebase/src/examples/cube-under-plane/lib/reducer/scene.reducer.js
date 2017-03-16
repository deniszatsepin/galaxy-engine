import { createSceneReducer } from 'state/scene';

import { reducer as transform } from 'state/transform';
import { reducer as visual } from 'state/visual';
import { reducer as light } from 'state/light';
import { reducer as target } from 'state/target';

export default createSceneReducer([
  transform,
  visual,
  light,
  target,
]);
