import { createSceneReducer } from 'core/scene';

import { reducer as transform } from 'components/transform';
import { reducer as visual } from 'components/visual';
import { reducer as light } from 'components/light';

export default createSceneReducer([
  transform,
  visual,
  light
]);
