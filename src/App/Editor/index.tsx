import * as Quill from "quill";
import * as React from "react";
import styled from "styled-components";

import { Page } from "Engine/Page";

import { router } from "../../Router";
import { Viewport } from "../Style";
import { Color, Font } from "../Variables";
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
      <Wrapper>
        <Navbar style={{ gridArea: "navbar" }}>
          <div className="left">
            {this.page && (
              <div>
                {this.page.conduit ? (
                  <div className="button">
                    <span>
                      <i className="fa fa-link" /> Peer ID | {this.page.conduit.id}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      this.page.share();
                    }}
                  >
                    <i className="fa fa-link" /> Share
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="center">
            <div className={this.state.ratio.name === "" ? "active" : ""}>
              <button
                onClick={() => {
                  this.setRatio("");
                }}
              >
                <i className="fa fa-desktop" style={{ fontSize: 15, marginRight: 0 }} />
              </button>
            </div>
            <div className={this.state.ratio.name === "iPad Pro" ? "active" : ""}>
              <button
                onClick={() => {
                  this.setRatio("iPad Pro");
                }}
              >
                <i className="fa fa-tablet" style={{ fontSize: 19, marginRight: 0 }} />
              </button>
            </div>
            <div className={this.state.ratio.name === "iPhone XR" ? "active" : ""}>
              <button
                onClick={() => {
                  this.setRatio("iPhone XR");
                }}
              >
                <i className="fa fa-mobile" style={{ fontSize: 20, marginRight: 0 }} />
              </button>
            </div>
          </div>
          <div className="right">
            <div>
              <button
                onClick={() => {
                  window.open(`/read/${this.page.id}`, "_blank");
                }}
              >
                <i className="fa fa-eye" /> Preview
              </button>
            </div>
          </div>
        </Navbar>
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
          <Viewport ref={c => (this.viewport = c)} />
        </Content>
        <Sidebar page={this.page} editing={this.state.editing} edit={this.onEdit} />
      </Wrapper>
    );
  }
}

const Navbar = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;

  background: ${Color.Background};
  border-bottom: 1px solid ${Color.Border};
  color: ${Color.Font};
  height: 35px;

  font-family: ${Font.Family};
  font-size: ${Font.Size};

  .left,
  .center,
  .right {
    > div {
      height: 100%;
      padding: 0 15px;

      &:hover {
        color: ${Color.FontLight};
      }

      &.active {
        background: ${Color.BackgroundLight};
        color: ${Color.FontLight};
      }
    }

    .button,
    button {
      background: none;
      border: none;
      color: inherit;
      height: 100%;
      font-size: ${Font.Size};

      &:active,
      &:visited,
      &:focus {
        outline: none;
      }

      > span {
        display: block;
        padding-top: 11px;
      }
    }

    i {
      color: inherit;
      margin-right: 5px;
    }
  }

  .left {
    display: flex;
    align-content: center;
    justify-content: flex-start;

    > div {
      border-right: 1px solid ${Color.BorderLight};
    }
  }

  .center {
    display: flex;
    align-content: center;
    justify-content: center;

    > div {
      border-left: 1px solid ${Color.BorderLight};
      &:last-child {
        border-right: 1px solid ${Color.BorderLight};
      }
    }
  }

  .right {
    display: flex;
    align-content: center;
    justify-content: flex-end;

    > div {
      border-left: 1px solid ${Color.BorderLight};
    }
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-areas: ". . ." ". viewport ." ". . .";

  height: 100vh;

  background: url("https://i.ibb.co/xDg9pw4/grid.png");
`;
