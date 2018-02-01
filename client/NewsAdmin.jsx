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

    componentWillUpdate(props) {
        if(props.newsChanged) {
            setTimeout(() => {
                this.props.clearNewsStatus();
            }, 5000);
        }
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
            return (<tr key={ newsItem._id }>
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

        if(this.props.newsChanged) {
            successPanel = (
                <AlertPanel message={ this.props.successMessage } type={ 'success' } />
            );
        }

        if(this.props.apiLoading) {
            content = <div>Loading news from the server...</div>;
        } else if(this.props.apiSuccess === false) {
            content = <AlertPanel type='error' message={ this.props.apiMessage } />;
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
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    clearNewsStatus: PropTypes.func,
    deleteNews: PropTypes.func,
    loadNews: PropTypes.func,
    news: PropTypes.array,
    newsChanged: PropTypes.bool,
    successMessage: PropTypes.string
};

function getApiLoadingStatus(state) {
    if(state.api.REQUEST_NEWS && state.api.REQUEST_NEWS.loading) {
        return true;
    }

    if(state.api.DELETE_NEWS && state.api.DELETE_NEWS.loading) {
        return true;
    }

    return false;
}

function getApiMessage(state) {
    if(state.api.REQUEST_NEWS && state.api.REQUEST_NEWS.message) {
        return state.api.REQUEST_NEWS.message;
    }

    if(state.api.DELETE_NEWS && state.api.DELETE_NEWS.message) {
        return state.api.DELETE_NEWS.message;
    }

    return undefined;
}

function getApiSuccess(state) {
    if(state.api.DELETE_NEWS && state.api.DELETE_NEWS.success) {
        return true;
    }
}

function getSuccessMessage(state) {
    if(state.news.newsSaved) {
        return 'News item added successfully';
    }

    if(state.news.newsDeleted) {
        return 'News item deleted successfully';
    }

    return undefined;
}

function mapStateToProps(state) {
    return {
        apiLoading: getApiLoadingStatus(state),
        apiMessage: getApiMessage(state),
        apiSuccess: getApiSuccess(state),
        loadNews: state.news.loadNews,
        loading: state.api.loading,
        news: state.news.news,
        newsChanged: state.news.newsSaved || state.news.newsDeleted,
        successMessage: getSuccessMessage(state)
    };
}

export default connect(mapStateToProps, actions)(NewsAdmin);
