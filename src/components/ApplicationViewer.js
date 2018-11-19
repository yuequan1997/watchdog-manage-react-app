import React from 'react';
import { Modal, Button, Form, Tag, Tooltip, Icon, message } from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';
const FormItem = Form.Item;
export default class ApplicationViewer extends React.Component {

  _authentication(redirect_uri){

    var url = `/oauth/authorize?client_id=${this.props.application.client_id}&redirect_uri=${redirect_uri}&response_type=code`
    var win = window.open(url, '_blank');
    win.focus();
  }

  renderTags = (tags, options = {}) => {
    options.handleClose =  options.handleClose || ((index, tag) => {})
    options.color = options.color  || 'cyan'
    return tags.map((tag, index) => {
      const isLongTag = tag.length > 30;
      const tagElem = (
        <Tag onClick={this._authentication} color={options.color} key={tag} closable={false}>
          {isLongTag ? `${tag.slice(0, 30)}...` : tag}
        </Tag>
      );
      return <Tooltip title={'Click to jump to authorization url'} key={tag}>{tagElem}</Tooltip>;
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <Modal
        title={`${this.props.application.name}`}
        visible={this.props.visible}
        onOk={this.props.handleClose}
        onCancel={this.props.handleClose}
        footer={
          [
            <Button key="viewerOK" onClick={this.props.handleClose}>OK</Button>
          ]
        }
        width={750}
      >
        <Form>
          <FormItem {...formItemLayout} label="Client ID">
            <code>{this.props.application.client_id}</code>
            <CopyToClipboard  onCopy={()=>{message.info('Successfully copied.');}} text={this.props.application.client_id}>
              <Button className="copy-button"  icon="copy" type="small" />
            </CopyToClipboard>
          </FormItem>

          <FormItem {...formItemLayout} label="Client Secret">
            <code>{this.props.application.client_secret}</code>
            <CopyToClipboard  onCopy={()=>{message.info('Successfully copied.');}} text={this.props.application.client_secret}>
              <Button className="copy-button" icon="copy" type="small" />
            </CopyToClipboard>
          </FormItem>

          <FormItem {...formItemLayout} label="Redirect Uri">
            {
              (this.props.application.redirect_uri || []).map((tag, index) => {
                const isLongTag = tag.length > 30;
                const tagElem = (
                  <Tag color="cyan" onClick={() => { this._authentication(tag) }} key={tag} closable={false}>
                    {isLongTag ? `${tag.slice(0, 30)}...` : tag}
                  </Tag>
                );
                return <Tooltip title={'点击跳转授权'} key={tag}>{tagElem}</Tooltip>;
              })
            }
          </FormItem>
          <FormItem {...formItemLayout} label="Scopes">
            {
              (this.props.application.scope || []).map((tag, index) => {
                const isLongTag = tag.length > 30;
                const tagElem = (
                  <Tag color="green" key={tag} closable={false}>
                    {isLongTag ? `${tag.slice(0, 30)}...` : tag}
                  </Tag>
                );
                return <Tooltip title={tag} key={tag}>{tagElem}</Tooltip>;
              })
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}