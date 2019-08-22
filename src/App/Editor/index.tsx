import * as Quill from "quill";
import * as React from "react";
import styled from "styled-components";

import { Page } from "Engine/Page";
import { Section } from "Engine/Section";
import { Stack } from "Engine/Stack";

import { router } from "../../Router";
import { Navigator } from "./Navigator";
import { GallerySettings } from "./Settings/Gallery";
import { ImageSettings } from "./Settings/Image";
import { OverlaySettings } from "./Settings/Overlay";
import { RevealSettings } from "./Settings/Reveal";
import { SectionSettings } from "./Settings/Section";
import { StackSettings } from "./Settings/Stack";
import { TextSettings } from "./Settings/Text";
import { SettingSidebar, Wrapper } from "./Styles";

export class Editor extends React.Component<
  {},
  {
    tab: string;
    ratio: {
      width: string;
      height: string;
    };
    section?: Section;
    stack?: Stack;
    component?: any;
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
      tab: "",
      ratio: {
        width: "50%",
        height: "80%"
      },
      section: undefined,
      stack: undefined,
      component: undefined
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
  }

  public componentWillUnmount() {
    this.page.off("ready", this.onReady);
    this.page.off("loaded", this.onLoaded);
    this.page.off("refresh", this.onRefresh);
    this.page.off("edit", this.onEdit);
  }

  /*
  |--------------------------------------------------------------------------------
  | Event Handlers
  |--------------------------------------------------------------------------------
  */

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
   * Sets the current editable component.
   *
   * @param section
   * @param component
   */
  private onEdit = (section: Section, stack?: Stack, component?: any) => {
    this.setState(() => ({
      tab: component ? "component" : stack ? "stack" : section ? "section" : "",
      section,
      stack,
      component
    }));
  };

  private setRatio = (value: number[]) => {
    if (this.content) {
      const ratio = getPercent(this.content, value);
      this.setState(
        () => ({
          ratio: {
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
        <Content ref={c => (this.content = c)} style={{ gridTemplateColumns: `1fr ${this.state.ratio.width} 1fr`, gridTemplateRows: `1fr ${this.state.ratio.height} 1fr` }}>
          <Viewport ref={c => (this.viewport = c)} />
        </Content>
        <SettingSidebar>{this.renderTabs()}</SettingSidebar>
      </Wrapper>
    );
  }

  private renderTabs() {
    const { tab, section, stack, component } = this.state;
    return (
      <React.Fragment>
        <Tabs>
          <span
            className={tab === "section" ? "active" : !section ? "disabled" : ""}
            onClick={() => {
              if (section) {
                this.setState(() => ({ tab: "section" }));
              }
            }}
          >
            Section
          </span>
          <span
            className={tab === "stack" ? "active" : !stack ? "disabled" : ""}
            onClick={() => {
              this.setState(() => ({ tab: "stack" }));
            }}
          >
            Stack
          </span>
          <span
            className={tab === "component" ? "active" : !component ? "disabled" : ""}
            onClick={() => {
              if (component) {
                this.setState(() => ({ tab: "component" }));
              }
            }}
          >
            Component
          </span>
        </Tabs>
        {tab === "section" && this.state.section && <SectionSettings section={this.state.section} />}
        {tab === "stack" && this.state.section && this.state.stack && this.renderStackSettings(this.state.stack)}
        {tab === "component" && this.state.section && this.state.component && this.renderComponentSettings(this.state.section, this.state.component)}
      </React.Fragment>
    );
  }

  private renderStackSettings(stack: Stack) {
    return <StackSettings stack={stack} />;
  }

  private renderComponentSettings(section: Section, component: any) {
    switch (component.type) {
      case "image": {
        return <ImageSettings section={section} component={component} />;
      }
      case "text": {
        return <TextSettings section={section} component={component} />;
      }
      case "overlay": {
        return <OverlaySettings section={section} component={component} />;
      }
      case "gallery": {
        return <GallerySettings section={section} component={component} />;
      }
      case "reveal": {
        return <RevealSettings section={section} component={component} />;
      }
    }
  }
}

function getPercent(container: HTMLDivElement, [x, y]: number[], padding?: number): { width: number; height: number } {
  const isPortrait = container.clientWidth < container.clientHeight;
  return isPortrait
    ? {
        width: container.clientWidth,
        height: (container.clientWidth / x) * y
      }
    : {
        width: container.clientWidth,
        height: (container.clientWidth / x) * y
      };
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

    &.ql-snow {
      border: none;
    }
  }

  .ql-editor {
    line-height: inherit;
    overflow: visible;
    height: auto;
  }

  .ql-toolbar {
    display: none;
  }

  .ql-blank::before {
    left: auto;
    right: auto;
  }
`;

const Tabs = styled.div`
  display: flex;

  border-bottom: 2px solid #ccc;
  margin-bottom: 10px;

  span {
    display: block;

    flex-basis: 100%;

    border-right: 1px solid #ccc;
    padding: 5px;

    color: #767676;
    font-size: 13px;
    font-weight: bold;
    text-align: center;

    &.disabled {
      color: #ccc;
    }

    &.active {
      background: #dbdcde;
      color: #4362a3;
    }

    &:hover {
      cursor: pointer;
      &.disabled {
        cursor: default;
      }
    }

    &:last-child {
      border-right: none;
    }
  }
`;
