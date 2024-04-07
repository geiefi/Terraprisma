let offsetBase: HTMLDivElement;

export function getAbsoluteBoundingRect(el: HTMLElement): DOMRect {
  let left = 0,
    top = 0,
    width = 0,
    height = 0;
  if (!offsetBase && document.body) {
    offsetBase = document.createElement('div');
    offsetBase.style.cssText = 'position:absolute;left:0;top:0';
    document.body.appendChild(offsetBase);
  }
  const boundingRect = el.getBoundingClientRect();
  const baseRect = offsetBase.getBoundingClientRect();
  left = boundingRect.left - baseRect.left;
  top = boundingRect.top - baseRect.top;
  width = boundingRect.right - boundingRect.left;
  height = boundingRect.bottom - boundingRect.top;
  return {
    left: left,
    x: left,
    top: top,
    y: top,
    width: width,
    height: height,
    right: left + width,
    bottom: top + height,
    toJSON() {
      return JSON.stringify(this);
    }
  };
}
