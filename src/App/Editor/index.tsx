import * as Quill from "quill";
import * as React from "react";
import styled from "styled-components";

import { Page } from "Engine/Page";

import { router } from "../../Router";
import { Viewport } from "../Style";
import { Color, Font } from "../Variables";
import { modal } from "./Components/Modal";
import { portal } from "./Components/Portal";
import { fitAspect } from "./Lib/AspectRatio";
import { Navbar } from "./Navbar";
import { Navigator } from "./Navigator";
import { Sidebar } from "./Sidebar";
import { Wrapper } from "./Styles";

export class Editor extends React.Component<
  {},
  {
    ratio: {
      name: string;
      width: string;
      height: string;
    };
    editing: {
      section: string;
      stack: string;
      component: string;
    };
  }
> {
  /**
   * Engine page instance.
   * @type {Page}
   */
  private page: Page;

  /**
   * Content element.
   * @type {HTMLDivElement | null}
   */
  private content: HTMLDivElement | null;

  /**
   * Viewport element, where we render the page.
   * @type {HTMLDivElement | null}
   */
  private viewport: HTMLDivElement | null;

  constructor(props: any, state: any) {
    super(props, state);

    const page = router.params.get("page");

    const cachedRatio = localStorage.getItem(`viewport.ratio.${page}`);
    const cachedEditing = localStorage.getItem(`editing.${page}`);

    let ratio = { name: "", width: "100%", height: "100%" };
    if (cachedRatio) {
      ratio = JSON.parse(cachedRatio);
    }

    let editing = { section: "", stack: "", component: "" };
    if (cachedEditing) {
      editing = JSON.parse(cachedEditing);
    }

    this.state = { ratio, editing };
  }

  /*
  |--------------------------------------------------------------------------------
  | React Cycles
  |--------------------------------------------------------------------------------
  */

  /**
   * @should create a new page
   * @should load cached page if exists
   * @should update editor on section update events
   */
  public componentDidMount() {
    window.page = this.page = new Page(this.viewport, {
      id: router.params.get("page"),
      editing: true,
      Quill
    })
      .on("ready", this.onReady)
      .on("loaded", this.onLoaded)
      .on("refresh", this.onRefresh)
      .on("edit", this.onEdit);

    window.addEventListener("resize", this.onResize);
  }

  public componentWillUnmount() {
    this.page.off("ready", this.onReady);
    this.page.off("loaded", this.onLoaded);
    this.page.off("refresh", this.onRefresh);
    this.page.off("edit", this.onEdit);

    window.removeEventListener("resize", this.onResize);
  }

  /*
  |--------------------------------------------------------------------------------
  | Event Handlers
  |--------------------------------------------------------------------------------
  */

  private onResize = () => {
    this.setRatio();
  };

  /**
   * Triggers when the page container has successfully rendered.
   */
  private onReady = () => {
    const cache = localStorage.getItem(`page.${router.params.get("page")}`);
    if (cache) {
      this.page.load(JSON.parse(cache));
    }
    this.forceUpdate();
  };

  /**
   * Triggers when a cached page has finished loading.
   */
  private onLoaded = () => {
    this.forceUpdate();
  };

  /**
   * Triggers when something has changed in the engine.
   */
  private onRefresh = () => {
    this.forceUpdate();
  };

  /**
   * Sets the current editable section
   *
   * @param section
   * @param stack
   * @param component
   */
  private onEdit = (section?: string, stack?: string, component?: string) => {
    const editing = {
      section: section || "",
      stack: stack || "",
      component: component || ""
    };
    localStorage.setItem(`editing.${router.params.get("page")}`, JSON.stringify(editing));
    this.setState(() => ({ editing }));
  };

  /**
   * Sets viewport aspect ratio.
   *
   * @param ratioName
   */
  private setRatio = (ratioName: string = "") => {
    if (this.content) {
      const ratio = ratioName === "" ? { width: 100, height: 100 } : fitAspect(this.content, ratioName);
      localStorage.setItem(
        `viewport.ratio.${router.params.get("page")}`,
        JSON.stringify({
          name: ratioName,
          width: `${ratio.width}%`,
          height: `${ratio.height}%`
        })
      );
      this.setState(
        () => ({
          ratio: {
            name: ratioName,
            width: `${ratio.width}%`,
            height: `${ratio.height}%`
          }
        }),
        () => {
          setTimeout(() => {
            this.page.refresh();
          }, 250);
        }
      );
    }
  };

  /*
  |--------------------------------------------------------------------------------
  | Renderers
  |--------------------------------------------------------------------------------
  */

  public render() {
    return (
      <React.Fragment>
        <Wrapper>
          <Navbar page={this.page} ratio={this.state.ratio} edit={this.onEdit} setRatio={this.setRatio} />
          <Navigator page={this.page} edit={this.onEdit} ratio={this.setRatio} />
          <Content
            ref={c => (this.content = c)}
            style={{
              gridArea: "content",
              gridTemplateColumns: `auto ${this.state.ratio.width} auto`,
              gridTemplateRows: `auto ${this.state.ratio.height} auto`,
              padding: "26px",
              height: `calc(100vh - 35px)`
            }}
          >
            <Toolbar id="toolbar" />
            <Viewport ref={c => (this.viewport = c)} />
          </Content>
          <Sidebar page={this.page} editing={this.state.editing} edit={this.onEdit} />
        </Wrapper>
        {portal.render()}
        {modal.render()}
      </React.Fragment>
    );
  }
}

const Toolbar = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  background: ${Color.Background};
  border-bottom: 1px solid ${Color.Border};
  width: 100%;

  z-index: 1;

  .ql-toolbar {
    border: none !important;
  }

  .ql-formats {
    position: relative;
  }

  .ql-stroke {
    stroke: ${Color.FontDark};
  }

  .ql-fill {
    fill: ${Color.FontDark} !important;
  }

  .ql-active {
    color: ${Color.FontLight} !important;
    .ql-stroke {
      stroke: ${Color.FontLight} !important;
    }
    .ql-fill {
      fill: ${Color.FontLight} !important;
    }
  }

  select {
    background: ${Color.BackgroundLight};
    border: 1px solid ${Color.Border};
    color: ${Color.Font};
    font-size: ${Font.Size};
    padding: 4px;

    width: 100%;
    height: 24px;

    &:focus {
      outline: 1px solid ${Color.BackgroundBlue};
    }
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-areas: ". . ." ". viewport ." ". . .";

  position: relative;
  height: 100vh;

  background: url("https://i.ibb.co/xDg9pw4/grid.png");
`;
