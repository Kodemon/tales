import * as React from "react";

import { Page } from "Engine/Page";
import { Section } from "Engine/Section";
import { maybe } from "Engine/Utils";

import { Sections } from "./Components/Sections";
import { setTextEditor } from "./Lib/Text";
import { ImageSettings } from "./Settings/Image";
import { PageSettings } from "./Settings/Page";
import { SectionSettings } from "./Settings/Section";
import { TextSettings } from "./Settings/Text";
import { Content, Header, SectionSidebar, SettingSidebar, Wrapper } from "./Styles";

declare global {
  interface Window {
    page: Page;
  }
}

export class Editor extends React.Component<
  {},
  {
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
    window.page = this.page = new Page(this.content, true)
      .on("ready", this.onReady)
      .on("loaded", this.onLoaded)
      .on("edit", this.onEdit)
      .on("section", this.onSection);
  }

  public componentWillUnmount() {
    this.page.off("ready", this.onReady);
    this.page.off("loaded", this.onLoaded);
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
    const cache = localStorage.getItem("page");
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
   * Sets the current editable component.
   *
   * @param section
   * @param component
   */
  private onEdit = (section: Section, component: any) => {
    this.setState(() => ({ section, component }));
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
        <SettingSidebar>
          {this.page && <PageSettings page={this.page} />}
          {this.state.section && <SectionSettings section={this.state.section} />}
          {this.state.section && this.state.component && this.renderComponentSettings(this.state.section, this.state.component)}
        </SettingSidebar>
      </Wrapper>
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
    }
  }
}
