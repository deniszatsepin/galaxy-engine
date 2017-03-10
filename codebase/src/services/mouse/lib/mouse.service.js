import Service from 'core/service';

export default class MouseService extends Service {
  constructor(params = {}) {
    params.priority = params.priority || 60;
    params.name = 'mouse';
    super(params);
  }

  initialize(store) {
    super.initialize(store);
    const container = this.container = this.manager.getService('container');
    const element = container.element;
    if (element) {
      element.addEventListener('mousemove', (event) => this.onMove(event));
      element.addEventListener('click', (event) => this.onClick(event));
      element.addEventListener('mousedown', (event) => this.onDown(event));
      element.addEventListener('mouseup', (event) => this.onUp(event));
      element.addEventListener('wheel', (event) => this.onWheel(event));
    }
  }

  onMove(event) {
    event.preventDefault();
    const offset = this.container.offset;
    const x = event.pageX - offset.left;
    const y = event.pageY - offset.top;

    this.props.setPosition({
      x,
      y,
    });
  }

  onClick(event) {
    event.preventDefault();

    this.props.setButtons({
      left: false,
    });
  }

  onDown(event) {
    event.preventDefault();

    this.props.setButtons({
      left: true,
    });
  }

  onUp(event) {
    event.preventDefault();

    this.props.setButtons({
      left: false,
    });
  }

  onWheel(event) {
    event.preventDefault();

    this.props.setScroll({
      x: event.deltaX,
      y: event.deltaY,
      z: event.deltaZ,
    });
  }
}
