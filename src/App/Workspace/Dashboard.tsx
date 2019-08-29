import * as React from "react";
import * as rndm from "rndm";

import { config } from "Config";
import { router } from "../../Router";
import { listRepos } from "../Services/Git";
import { Commands, GitHubLink, Header, Heading, Link, Nav, NavDetail, NavItem, NavItemLoader, PageContainer, Row, Section, Splash, Subtitle, Title, WelcomePage } from "./Styles";

export class Dashboard extends React.Component<
  {},
  {
    sites: any[];
    hasLoaded: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      sites: [],
      hasLoaded: false
    };
  }
  // private sites = JSON.parse(localStorage.getItem("sites") || "[]");
  private token = localStorage.getItem("token");

  public async componentDidMount() {
    const token = router.query.get("access_token") || localStorage.getItem("token");
    if (token) {
      localStorage.setItem("token", token);
      const repos = await listRepos(token);
      this.setState(() => ({
        sites: repos,
        hasLoaded: true
      }));
    }
  }

  private selectSite = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const repos = await listRepos(token);
      this.setState(() => ({
        sites: repos
      }));
    }
  };

  private createSite = () => {
    const id = rndm.base62(10);
    const sites: any[] = JSON.parse(localStorage.getItem("sites") || "[]");
    sites.push({
      id,
      title: "Untitled Site",
      pages: []
    });
    localStorage.setItem("sites", JSON.stringify(sites));
    router.goTo(`/sites/${id}`);
  };

  public render() {
    const token = localStorage.getItem("token");
    const { sites, hasLoaded } = this.state;

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
                    <Link type="button" onClick={this.selectSite}>
                      Open Site...
                    </Link>
                  </NavItem>
                </Nav>
              </Section>
              {token ? (
                <Section>
                  <Header>Published Sites</Header>
                  {token && !hasLoaded ? (
                    <Nav>
                      <NavItemLoader />
                      <NavItemLoader />
                      <NavItemLoader />
                    </Nav>
                  ) : (
                    <Nav>
                      {sites.map((site: any) => (
                        <NavItem key={site.id}>
                          <Link onClick={() => router.goTo(`/sites/${site.id}`)}>{site.description}</Link>
                          <NavDetail>{`/sites/${site.name}`}</NavDetail>
                        </NavItem>
                      ))}
                    </Nav>
                  )}
                </Section>
              ) : (
                <Section>
                  <Header>Authorization Required</Header>
                  <p>You own your content.</p>
                  <p>
                    To do this, we utilize a GitHub repository for each site you create. Repositories are private, free, and securely store all of your data and, ultimately, your
                    published site.
                  </p>
                  <p>To make a start, authorize Tails to access GitHub on your behalf.</p>
                  <GitHubLink href={`${config.api}/auth`}>
                    <i className="fa fa-github"></i>Sign in with GitHub
                  </GitHubLink>
                </Section>
              )}
            </Splash>
            <Commands></Commands>
          </Row>
        </WelcomePage>
      </PageContainer>
    );
  }
}
