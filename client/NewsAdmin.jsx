import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _ from 'underscore';
import moment from 'moment';

import AlertPanel from './SiteComponents/AlertPanel.jsx';
import TextArea from './FormComponents/TextArea.jsx';

import * as actions from './actions';

class NewsAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newsText: ''
        };
    }

    componentWillMount() {
        this.props.loadNews({ forceLoad: true });
    }

    onNewsTextChange(event) {
        this.setState({ newsText: event.target.value });
    }

    onAddNews(event) {
        event.preventDefault();

        this.props.addNews(this.state.newsText);

        this.setState({ newsText: '' });
    }

    onDeleteClick(id) {
        this.props.deleteNews(id);
    }

    render() {
        let content = null;

        var renderedNews = _.map(this.props.news, newsItem => {
            return (<tr>
                <td>{ moment(newsItem.datePublished).format('YYYY-MM-DD') }</td>
                <td>{ newsItem.poster }</td>
                <td>{ newsItem.text }</td>
                <td>
                    <div className='btn-group'>
                        <button type='button' className='btn btn-primary'>Edit</button>
                        <button type='button' className='btn btn-danger' onClick={ this.onDeleteClick.bind(this, newsItem._id) }>Delete</button>
                    </div>
                </td>
            </tr>);
        });

        let successPanel = null;

        if(this.props.newsSaved) {
            setTimeout(() => {
                this.props.clearNewsStatus();
            }, 5000);
            successPanel = (
                <AlertPanel message='News added successfully' type={ 'success' } />
            );

            this.props.loadNews({ forceLoad: true });
        }

        if(this.props.loading) {
            content = <div>Loading news from the server...</div>;
        } else if(this.props.apiError) {
            content = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            content = (
                <div>
                    { successPanel }
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Poster</th>
                                <th>Text</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { renderedNews }
                        </tbody>
                    </table>

                    <form className='form'>
                        <TextArea name='newsText' label='Add news item' value={ this.state.newsText } onChange={ this.onNewsTextChange.bind(this) } />

                        <button type='submit' className='btn btn-primary' onClick={ this.onAddNews.bind(this) }>Add</button>
                    </form>
                </div>);
        }

        return content;
    }
}

NewsAdmin.displayName = 'NewsAdmin';
NewsAdmin.propTypes = {
    addNews: PropTypes.func,
    apiError: PropTypes.string,
    clearNewsStatus: PropTypes.func,
    deleteNews: PropTypes.func,
    loadNews: PropTypes.func,
    loading: PropTypes.bool,
    news: PropTypes.array,
    newsSaved: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        loadNews: state.news.loadNews,
        loading: state.api.loading,
        news: state.news.news,
        newsSaved: state.news.newsSaved
    };
}

export default connect(mapStateToProps, actions)(NewsAdmin);
