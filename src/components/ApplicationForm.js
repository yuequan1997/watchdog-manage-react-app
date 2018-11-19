import React from 'react';
import { Modal, Form, Input, Tag, Tooltip, Icon } from 'antd';
import axios from 'axios';
const FormItem = Form.Item;
const DEFAULT_STATE = {
  clientId: null,
  name: null,
  redirectUri: [],
  scope: [],
  redirectUriInputValue: '',
  redirectUriInputVisible: false,
  scopeInputValue: '',
  scopeInputVisible: false
}
const _ObjectIsEmpty = (obj) => {
  return Object.keys(obj).length === 0
}
class ApplicationForm extends React.Component {

  static defaultProps = {
    application: {},
    visible: false
  }

  constructor(props){
    super(props)
    this.state = DEFAULT_STATE
  }

  handleOkButtonOnClick = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          name: values.name,
          redirect_uri: this.state.redirectUri,
          scope: this.state.scope
        }
        if(this.state.clientId){
          axios.put(`/applications/${this.state.clientId}`, params).then((res) => {
            this.props.refreshApplications();
          }).catch(error => {
    
          })
        }else{
          axios.post('/applications', params).then((res) => {
            this.props.refreshApplications();
          }).catch(error => {
            
          })
        }
    
        this.props.close({})
        this.setState(DEFAULT_STATE)
      }
    });
  }

  handleCancelButtonOnClick = () => {
    this.props.close({})
    this.setState(DEFAULT_STATE)
  }

  handleNameOnChange = (e) => {
    this.setState({name: e.target.value})
  }

  componentWillReceiveProps(props){
    if(props.visible){
      const clientId =  _ObjectIsEmpty(props.application) ? null : props.application.client_id
      const name =  _ObjectIsEmpty(props.application) ? null : props.application.name
      const redirectUri =  _ObjectIsEmpty(props.application) ? [] : props.application.redirect_uri
      const scope = _ObjectIsEmpty(props.application) ? [] : props.application.scope
      this.setState({
        clientId,
        name: name,
        redirectUri,
        scope: scope
      })
    }
  }

  
  handleTagConfirm = (tags, tag,afterEvent = () => {}) => {
    if (tag && tags.indexOf(tag) === -1) {
      tags = [...tags, tag];
    }
    afterEvent(tags)
  }

  handleRedirectUriConfirm = () => {
    this.handleTagConfirm(this.state.redirectUri, this.state.redirectUriInputValue, (tags) => {
      this.setState({
        redirectUri: tags,
        redirectUriInputValue: '',
        redirectUriInputVisible: false
      })
    })
  }

  handleScopeConfirm = () => {
    this.handleTagConfirm(this.state.scope, this.state.scopeInputValue, (tags) => {
      this.setState({
        scope: tags,
        scopeInputValue: '',
        scopeInputVisible: false
      })
    })
  }

  handleTagsRemove(index, array, afterEvent){
    array.splice(index, 1)
    afterEvent(array)
  }

  handleRedirectUriRemove = (index, tag) => {
    this.handleTagsRemove(index, this.state.redirectUri, (redirectUri) => {
      this.setState({redirectUri})
    })
  }

  handleScopeRemove = (index, tag) => {
    this.handleTagsRemove(index, this.state.scope, (scope) => {
      debugger
      this.setState({scope})
    })
  }

  renderTags = (tags, options = {}) => {
    options.handleClose =  options.handleClose || ((index, tag) => {})
    options.color = options.color  || 'cyan'
    return tags.map((tag, index) => {
      const isLongTag = tag.length > 30;
      const tagElem = (
        <Tag color={options.color} key={tag} closable={true} onClose={()=> { options.handleClose(index, tag) }}>
          {isLongTag ? `${tag.slice(0, 30)}...` : tag}
        </Tag>
      );
      return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
    })
  }

  render() {
    const visible = this.props.visible
    const title = Object.keys(this.props.application).length === 0 ? 'Create' : "Update";
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const {redirectUriInputValue, redirectUriInputVisible, scopeInputVisible, scopeInputValue} = this.state
    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOkButtonOnClick}
          onCancel={this.handleCancelButtonOnClick}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="Name">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input your app name!' }]
              })(
                <Input required={true} onChange={this.handleNameOnChange} placeholder="Please enter an app name" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Redirect Uri" extra='Leave blank to use the `urn:ietf:wg:oauth:2.0:oob` the redirect uri.'>
              {
                this.renderTags(this.state.redirectUri, { handleClose: this.handleRedirectUriRemove })
              }
              {
                redirectUriInputVisible && (
                  <Input
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={redirectUriInputValue}
                    onChange={(e) => { this.setState({redirectUriInputValue: e.target.value}) }}
                    onBlur={this.handleRedirectUriConfirm}
                    onPressEnter={this.handleRedirectUriConfirm}
                  />
                )
              }

              {!redirectUriInputVisible && (
                <Tag
                  onClick={() => { this.setState({redirectUriInputVisible: true}) }}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                  <Icon type="plus" /> New
                </Tag>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Scope" extra='Leave blank to use the DEFAULT scopes.'>
              {
                this.renderTags(this.state.scope, { color: 'green', handleClose: this.handleScopeRemove })
              }
              {
                scopeInputVisible && (
                  <Input
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={scopeInputValue}
                    onChange={(e) => { this.setState({scopeInputValue: e.target.value}) }}
                    onBlur={this.handleScopeConfirm}
                    onPressEnter={this.handleScopeConfirm}
                  />
                )
              }

              {!scopeInputVisible && (
                <Tag
                  onClick={() => { this.setState({scopeInputVisible: true}) }}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                  <Icon type="plus" /> New
                </Tag>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
const WrappedForm = Form.create({
  mapPropsToFields(props){
    return {
      name: Form.createFormField({
        value: props.application.name,
      })
    }
  }
})(ApplicationForm);
export default WrappedForm