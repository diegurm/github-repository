import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../components/Container';

import { Loading, Owner, IssuList } from './styles';

export default class Repository extends Component {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);

    this.state = {
      repository: {},
      issues: [],
      loading: true,
    };
  }

  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match?.params.repository);
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      loading: false,
      repository: repository.data,
      issues: issues.data,
    });
  }

  render() {
    const { loading, repository, issues } = this.state;
    return (
      <>
        {loading ? (
          <Loading>Carregando</Loading>
        ) : (
          <Container>
            <Owner>
              <Link to="/">Voltar aos repositórios</Link>
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
              />
              <h1>{repository.name}</h1>
              <p>{repository.description}</p>
            </Owner>

            <IssuList>
              {issues.map(issue => (
                <li key={String(issue.id)}>
                  <img src={issue.user.avatar_url} alt={issue.user.login} />
                  <div>
                    <strong>
                      <a href={issue.html_url}>{issue.title}</a>

                      {issue.labels.map(label => (
                        <span key={String(label.id)}>{label.name}</span>
                      ))}
                    </strong>
                    <p>{issue.user.login}</p>
                  </div>
                </li>
              ))}
            </IssuList>
          </Container>
        )}
      </>
    );
  }
}
