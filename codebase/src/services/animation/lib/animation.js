'use strict';

import { mat4, vec3, quat } from 'gl-matrix';
import Service from 'core/service';
import { actions as transformActions } from 'state/transform';
import { actions as samplerActions } from 'state/sampler';

export default class AnimationService extends Service {

  constructor(params = {}) {
    params.name = 'animations';
    params.priority = 10;
    super(params);
  }

  initialize(store) {
    super.initialize(store);
    this._prevState = {};
  }

  update(time) {
    const state = this.store.getState();
    const samples = state.samples;
    const animations = state.animations;
    const scene = state.scene;
    if (samples === this._prevState) return;
    this._prevState = samples;

    samples
      .forEach(sample => {
        if (!sample.startTime) {
          return this.store.dispatch(samplerActions.updateSample({
            ...sample,
            startTime: time,
            prevTime: time,
          }));
        }

        const duration = time - sample.startTime;

        Object
          .keys(animations)
          .map(key => animations[key])
          .forEach(animation => {
            const {
              channels,
              parameters,
              samplers,
            } = animation;

            const transforms = channels.map((channel) => {
              const sampler = samplers[channel.sampler];
              const {
                id,
                path
              } = channel.target;
              const joint = getJointByName(scene, id);
              const transform = getTransform(sampler, parameters, duration / 1000);

              if (path === 'translation') {
                return transformActions.setPosition(joint.entityId, transform);
              }

              if (path === 'rotation') {
                return transformActions.setQuaternion(joint.entityId, transform);
              }

              if (path === 'scale') {
                return transformActions.setScale(joint.entityId, transform);
              }
            });

            transforms.forEach(action => this.store.dispatch(action));
          });

        this.store.dispatch(samplerActions.updateSample({
          ...sample,
          prevTime: time,
        }));
      });
  }
}

function getTransform(sampler, parameters, duration) {
  const input = parameters[sampler.input];
  const output = parameters[sampler.output];

  const nextIdx = findIndex(input, (el) => el > duration);
  if (nextIdx === -1) return [];

  switch (sampler.output) {
    case 'translation':
    case 'scale': {
      let idx = nextIdx * 3;
      return vec3.fromValues(output[idx], output[idx + 1], output[idx + 2])
    }
    case 'rotation': {
      let idx = nextIdx * 4;
      return quat.fromValues(
        output[idx],
        output[idx + 1],
        output[idx + 2],
        output[idx + 3]
      );
    }
  }
}

function findIndex(arr, fn) {
  for (let i = 0, len = arr.length; i < len; i += 1) {
    if (fn(arr[i])) return i;
  }
  return -1;
}

function getJointByName(scene, name) {
  const key = Object.keys(scene)
    .find(key => scene[key].name === name);
  return scene[key];
}
