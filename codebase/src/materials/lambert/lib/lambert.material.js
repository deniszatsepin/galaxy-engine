import vertexShader from './shaders/lambert.v.glsl';
import fragmentShader from './shaders/lambert.f.glsl';

const precision = 'precision mediump float;';
const skinning = '#define SKINNING 1';
const texture = '#define TEXTURE 1';

export default function createLambertMaterial(params = {}) {
  const vShader = [vertexShader];
  const fShader = [fragmentShader];

  if (params.skinning) {
    vShader.unshift(skinning);
  }

  if (params.diffuse) {
    fShader.unshift(texture);
  }

  vShader.unshift(precision);
  fShader.unshift(precision);

  return {
    vertexShader: vShader.join('\n'),
    fragmentShader: fShader.join('\n'),
    ...params,
  };
}
