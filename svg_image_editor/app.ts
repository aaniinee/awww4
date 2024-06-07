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
  private selectedRectangle: Rectangle | null = null;
  // private selectedIndex: number | null = null;

  constructor(svgElement: SVGSVGElement) {
    this.svgElement = svgElement;
    this.svgElement.addEventListener('mousedown', this.startDrawing.bind(this));
    this.svgElement.addEventListener('mouseup', this.finishDrawing.bind(this));
    this.svgElement.addEventListener('click', this.selectRectangle.bind(this));
    document.getElementById('removeRectangleButton')!.addEventListener('click', this.removeSelectedRectangle.bind(this));
  }
  
  addRectangle(rect: Rectangle) {
    if(rect.height > 0 && rect.width > 0){  
      this.rectangles.push(rect);
      this.drawRectangle(rect);
    }
  }
  
  removeSelectedRectangle() {
    console.log("rm");
    if (this.selectedRectangle) {
      console.log(`rm3: ${JSON.stringify(this.selectedRectangle)}`);
      console.log(`rm4: ${JSON.stringify(this.rectangles)}`);

      let svg = '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">';
      this.rectangles.forEach(rect => {
        svg += `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="${rect.fill}" />`;
      });
      svg += '</svg>';
      const jsonData = JSON.stringify(svg);
      console.log(jsonData);
      // console.log(`rm4: ${this.rectangles}`);
      const rectIndex = this.rectangles.findIndex(rect => JSON.stringify(rect) == JSON.stringify(this.selectedRectangle));
      console.log(`${rectIndex}`);
      if (rectIndex !== -1) {
        console.log("rm2");
        this.rectangles.splice(rectIndex, 1);
        this.svgElement.querySelector(`[data-rect='${JSON.stringify(this.selectedRectangle)}']`)!.remove();
        this.selectedRectangle = null;
        (document.getElementById('removeRectInfo') as HTMLInputElement).value = '';
      }
    }
  }

  selectRectangle(event: MouseEvent) {
    const target = event.target as SVGRectElement;
    if (target.nodeName === 'rect') {
      this.selectedRectangle = JSON.parse(target.dataset.rect!);
      console.log(`sr1 ${JSON.stringify(this.selectedRectangle)}`);
      (document.getElementById('removeRectInfo') as HTMLInputElement).value = `x: ${this.selectedRectangle!.x}, y: ${this.selectedRectangle!.y}, width: ${this.selectedRectangle!.width}, height: ${this.selectedRectangle!.height}, fill: ${this.selectedRectangle!.fill}`;
    }console.log(`sr ${JSON.stringify(this.selectedRectangle)}`);
  }

  drawRectangle(rect: Rectangle) {
    const rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectElement.setAttribute('x', rect.x.toString());
    rectElement.setAttribute('y', rect.y.toString());
    rectElement.setAttribute('width', rect.width.toString());
    rectElement.setAttribute('height', rect.height.toString());
    rectElement.setAttribute('fill', rect.fill);
    rectElement.dataset.rect = JSON.stringify(rect); // Store rect data in data attribute
    this.svgElement.appendChild(rectElement);
  }

  private startX: number = 0;
  private startY: number = 0;
  private isDrawing = false;

  startDrawing(event: MouseEvent) {
    this.startX = event.offsetX;
    this.startY = event.offsetY;
    this.isDrawing = true;
  }

  finishDrawing(event: MouseEvent) {
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
