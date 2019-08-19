import * as React from "react";
import styled from "styled-components";

import { Page } from "Engine/Page";
import { Section } from "Engine/Section";
import { maybe } from "Engine/Utils";

import { router } from "../../Router";
import { Sections } from "./Components/Sections";
import { setTextEditor } from "./Lib/Text";
import { ImageSettings } from "./Settings/Image";
import { OverlaySettings } from "./Settings/Overlay";
import { PageSettings } from "./Settings/Page";
import { RevealSettings } from "./Settings/Reveal";
import { SectionSettings } from "./Settings/Section";
import { TextSettings } from "./Settings/Text";
import { Content, Header, SectionSidebar, SettingSidebar, Wrapper } from "./Styles";

export class Editor extends React.Component<
  {},
  {
    tab: string;
    section?: Section;
    component?: any;
  }
> {
  /**
   * Engine page instance.
   * @type {Page}
   */
  private page: Page;

  /**
   * Page target container element.
   * @type {HTMLDivElement | null}
   */
  private content: HTMLDivElement | null;

  constructor(props: any, state: any) {
    super(props, state);
    this.state = {
      tab: "page",
      section: undefined,
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
    window.page = this.page = new Page(router.params.get("page"), this.content, true)
      .on("ready", this.onReady)
      .on("loaded", this.onLoaded)
      .on("refresh", this.onRefresh)
      .on("edit", this.onEdit)
      .on("section", this.onSection);
  }

  public componentWillUnmount() {
    this.page.off("ready", this.onReady);
    this.page.off("loaded", this.onLoaded);
    this.page.off("refresh", this.onRefresh);
    this.page.off("edit", this.onEdit);
    this.page.off("section", this.onSection);
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
    this.page.sections.forEach(section => this.setTextEditors(section));
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
  private onEdit = (section: Section, component: any) => {
    this.setState(() => ({ tab: component ? "component" : "section", section, component }));
  };

  /**
   * Triggers when a section has been updated.
   *
   * @param section
   */
  private onSection = (section: Section) => {
    const sectionId = maybe(this.state, "section.id");
    const componentId = maybe(this.state, "component.id");
    if (sectionId && sectionId === section.id) {
      this.setState(() => ({ section, component: section.components.find(i => i.id === componentId) }));
    } else {
      this.forceUpdate();
    }
    this.setTextEditors(section);
  };

  /*
  |--------------------------------------------------------------------------------
  | Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Sets a text editor instance on any text components in the
   * provided section.
   *
   * @param section
   */
  private setTextEditors(section: Section) {
    section.components.forEach(component => {
      if (component.type === "text") {
        setTextEditor(component);
      }
    });
  }

  /*
  |--------------------------------------------------------------------------------
  | Renderers
  |--------------------------------------------------------------------------------
  */

  public render() {
    return (
      <Wrapper>
        <SectionSidebar>
          <Header>
            <h1>Sections</h1>
            <div>
              <button
                onClick={() => {
                  if (this.page) {
                    this.page.flush();
                    this.setState(() => ({ section: undefined, component: undefined }));
                  }
                }}
              >
                <i className="fa fa-trash" />
              </button>
              <button
                onClick={() => {
                  if (this.page) {
                    this.setState(() => ({ section: this.page.addSection({}, true) }));
                  }
                }}
              >
                <i className="fa fa-plus" />
              </button>
            </div>
          </Header>
          {this.page && <Sections page={this.page} active={maybe(this.state, "component.id", "")} editComponent={this.onEdit} />}
        </SectionSidebar>
        <Content ref={c => (this.content = c)} />
        <SettingSidebar>{this.renderTabs()}</SettingSidebar>
      </Wrapper>
    );
  }

  private renderTabs() {
    const { tab, section, component } = this.state;
    return (
      <React.Fragment>
        <Tabs>
          <span
            className={tab === "page" ? "active" : ""}
            onClick={() => {
              this.setState(() => ({ tab: "page" }));
            }}
          >
            Page
          </span>
          {
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
          }
          {
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
          }
        </Tabs>
        {tab === "page" && this.page && <PageSettings page={this.page} />}
        {tab === "section" && this.state.section && <SectionSettings section={this.state.section} />}
        {tab === "component" && this.state.section && this.state.component && this.renderComponentSettings(this.state.section, this.state.component)}
      </React.Fragment>
    );
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
      case "reveal": {
        return <RevealSettings section={section} component={component} />;
      }
    }
  }
}

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
