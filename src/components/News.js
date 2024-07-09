import React, { Component } from 'react';
import NewsCard from './NewsCard';

export default class News extends Component {
  constructor(props) {
    super(props);
    let { category, pageSize } = this.props;

    this.state = {
      articles: [],
      page: 1,
      loading: false,
      category: category,
      pageSize: pageSize,
      numResults: 0,
    };
  }

  async fetchNews() {
    this.setState({ loading: true });
    const { category, pageSize, page } = this.state;
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=0cc4346ecdd649908a7e19cf82e9ccc7&pageSize=${pageSize}&page=${page}`;
    const data = await fetch(apiUrl);
    const parse = await data.json();
    this.setState({
      articles: parse.articles,
      numResults: parse.totalResults,
      loading: false,
    });
  }

  componentDidMount() {
    this.fetchNews();
  }

  handleNext = async () => {
    if (this.state.page + 1 <= Math.ceil(this.state.numResults / this.state.pageSize)) {
      this.setState({ loading: true });
      let apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${this.state.category}&apiKey=0cc4346ecdd649908a7e19cf82e9ccc7&pageSize=${this.state.pageSize}&page=${this.state.page + 1}`;
      let data = await fetch(apiUrl);
      let parse = await data.json();
      this.setState({
        articles: parse.articles,
        page: this.state.page + 1,
        loading: false,
      });
    }
  }

  handlePrev = async () => {
    if (this.state.page - 1 > 0) {
      this.setState({ loading: true });
      let apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${this.state.category}&apiKey=0cc4346ecdd649908a7e19cf82e9ccc7&pageSize=${this.state.pageSize}&page=${this.state.page - 1}`;
      let data = await fetch(apiUrl);
      let parse = await data.json();
      this.setState({
        articles: parse.articles,
        page: this.state.page - 1,
        loading: false,
      });
    }
  }

  Card = (info) => {
    return (
      <div className='col-md-4' key={info.url}>
        <NewsCard
          title={info.title}
          descrip={info.description}
          imageUrl={info.imageUrl}
          url={info.url}
          date={info.date}
          author={info.author}
          source={info.source}
        />
      </div>
    );
  };





  componentDidUpdate(prevProps) {
    if (this.props.category !== prevProps.category) {
      this.setState(
        {
          category: this.props.category,
          page: 1,
          articles: [],
        },
        () => this.fetchNews()
      );
    }
  }

  render() {
    return (
      <div className='container my-3'>
        <h2 className='text-center'>Headlines For Today</h2>
        {this.state.loading && (
          <div className='spinner-border text-center' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        )}
        <div className='row'>
          {this.state.articles.map((element) => (
            <this.Card
              key={element.url}
              imageUrl={element.urlToImage ? element.urlToImage : 'https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/screenshot-2024-07-07-100125-668a9fbe5543a.png?crop=0.998xw:1.00xh;0.00163xw,0&resize=1200:*'}
              url={element.url ? element.url : ''}
              title={element.title ? element.title : ''}
              description={element.description ? element.description.slice(0, 55) : ''}
              date={new Date(element.publishedAt).toUTCString()}
              author={element.author? element.author : 'Unknown'}
              source={element.source.name? element.source.name : 'Unknown'}

            />
          ))}
        </div>
        <div className='d-flex justify-content-between'>
          <button
            type='button'
            className='btn btn-dark'
            onClick={this.handlePrev}
            disabled={this.state.page <= 1}
          >
            &larr; Prev
          </button>
          <button
            type='button'
            className='btn btn-dark'
            onClick={this.handleNext}
            disabled={this.state.page + 1 > Math.ceil(this.state.numResults / this.state.pageSize)}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}
