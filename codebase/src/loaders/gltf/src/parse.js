import { vec3, quat, mat4 } from 'gl-matrix';
import uuid from 'uuid';
import loadBuffers from './buffers';
import { actions } from 'state/scene';
import { actions as transformActions} from 'state/transform';
import { actions as visualActions} from 'state/visual';
import { actions as skinActions } from 'state/skin';
import createLambertMaterial from 'materials/lambert';

const {
  createEntity,
  addEntityChild,
} = actions;
const {
  addTransform
} = transformActions;
const {
  addVisual
} = visualActions;
const {
  addSkin,
} = skinActions;

export {
  getSceneNames,
  getScene,
  getSceneNodes,
  parseNode,
};

function getSceneNames(gltf) {
  return Object.keys(gltf.scenes);
}

function getScene(gltf, name) {
  return gltf.scenes[name || gltf.scene];
}

function getSceneNodes(gltf, sceneName) {
  const scene = getScene(gltf, sceneName);
  if (!scene) return [];
  return scene.nodes.map(name => gltf.nodes[name]);
}

mat4.getScale = function(vec, mat) {
  let sx = vec3.length(vec3.fromValues(mat[0], mat[1], mat[2]));
  const sy = vec3.length(vec3.fromValues(mat[4], mat[5], mat[6]));
  const sz = vec3.length(vec3.fromValues(mat[8], mat[9], mat[10]));

  // if determine is negative, we need to invert one scale
  const det = mat4.determinant(mat);
  if ( det < 0 ) {
    sx = - sx;
  }

  return vec3.set(vec, sx, sy, sz);
}

function parseNode(gltf, nodeName, parent) {
  const node = gltf.nodes[nodeName];
  const record = [];
  const entityId = uuid.v4();
  record.push(createEntity(entityId, node.name, {
    jointName: node.jointName,
  }));

  if (parent) {
    record.push(addEntityChild(parent, entityId));
  }

  if (node.matrix) {
    record.push(addTransform(entityId, {
      position: mat4.getTranslation(vec3.create(), node.matrix),
      rotation: mat4.getRotation(quat.create(), node.matrix),
      scale: mat4.getScale(vec3.create(), node.matrix),
    }));
  }

  if (node.translation) {
    record.push(addTransform(entityId, {
      position: new Float32Array(node.translation),
      quaternion: new Float32Array(node.rotation),
      scale: new Float32Array(node.scale),
    }));
  }

  let skin;
  if (node.skin) {
    const skinInfo = gltf.skins[node.skin];
    const inverseBindMatrices = parseAccessor(gltf, skinInfo.inverseBindMatrices);
    skin = {
      ...skinInfo,
      bindShapeMatrix: new Float32Array(skinInfo.bindShapeMatrix),
      inverseBindMatrices,
    };
  }


  if (node.meshes) {
    node.meshes
      .map(meshName => parseMesh(gltf, meshName))
      .forEach(primitives => {
        primitives.forEach(visual => {
          record.push(addVisual(entityId, {
            visualId: uuid.v1(),
            geometry: visual.geometry,
            material: createLambertMaterial(visual.material),
            skin,
          }));
        })
      });
  }

  node.children
    .map(child => parseNode(gltf, child, entityId))
    .forEach((action) => {
      if (Array.isArray(action)) {
        action.forEach(a => record.push(a));
      } else {
        record.push(action)
      }
    });

  return record;
}

function parseMesh(gltf, meshName) {
  const mesh = gltf.meshes[meshName];

  return mesh.primitives
    .map(primitive => {
      const {
        attributes: {
          NORMAL: normals,
          POSITION: positions,
          TEXCOORD_0: uvs,
          JOINT: joint,
          WEIGHT: weight,
        },
        indices: cells,
        material: materialId,
      } = primitive;

      const material = parseMaterial(gltf, materialId);

      return {
        geometry: {
          cells: parseAccessor(gltf, cells),
          positions: parseAccessor(gltf, positions),
          normals: parseAccessor(gltf, normals),
          uvs: parseAccessor(gltf, uvs),
          joint: parseAccessor(gltf, joint),
          weight: parseAccessor(gltf, weight),
        },
        material,
      };
    });
}

function parseMaterial(gltf, materialId) {
  const material = gltf.materials[materialId].values;
  const textureId = material.diffuse;
  const texture = gltf.textures[textureId];
  const imageId = texture.source;
  return {
    ...material,
    diffuse: {
      ...texture,
      source: gltf.__resources.images[imageId],
    }
  }
}

function parseAccessor(gltf, name) {
  const accessor = gltf.accessors[name];
  const arrayType = getArrayType(accessor.componentType);
  const bufferView = gltf.bufferViews[accessor.bufferView];
  const buffer = gltf.__resources.buffers[bufferView.buffer];
  const byteOffset = accessor.byteOffset + bufferView.byteOffset;
  const length = getAccessorLength(accessor);

  return new arrayType(buffer, byteOffset, length);
}

function getArrayType(type) {
  switch(type) {
    case 5126: return Float32Array;
    case 5123: return Uint16Array;
    case 5122: return Int16Array;
    case 5121: return Uint8Array;
    case 5120: return Int8Array;
  }
}

function getAccessorLength(accessor) {
  // return getComponentSize(accessor.componentType) *
  return  getComponentsNumber(accessor.type) * accessor.count;
}

function getComponentSize(type) {
  switch(type) {
    case 5126: return 4;
    case 5123: return 2;
    case 5122: return 2;
    case 5121: return 1;
    case 5120: return 1;
  }
}

function getComponentsNumber(type) {
  switch (type) {
    case 'SCALAR': return 1;
    case 'VEC2': return 2;
    case 'VEC3': return 3;
    case 'VEC4': return 4;
    case 'MAT2': return 4;
    case 'MAT3': return 9;
    case 'MAT4': return 16;
  }
}
