import React, { Component } from 'react';
import logo from './logo.svg';
import { Button, Table, Divider, Tag, Row, Col, Popconfirm } from 'antd';
import axios from 'axios';
import './App.scss';
import ApplicationForm from './components/ApplicationForm';
import ApplicationViewer from './components/ApplicationViewer';
import * as FormAction from './app/FormAction';
import { connect } from 'react-redux';
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      applications: [],
      application: {},
      viewerVisible: false
    }
  }

  componentWillMount() {
    this._getApplications();
  }

  _getApplications = () => {
    axios.get('/applications', { withCredentials: true, changeOrigin: true }).then((applications => {
      this.setState({ applications: applications.data })
    })).catch((error) => {

    });
  }

  handleEditButtonOnClick = (application) => {
    this.setState({application})
    this.props.open();
  }

  handleCreateButtonOnClick = (application) => {
    this.setState({application: {}})
    this.props.open();
  }

  handleDeleteButtonOnClick = (application) => {
    axios.delete(`/applications/${application.client_id}`).then(() => {
      this._getApplications()
    }).catch(error => {

    })
  }

  handleShowButtonOnClick = (application) => {
    this.setState({
      viewerVisible: true,
      application
    })
  }

  columns = [{
    title: 'Client ID',
    dataIndex: 'client_id',
    key: 'client_id'
  }, {
    title: 'Application Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <span>{text}</span>,
  }, {
    title: 'Scopes',
    key: 'scope',
    dataIndex: 'scope',
    render: tags => (
      <span>
        {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
      </span>
    ),
  }, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <Button onClick={this.handleShowButtonOnClick.bind(this, record)}>Show</Button>
        <Divider type="vertical" />
        <Button onClick={this.handleEditButtonOnClick.bind(this, record)}>Edit</Button>
        <Divider type="vertical" />
        <Popconfirm title="Are you sure delete this application?" onConfirm={this.handleDeleteButtonOnClick.bind(this, record)} onCancel={() => {}} okText="Yes" cancelText="No">
          <Button type="danger">Delete</Button>
        </Popconfirm>
      </span>
    ),
  }];

  render() {
    return (
      <div className="App">
        <Row className="header" type="flex">
          <Col className="header-logo-banner" span={12}>
            <img className="header-logo-banner__img" src={logo} alt="watchdog log" />
            WatchDog
          </Col>
          <Col className="header-menu" span={12}>
            <Button onClick={this.handleCreateButtonOnClick} type="primary">Create</Button>
          </Col>
        </Row>
        <div className="main">
          <Table rowKey="client_id" dataSource={this.state.applications} columns={this.columns} />
        </div>
        <ApplicationForm refreshApplications={this._getApplications} visible={this.props.visible} application={this.state.application} close={() => { this.props.close({}) }} />
        <ApplicationViewer handleClose={() => {this.setState({viewerVisible: false})}} visible={this.state.viewerVisible} application={this.state.application} />
      </div>
    );
  }
}

const formStateToProps = state => ({
  ...state
})

export default connect(formStateToProps, FormAction)(App);
