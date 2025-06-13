import React, { Component } from "react";
import NewsCard from "./NewsCard";
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {
  constructor(props) {
    super(props);
    const { category, pageSize } = this.props;

    this.state = {
      articles: [],
      page: 1,
      loading: false,
      category: category,
      pageSize: pageSize,
      numResults: 0,
      error: null,
      hasMore: true
    };
  }

  async fetchNews() {
    try {
      this.props.setLoadingProgress(0);
      this.setState({ loading: true, error: null });
      this.props.setLoadingProgress(30);
      
      const { category, pageSize, page } = this.state;
      // GNews API parameters
      const apiUrl = `https://gnews.io/api/v4/top-headlines?category=${category.toLowerCase()}&apikey=433533a6576b07756649a91db92f9bb0&country=us&max=${pageSize}&page=${page}`;
      
      const response = await fetch(apiUrl);
      
      // Handle API errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      this.props.setLoadingProgress(60);
      const data = await response.json();
      this.props.setLoadingProgress(90);

      // Handle GNews API errors
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }

      // GNews uses "image" instead of "urlToImage"
      const formattedArticles = data.articles.map(article => ({
        ...article,
        imageUrl: article.image || "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/screenshot-2024-07-07-100125-668a9fbe5543a.png?crop=0.998xw:1.00xh;0.00163xw,0&resize=1200:*",
        source: article.source?.name || "Unknown source",
        publishedAt: article.publishedAt || new Date().toISOString()
      }));

      // GNews free tier only allows 10 pages max
      const hasMore = data.articles.length > 0 && page < 10;
      
      this.setState(prevState => ({
        articles: prevState.page === 1 
          ? formattedArticles 
          : [...prevState.articles, ...formattedArticles],
        numResults: data.totalArticles || 0,
        loading: false,
        hasMore
      }));
      
    } catch (error) {
      console.error("News fetch error:", error);
      this.setState({
        error: error.message || "Failed to fetch news",
        loading: false,
        hasMore: false
      });
    } finally {
      this.props.setLoadingProgress(100);
    }
  }

  componentDidMount() {
    this.fetchNews();
  }

  Card = (info) => {
    return (
      <div className="col-md-4 mb-4" key={`${info.url}-${Date.now()}`}>
        <NewsCard
          title={info.title}
          descrip={info.description}
          imageUrl={info.imageUrl}
          url={info.url}
          date={new Date(info.publishedAt).toUTCString()}
          author={info.author || "Unknown"}
          source={info.source}
        />
      </div>
    );
  };

  async componentDidUpdate(prevProps) {
    if (this.props.category !== prevProps.category) {
      await this.setState({
        category: this.props.category,
        page: 1,
        articles: [],
        hasMore: true
      });
      this.fetchNews();
    }
  }
  
  fetchMoreData = () => {
    // Prevent fetching beyond GNews free tier limits
    if (this.state.page >= 10) {
      this.setState({ hasMore: false });
      return;
    }
    
    this.setState(
      prevState => ({ page: prevState.page + 1 }),
      this.fetchNews
    );
  };

  render() {
    const { articles, loading, error, hasMore } = this.state;
    
    return (
      <div className="container my-3">
        <h2 className="text-center mb-4">Headlines For Today</h2>
        
        {error && (
          <div className="alert alert-danger text-center">
            <strong>Error:</strong> {error}
            <div className="mt-2">
              <button 
                className="btn btn-sm btn-warning"
                onClick={() => {
                  this.setState({ page: 1, articles: [], error: null }, () => {
                    this.fetchNews();
                  });
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {loading && !error && (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="alert alert-info text-center">
            No articles found. Try a different category or check back later.
          </div>
        )}

        {!error && articles.length > 0 && (
          <InfiniteScroll
            dataLength={articles.length}
            next={this.fetchMoreData}
            hasMore={hasMore}
            loader={
              <div className="d-flex justify-content-center my-4">
                <div className="spinner-border text-secondary" role="status">
                  <span className="visually-hidden">Loading more...</span>
                </div>
              </div>
            }
            endMessage={
              <div className="text-center mt-4 p-3 bg-light rounded">
                <p className="mb-0">
                  <b>You've reached the end of available articles</b>
                </p>
                {this.state.page >= 10 && (
                  <p className="text-muted mt-2">
                    <small>
                      Free API tier limited to 10 pages. Showing {articles.length} of {this.state.numResults} articles.
                    </small>
                  </p>
                )}
              </div>
            }
          >
            <div className="row">
              {articles.map((article) => (
                <this.Card
                  key={`${article.url}-${Date.now()}`}
                  title={article.title || "No title available"}
                  description={article.description || ""}
                  imageUrl={article.imageUrl}
                  url={article.url || "#"}
                  date={article.publishedAt}
                  author={article.author || "Unknown"}
                  source={article.source}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    );
  }
}