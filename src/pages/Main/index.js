import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';
import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newRepo: '',
      repositories: [],
      error: false,
      loading: false,
    };
  }

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    if (repositories) {
      this.setState({
        repositories: JSON.parse(repositories),
      });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ error: false, newRepo: e.target.value });
  };

  handleSubmit = async e => {
    const { enqueueSnackbar } = this.props;

    try {
      e.preventDefault();

      this.setState({ loading: true });

      const { newRepo, repositories } = this.state;

      if (repositories.find(item => item.name === newRepo)) {
        throw new Error('Repositório duplicado');
      }
      const response = await api.get(`/repos/${newRepo}`);
      if (response === null) {
        throw new Error('Repositório não encontrado');
      }

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
        error: false,
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        autoHideDuration: 3000,
      });

      this.setState({
        loading: false,
        newRepo: '',
        error: true,
      });
    }
  };

  render() {
    const { newRepo, repositories, loading, error } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt /> Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton>
            {loading ? (
              <FaSpinner color="#FFF " size={14} />
            ) : (
              <FaPlus color="#FFF " size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default withSnackbar(Main);
