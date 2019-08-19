import * as React from "react";
import * as rndm from "rndm";

import { router } from "../../Router";
import {
  BlockDetail,
  BlockItem,
  BlockTitle,
  Commands,
  Header,
  Heading,
  Link,
  Nav,
  NavDetail,
  NavDivider,
  NavItem,
  PageContainer,
  Row,
  Section,
  Splash,
  Subtitle,
  Title,
  WelcomePage
} from "./Styles";

export class Site extends React.Component<
  {},
  {
    site: any;
    pages: any[];
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      site: undefined,
      pages: []
    };
  }

  public componentDidMount() {
    const sites = JSON.parse(localStorage.getItem("sites") || "[]");
    if (sites) {
      const site = sites.find((s: any) => s.id === router.params.get("site"));
      if (site) {
        const pages: any[] = [];
        for (const pageId of site.pages) {
          const cache = localStorage.getItem(`page.${pageId}`);
          if (cache) {
            const page = JSON.parse(cache);
            pages.push({
              id: page.id,
              title: page.title
            });
          }
        }
        this.setState(() => ({ site, pages }));
      }
    }
  }

  private createPage = () => {
    const id = rndm.base62(10);

    const sites = JSON.parse(localStorage.getItem("sites") || "[]");
    if (sites) {
      for (const site of sites) {
        if (site.id === router.params.get("site")) {
          site.pages.push(id);
        }
      }
      localStorage.setItem("sites", JSON.stringify(sites));
    }

    router.goTo(`/edit/${id}`);
  };

  public render() {
    const { site, pages } = this.state;
    if (!site) {
      return <div>loading...</div>;
    }

    return (
      <PageContainer>
        <WelcomePage>
          <Title>
            <Heading>Site - {site.title}</Heading>
          </Title>
          <Row>
            <Splash>
              <Section>
                <Header>Pages</Header>
                <Nav>
                  {pages.map(page => (
                    <NavItem key={page.id}>
                      - <Link onClick={() => router.goTo(`/edit/${page.id}`)}>{page.title}</Link>
                    </NavItem>
                  ))}
                  <NavDivider />
                  <NavItem>
                    <Link type="button" onClick={this.createPage}>
                      New Page...
                    </Link>
                  </NavItem>
                </Nav>
              </Section>
            </Splash>
            <Commands>
              <Section>
                <Header>Manage Site</Header>
                <Nav>
                  <NavItem>
                    <BlockItem>
                      <BlockTitle>Publishing</BlockTitle>
                      <BlockDetail>Publish your site to your domain.</BlockDetail>
                    </BlockItem>
                  </NavItem>
                  <NavItem>
                    <BlockItem>
                      <BlockTitle>Site Navigation</BlockTitle>
                      <BlockDetail>Menus, Footers, and other navigation elements bring interactivity to your pages.</BlockDetail>
                    </BlockItem>
                  </NavItem>
                  <NavItem>
                    <BlockItem>
                      <BlockTitle>Color theme</BlockTitle>
                      <BlockDetail>Make your site and pages look the way you love.</BlockDetail>
                    </BlockItem>
                  </NavItem>
                </Nav>
              </Section>
              <Section>
                <Header>Learn</Header>
                <Nav>
                  <NavItem>
                    <BlockItem>
                      <BlockTitle>Publishing overview</BlockTitle>
                      <BlockDetail>Rapidly publish and manage your site.</BlockDetail>
                    </BlockItem>
                  </NavItem>
                  <NavItem>
                    <BlockItem>
                      <BlockTitle>Themes</BlockTitle>
                      <BlockDetail>Try some default themes, or learn how to build your own.</BlockDetail>
                    </BlockItem>
                  </NavItem>
                </Nav>
              </Section>
            </Commands>
          </Row>
        </WelcomePage>
      </PageContainer>
    );
  }
}
