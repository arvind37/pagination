import React, { Component } from 'react';

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPage: 1,
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        this.setState({ data, loading: false });
      })
      .catch(error => {
        this.setState({ error: error.message, loading: false });
        alert('Failed to fetch data');
      });
  };

  handleNextPage = () => {
    const { currentPage } = this.state;
    if (currentPage < Math.ceil(this.state.data.length / 10)) {
      this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
    }
  };

  handlePrevPage = () => {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      this.setState(prevState => ({ currentPage: prevState.currentPage - 1 }));
    }
  };

  render() {
    const { data, currentPage, loading, error } = this.state;
    const startIndex = (currentPage - 1) * 10;
    const endIndex = Math.min(startIndex + 10, data.length);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(startIndex, endIndex).map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button disabled={currentPage === 1} onClick={this.handlePrevPage}>Previous</button>
          <span> Page {currentPage} </span>
          <button disabled={currentPage === Math.ceil(data.length / 10)} onClick={this.handleNextPage}>Next</button>
        </div>
      </div>
    );
  }
}

export default Pagination;
