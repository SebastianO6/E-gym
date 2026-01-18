import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Menu, Avatar, Badge, Dropdown, theme } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  DollarOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './ModernLayout.css';

const { Header, Sider, Content } = Layout;

const ModernLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        My Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const notifications = (
    <Menu>
      <Menu.Item key="1">New member registered</Menu.Item>
      <Menu.Item key="2">Payment received</Menu.Item>
      <Menu.Item key="3">Training session scheduled</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }} className="modern-layout">
      <Sider
        width={250}
        theme="dark"
        className="sidebar"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="logo-container">
          <div className="logo-animated">
            <DashboardOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
            <span className="logo-text">E-GYM PRO</span>
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          className="main-menu"
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<TeamOutlined />}>
            Members
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            Trainers
          </Menu.Item>
          <Menu.Item key="4" icon={<CalendarOutlined />}>
            Schedule
          </Menu.Item>
          <Menu.Item key="5" icon={<MessageOutlined />}>
            Messages
          </Menu.Item>
          <Menu.Item key="6" icon={<DollarOutlined />}>
            Payments
          </Menu.Item>
        </Menu>

        <div className="sidebar-footer">
          <div className="user-info">
            <Avatar size="large" src="https://i.pravatar.cc/150?img=3" />
            <div className="user-details">
              <span className="user-name">John Trainer</span>
              <span className="user-role">Head Trainer</span>
            </div>
          </div>
        </div>
      </Sider>

      <Layout>
        <Header style={{ background: colorBgContainer }} className="main-header">
          <div className="header-left">
            <h1 className="page-title">Dashboard</h1>
          </div>
          
          <div className="header-right">
            <Dropdown overlay={notifications} placement="bottomRight">
              <Badge count={5} className="notification-badge">
                <BellOutlined className="header-icon" />
              </Badge>
            </Dropdown>
            
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="user-dropdown">
                <Avatar 
                  size="default" 
                  src="https://i.pravatar.cc/150?img=3"
                  className="header-avatar"
                />
                <span className="user-name">John Trainer</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="main-content">
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ModernLayout;