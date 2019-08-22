class Viewport {
  public element: HTMLDivElement;

  public offset: ClientRect | DOMRect;
  public width: number;
  public height: number;

  /**
   * Sets the viewport data based on the provided element.
   *
   * @param element
   */
  public setContainer(element: HTMLDivElement) {
    this.element = element;
    this.offset = element.getBoundingClientRect();
    this.width = element.clientWidth;
    this.height = element.clientHeight;
  }
}

export const viewport = new Viewport();
