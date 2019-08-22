import * as Quill from "quill";
import * as React from "react";
import styled from "styled-components";

import { Page } from "Engine/Page";
import { Section } from "Engine/Section";

import { router } from "../../Router";
import { fitAspect } from "./Lib/AspectRatio";
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
    this.state = {
      ratio: JSON.parse(localStorage.getItem("viewport.ratio") || `{"name": "","width": "100%","height": "100%"}`),
      editing: {
        section: "",
        stack: "",
        component: ""
      }
    };
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
  private onEdit = (section: string, stack?: string, component?: string) => {
    this.setState(() => ({
      editing: {
        section: section || "",
        stack: stack || "",
        component: component || ""
      }
    }));
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
        "viewport.ratio",
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
      <Wrapper>
        <Navigator page={this.page} edit={this.onEdit} ratio={this.setRatio} />
        <Content
          ref={c => (this.content = c)}
          style={{ gridTemplateColumns: `1fr ${this.state.ratio.width} 1fr`, gridTemplateRows: `1fr ${this.state.ratio.height} 1fr`, padding: "26px" }}
        >
          <Viewport ref={c => (this.viewport = c)} />
        </Content>
        <Sidebar page={this.page} editing={this.state.editing} edit={this.onEdit} />
      </Wrapper>
    );
  }
}

const Content = styled.div`
  display: grid;
  grid-template-areas: ". . ." ". viewport ." ". . .";

  height: 100vh;

  background: url("https://i.ibb.co/xDg9pw4/grid.png");
`;

const Viewport = styled.div`
  position: relative;
  grid-area: viewport;

  border: 1px solid #57b3e4;

  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  text-rendering: optimizeLegibility;

  /* Position Classes */

  .position-relative {
    position: relative;
  }

  .position-absolute {
    position: absolute;
  }

  .position-sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }
  .position-sticky:before,
  .position-sticky:after {
    content: "";
    display: table;
  }

  /* Fixed Sticky */

  .position-fixed {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .position-fixed_container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    clip: rect(0, auto, auto, 0);
    /* clip-path: polygon(0px 0px, 0px 100%, 100% 100%, 100% 0px); */
  }

  .position-scroll_overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .position-fixed_component {
    position: fixed;
    top: 0;
  }

  /* Flex */

  .display-flex {
    display: -webkit-flex; /* Safari */
    display: flex;
  }

  /* Quill */

  .ql-container {
    font-family: "Merriweather", serif;
    font-size: 1em;
    height: auto;
  }

  .ql-editor {
    line-height: inherit;
    overflow: visible;
    height: auto;
  }

  .ql-tooltip {
    border-radius: 3px;
  }

  .ql-blank::before {
    left: auto;
    right: auto;
  }
`;
