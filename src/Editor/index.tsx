import * as React from "react";

import { Page } from "Engine/Page";
import { Section } from "Engine/Section";
import { maybe } from "Engine/Utils";

import { Sections } from "./Components/Sections";
import { ImageSettings } from "./Settings/Image";
import { SectionSettings } from "./Settings/Section";
import { TextSettings } from "./Settings/Text";
import { Content, Header, Scenes, Settings, Wrapper } from "./Styles";

export class Editor extends React.Component<
  {},
  {
    section?: Section;
    component?: any;
  }
> {
  private content: HTMLDivElement | null;
  private page: Page;

  constructor(props: any, state: any) {
    super(props, state);
    this.state = {
      section: undefined,
      component: undefined
    };
  }

  /**
   * @should create a new page
   * @should load cached page if exists
   * @should update editor on section update events
   */
  public componentDidMount() {
    this.page = new Page(this.content)
      .on("ready", () => {
        const cache = localStorage.getItem("page");
        if (cache) {
          this.page.load(JSON.parse(cache));
        }
      })
      .on("loaded", () => {
        this.forceUpdate();
      })
      .on("section", (section: Section) => {
        const sectionId = maybe(this.state, "section.id");
        const componentId = maybe(this.state, "component.id");
        if (sectionId && sectionId === section.id) {
          this.setState(() => ({ section, component: section.components.find(i => i.id === componentId) }));
        } else {
          this.forceUpdate();
        }
      })
      .on("edit", (section: Section, component: any) => {
        this.setState(() => ({ section, component }));
      });
  }

  public editComponent = (section: Section, component: any) => {
    this.setState(() => ({ section, component }));
  };

  public render() {
    // return <Content ref={c => (this.content = c)} style={{height: "100%", width: "100%"}} />;
    return (
      <Wrapper>
        <Scenes>
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
                    this.setState(() => ({ section: this.page.addSection() }));
                  }
                }}
              >
                <i className="fa fa-plus" />
              </button>
            </div>
          </Header>
          {this.page && <Sections page={this.page} editComponent={this.editComponent} />}
        </Scenes>
        <Content ref={c => (this.content = c)} />
        <Settings>
          {this.state.section && <SectionSettings section={this.state.section} />}
          {this.state.section && this.state.component && this.renderComponentSettings(this.state.section, this.state.component)}
        </Settings>
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
