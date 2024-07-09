import React, { Component } from 'react'
import NewsCard from './NewsCard'

export default class News extends Component {

  constructor(){
    super();
    this.state = {
      articles : [],
      page: 1,
      
    }
  }


  async componentDidMount(){
    let apiUrl = 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=0cc4346ecdd649908a7e19cf82e9ccc7&PageSize=20&page=1';
    let data = await fetch(apiUrl);
    let parse = await data.json();
    this.setState({
      articles: parse.articles,
      numResults: parse.totalResults
    });
    
  }

  handleNext = async () => {
    
    if(this.state.page + 1 <= Math.ceil(this.state.numResults/20)){
    let apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=0cc4346ecdd649908a7e19cf82e9ccc7&PageSize=20&page=${this.state.page + 1}`;
    console.log(apiUrl);
    let data = await fetch(apiUrl);
    let parse = await data.json();
    this.setState({
      articles: parse.articles
    });
    
      this.setState({ page : this.state.page + 1});
    }
    
  }

  handlePrev = async () => {
    
    if(this.state.page - 1 > 0){
    let apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=0cc4346ecdd649908a7e19cf82e9ccc7&PageSize=20&page=${this.state.page - 1}`;
    let data = await fetch(apiUrl);
    let parse = await data.json();
    this.setState({
      articles: parse.articles
    });
    
      this.setState({ page : this.state.page - 1});
    }
    
  }

  Card = (info) => {
    return(
      <div className='col-md-4 '>
      <NewsCard title={info.title} descrip={info.description} imageUrl={info.imageUrl} url={info.url}/>
      </div>
    )
  }

  render() {
    return (
      <div className='container my-3'>
        <h2 >headLines For Today </h2>
        <div className='row'>
         {this.state.articles.map(
          (element) => {
            return (<this.Card key={element.url} imageUrl={element.urlToImage?element.urlToImage:'https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/screenshot-2024-07-07-100125-668a9fbe5543a.png?crop=0.998xw:1.00xh;0.00163xw,0&resize=1200:*'} url={element.url?element.url:''} title={element.title?element.title:''} description={element.description?element.description.slice(0,55):''}/>);
          }
         )}
        
        </div>
        <div className='d-flex justify-content-between'>

        <button type="button" className="btn btn-dark" onClick={this.handlePrev} disabled={this.state.page <= 1}>&larr; Prev</button>
        <button type="button" className="btn btn-dark" onClick={this.handleNext} disabled={this.state.page + 1 > Math.ceil(this.state.numResults/20)}>Next &rarr;</button>
        </div>
      </div>
    )
  }
}

