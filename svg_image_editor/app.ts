interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

class SvgImage {
  private svgElement: SVGSVGElement;
  private rectangles: Rectangle[] = [];

  constructor(svgElement: SVGSVGElement) {
    this.svgElement = svgElement;
    this.svgElement.addEventListener('mousedown', this.startDrawing.bind(this));
    this.svgElement.addEventListener('mouseup', this.finishDrawing.bind(this));
    this.svgElement.addEventListener('click', this.removeRectangle.bind(this));
  }

  addRectangle(rect: Rectangle) {
    console.log("add");
    this.rectangles.push(rect);
    this.drawRectangle(rect);
  }

  removeRectangle(event: MouseEvent) {
    const target = event.target as SVGRectElement;
    console.log("rm");
    if (target.nodeName === 'rect') {
      // const rectIndex = this.rectangles.findIndex(rect => rect === JSON.parse(target.dataset.rect!));
      const rectIndex = this.rectangles.findIndex(rect => rect === target['data-rect']);
      if (rectIndex !== -1) {
        this.rectangles.splice(rectIndex, 1);
        
        console.log("rm2");
        target.remove();
      }
    }
  }

  drawRectangle(rect: Rectangle) {
    console.log("draw");
    const rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectElement.setAttribute('x', rect.x.toString());
    rectElement.setAttribute('y', rect.y.toString());
    rectElement.setAttribute('width', rect.width.toString());
    rectElement.setAttribute('height', rect.height.toString());
    rectElement.setAttribute('fill', rect.fill);
    // rectElement.dataset.rect = JSON.stringify(rect);
    rectElement['data-rect'] = rect;
    this.svgElement.appendChild(rectElement);
  }

  private startX: number = 0;
  private startY: number = 0;
  private isDrawing = false;

  startDrawing(event: MouseEvent) {
    console.log("sd");
    this.startX = event.offsetX;
    this.startY = event.offsetY;
    this.isDrawing = true;
  }

  finishDrawing(event: MouseEvent) {
    console.log("fd");
    if (this.isDrawing) {
      const endX = event.offsetX;
      const endY = event.offsetY;
      const rect: Rectangle = {
        x: Math.min(this.startX, endX),
        y: Math.min(this.startY, endY),
        width: Math.abs(endX - this.startX),
        height: Math.abs(endY - this.startY),
        fill: (document.getElementById('fillColor') as HTMLInputElement).value
      };
      this.addRectangle(rect);
      this.isDrawing = false;
    }
  }
}

const svgElement = document.getElementById('drawingArea') as unknown as SVGSVGElement;
const svgImage = new SvgImage(svgElement);

document.getElementById('addRectangleButton')!.addEventListener('click', () => {
  const x1 = parseInt((document.getElementById('x1') as HTMLInputElement).value);
  const y1 = parseInt((document.getElementById('y1') as HTMLInputElement).value);
  const x2 = parseInt((document.getElementById('x2') as HTMLInputElement).value);
  const y2 = parseInt((document.getElementById('y2') as HTMLInputElement).value);
  const fill = (document.getElementById('fillColor') as HTMLInputElement).value;

  const rect: Rectangle = {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
    fill: fill
  };

  svgImage.addRectangle(rect);
});
