import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';

import Form from '../Components/Form/Form';
import TextArea from '../Components/Form/TextArea';
import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import * as actions from '../actions';

class NewsAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newsText: '',
            currentRequest: 'REQUEST_NEWS'
        };

        this.onAddNewsClick = this.onAddNewsClick.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
    }

    componentWillMount() {
        this.props.loadNews({ limit: 5, forceLoad: true });
    }

    componentWillReceiveProps(props) {
        let clearStatus = false;
        if(props.newsAdded) {
            clearStatus = true;
            this.setState({ successMessage: 'News item added successfully.' });
        }

        if(props.newsDeleted) {
            clearStatus = true;
            this.setState({ successMessage: 'News item deleted successfully.' });
        }

        if(props.newsSaved) {
            clearStatus = true;
            this.setState({ successMessage: 'News item saved successfully.' });
        }

        if(clearStatus) {
            setTimeout(() => {
                this.props.clearNewsStatus();
                this.setState({ successMessage: undefined });
            }, 5000);
        }
    }

    onNewsTextChange(event) {
        this.setState({ newsText: event.target.value });
    }

    onEditTextChange(event) {
        this.setState({ editText: event.target.value });
    }

    onAddNewsClick(state) {
        this.setState({ currentRequest: 'ADD_NEWS' });
        this.props.addNews(state.newsText);
    }

    onDeleteClick(id) {
        this.setState({ currentRequest: 'DELETE_NEWS' });
        this.props.deleteNews(id);
    }

    onEditClick(item) {
        this.setState({ editItemId: item._id, editText: item.text });
    }

    onSaveClick() {
        this.props.saveNews(this.state.editItemId, this.state.editText);
        this.setState({ currentRequest: 'SAVE_NEWS', editItemId: undefined, editText: undefined });
    }

    render() {
        if(this.props.apiState && this.props.apiState.loading) {
            return 'Loading news, please wait...';
        }

        let statusBar;

        switch(this.state.currentRequest) {
            case 'REQUEST_NEWS':
                statusBar = <ApiStatus apiState={ this.props.apiState } successMessage={ this.state.successMessage } />;
                break;
            case 'ADD_NEWS':
                statusBar = <ApiStatus apiState={ this.props.apiAddState } successMessage={ this.state.successMessage } />;
                break;
            case 'DELETE_NEWS':
                statusBar = <ApiStatus apiState={ this.props.apiDeleteState } successMessage={ this.state.successMessage } />;
                break;
            case 'SAVE_NEWS':
                statusBar = <ApiStatus apiState={ this.props.apiSaveState } successMessage={ this.state.successMessage } />;
                break;
        }

        let renderedNews = this.props.news.map(newsItem => {
            return (<tr key={ newsItem._id }>
                <td>{ moment(newsItem.datePublished).format('YYYY-MM-DD') }</td>
                <td>{ newsItem.poster }</td>
                <td>
                    { this.state.editItemId === newsItem._id ?
                        <TextArea name='newsEditText' value={ this.state.editText } onChange={ this.onEditTextChange.bind(this) } rows='4' /> :
                        newsItem.text }
                </td>
                <td>
                    <div className='btn-group'>
                        { this.state.editItemId === newsItem._id ?
                            <button type='button' className='btn btn-primary' onClick={ this.onSaveClick }>Save</button> :
                            <button type='button' className='btn btn-primary' onClick={ this.onEditClick.bind(this, newsItem) }>Edit</button>
                        }
                        <button type='button' className='btn btn-danger' onClick={ this.onDeleteClick.bind(this, newsItem._id) }>Delete { this.props.apiDeleteState &&
                            this.props.apiDeleteState.loading && <span className='spinner button-spinner' /> }</button>
                    </div>
                </td>
            </tr>);
        });

        return (
            <div className='col-xs-12'>
                { statusBar }
                <Panel title='News administration'>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th className='col-sm-1'>Date</th>
                                <th className='col-sm-1'>Poster</th>
                                <th className='col-sm-8'>Text</th>
                                <th className='col-sm-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { renderedNews }
                        </tbody>
                    </table>
                </Panel>
                <Panel title='Add new news item'>
                    <Form name='newsAdmin' apiLoading={ this.props.apiAddState && this.props.apiAddState.loading } buttonClass='col-sm-offset-2 col-sm-4' buttonText='Add' onSubmit={ this.onAddNewsClick } />
                </Panel>
            </div>);

    }
}

NewsAdmin.displayName = 'NewsAdmin';
NewsAdmin.propTypes = {
    addNews: PropTypes.func,
    apiAddState: PropTypes.object,
    apiDeleteState: PropTypes.object,
    apiSaveState: PropTypes.object,
    apiState: PropTypes.object,
    clearNewsStatus: PropTypes.func,
    deleteNews: PropTypes.func,
    loadNews: PropTypes.func,
    news: PropTypes.array,
    newsAdded: PropTypes.bool,
    newsDeleted: PropTypes.bool,
    newsSaved: PropTypes.bool,
    saveNews: PropTypes.func,
    successMessage: PropTypes.string
};

function mapStateToProps(state) {
    return {
        apiAddState: state.api.ADD_NEWS,
        apiDeleteState: state.api.DELETE_NEWS,
        apiSaveState: state.api.SAVE_NEWS,
        apiState: state.api.REQUEST_NEWS,
        loadNews: state.news.loadNews,
        loading: state.api.loading,
        news: state.news.news,
        newsAdded: state.news.newsAdded,
        newsDeleted: state.news.newsDeleted,
        newsSaved: state.news.newsSaved
    };
}

export default connect(mapStateToProps, actions)(NewsAdmin);
