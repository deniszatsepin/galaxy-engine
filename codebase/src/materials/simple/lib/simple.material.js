/**
 * Created by denis.zatsepin on 10/12/2016.
 */
'use strict';

import { vec3 } from 'gl-matrix';
import vertexShader from './shaders/simple.v.glsl';
import fragmentShader from './shaders/simple.f.glsl';

export default function createSimpleMaterial(params = {}) {
  return {
    vertexShader,
    fragmentShader,
    lightColor: params.lightColor || vec3.fromValues(1.0, 1.0, 1.0),
  };
}
