class Viewport {
  public width: number;
  public height: number;

  /**
   * Sets the viewport data based on the provided container.
   *
   * @param container
   */
  public setContainer(container: HTMLDivElement) {
    this.width = container.clientWidth;
    this.height = container.clientHeight;
  }
}

export const viewport = new Viewport();
