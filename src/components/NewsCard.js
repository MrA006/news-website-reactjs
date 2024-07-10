import React, { Component } from 'react'

export class NewsCard extends Component {

  
  render() {
    let {title, descrip, imageUrl, url, author, date, source} = this.props;
    
    return (
      <div className="my-3"> 
        <div className="card" >
          <img src={imageUrl} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{descrip}...</p>
            <span className="badge bg-secondary">Source : {source}</span>
            <p className="card-text"><small className="text-muted">article by {author} on {date}</small></p>
            <a href={url} className="btn btn-primary btn-sm btn-dark">Read More</a>
          </div>
        </div>
      </div>
    )
  }
}

export default NewsCard
