import * as React from "react";
import * as rndm from "rndm";

import { router } from "../../Router";
import { Commands, Header, Heading, Link, Nav, NavDetail, NavItem, PageContainer, Row, Section, Splash, Subtitle, Title, WelcomePage } from "./Styles";

export class Dashboard extends React.Component<
  {},
  {
    sites: any[];
  }
> {
  private sites = JSON.parse(localStorage.getItem("sites") || "[]");

  private createSite = () => {
    const id = rndm.base62(10);
    this.sites.push({
      id,
      title: "Untitled Site",
      pages: []
    });
    localStorage.setItem("sites", JSON.stringify(this.sites));
    router.goTo(`/sites/${id}`);
  };

  public render() {
    return (
      <PageContainer>
        <WelcomePage>
          <Title>
            <Heading>Tales</Heading>
            <Subtitle>Tell your story</Subtitle>
          </Title>
          <Row>
            <Splash>
              <Section>
                <Header>Start</Header>
                <Nav>
                  <NavItem>
                    <Link type="button" onClick={this.createSite}>
                      New Site
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link type="button" onClick={this.createSite}>
                      Open Site...
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link type="button" onClick={this.createSite}>
                      Import existing Site...
                    </Link>
                  </NavItem>
                </Nav>
              </Section>
              <Section>
                <Header>Recent</Header>
                <Nav>
                  {this.sites.map((site: any) => (
                    <NavItem key={site.id}>
                      <Link onClick={() => router.goTo(`/sites/${site.id}`)}>{site.title}</Link>
                      <NavDetail>{`/sites/${site.id}`}</NavDetail>
                    </NavItem>
                  ))}
                  <NavItem key="more">
                    <Link onClick={() => window.alert("no")}>More...</Link>
                  </NavItem>
                </Nav>
              </Section>
            </Splash>
            <Commands>
              <Section>
                <Header>Customize</Header>
              </Section>
            </Commands>
          </Row>
        </WelcomePage>
      </PageContainer>
    );
  }
}
