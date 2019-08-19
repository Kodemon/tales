import * as React from "react";
import * as rndm from "rndm";

import { router } from "../../Router";
import { Commands, Header, Heading, Link, Nav, NavDetail, NavItem, PageContainer, Row, Section, Splash, Subtitle, Title, WelcomePage } from "./Styles";

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
                      <Link onClick={() => router.goTo(`/edit/${page.id}`)}>{page.title}</Link>
                    </NavItem>
                  ))}
                  <NavItem>
                    <Link type="button" onClick={this.createPage}>
                      New Page
                    </Link>
                  </NavItem>
                </Nav>
              </Section>
            </Splash>
          </Row>
        </WelcomePage>
      </PageContainer>
    );
  }
}
