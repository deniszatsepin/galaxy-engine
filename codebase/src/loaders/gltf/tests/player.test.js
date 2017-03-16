import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const modelDirectory = path.resolve(__dirname, '../models/glTF');
const gltf = require(path.join(modelDirectory, 'monster.gltf'));

describe('Parser', () => {
  before(() => {

  });

  it('should show have a scene', () => {
  });

});
