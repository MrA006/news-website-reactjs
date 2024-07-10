import React, { Component } from "react";
import NewsCard from "./NewsCard";
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {
  constructor(props) {
    super(props);
    const { category, pageSize} = this.props;

    this.state = {
      articles: [],
      page: 1,
      loading: false,
      category: category,
      pageSize: pageSize,
      numResults: 0
    };
  }

  async fetchNews() {
    
    //if (this.state.loading) return;
    this.props.setLoadingProgress(0);
    
    this.props.setLoadingProgress(30);
    this.setState({ loading: true });
    const { category, pageSize, page } = this.state;
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=0cc4346ecdd649908a7e19cf82e9ccc7&pageSize=${pageSize}&page=${page}`;
    
    const data = await fetch(apiUrl);
    this.props.setLoadingProgress(60);

    const parse = await data.json();
    this.props.setLoadingProgress(90);

    await this.setState((prevState) => ({
      articles: prevState.page === 1 ? parse.articles : prevState.articles.concat(parse.articles),
      numResults: parse.totalResults,
      loading: false,
    }));
    this.props.setLoadingProgress(100);

  }
  

  componentDidMount() {
    console.log('here mount');
    
    this.fetchNews();
  }

  // handleNext = async () => {
  //   if (
  //     this.state.page + 1 <=
  //     Math.ceil(this.state.numResults / this.state.pageSize)
  //   ) {
  //     this.setState(
  //       (prevState) => ({ page: prevState.page + 1 }),
  //       this.fetchNews
  //     );
  //   }
  // };

  // handlePrev = async () => {
  //   if (this.state.page > 1) {
  //     this.setState(
  //       (prevState) => ({ page: prevState.page - 1 }),
  //       this.fetchNews
  //     );
  //     }
  // };

  Card = (info) => {
    //console.log(info.url);
    return (
      <div className="col-md-4" key={info.url}>
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

  async componentDidUpdate(prevProps) {
    if (this.props.category !== prevProps.category) {
      await this.setState({
        category: this.props.category,
        page: 1,
        articles: [],
      });
      this.fetchNews();
    }
    // } else if (this.state.page !== prevState.page) {
    //   this.fetchNews();
    // }
  }
  
  fetchMoreData = () => {
    if (this.state.page < Math.ceil(this.state.numResults / this.state.pageSize)) {
      this.setState(
        (prevState) => ({ page: prevState.page + 1 }),
        this.fetchNews
      );
    }
  };
  

  render() {
    return (
      <div className="container my-3">
        <h2 className="text-center">Headlines For Today</h2>
        {this.state.loading && (
          <div
            className="spinner-border"
            style={{ position: "absolute", left: "50%" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        )}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={
            this.state.page + 1 <=
            Math.ceil(this.state.numResults / this.state.pageSize)
          }
          loader={
            <div
              className="spinner-border container my-3"
              style={{ position: "absolute", left: "50%" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Results : {this.state.numResults}</b>
            </p>
          }
        >
          <div className="row container">
            {this.state.articles.map(
              (element, index) =>
                element.url !== "https://removed.com" && (
                  <this.Card
                    key={element.url ? element.url : index}
                    imageUrl={
                      element.urlToImage
                        ? element.urlToImage
                        : "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/screenshot-2024-07-07-100125-668a9fbe5543a.png?crop=0.998xw:1.00xh;0.00163xw,0&resize=1200:*"
                    }
                    url={element.url ? element.url : ""}
                    title={element.title ? element.title : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 55)
                        : ""
                    }
                    date={new Date(element.publishedAt).toUTCString()}
                    author={element.author ? element.author : "Unknown"}
                    source={
                      element.source.name ? element.source.name : "Unknown"
                    }
                  />
                )
            )}
          </div>
        </InfiniteScroll>
        {/* <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrev}
            disabled={this.state.page <= 1}
          >
            &larr; Prev
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={this.handleNext}
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.numResults / this.state.pageSize)
            }
          >
            Next &rarr;
          </button>
        </div> */}
      </div>
    );
  }
}
