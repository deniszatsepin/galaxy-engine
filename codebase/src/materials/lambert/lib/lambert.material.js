import vertexShader from './shaders/lambert.v.glsl';
import fragmentShader from './shaders/lambert.f.glsl';

export default function createLambertMaterial(params = {}) {
  return {
    vertexShader,
    fragmentShader,
    ...params,
  };
}
