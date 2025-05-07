// Settings Tab Component
import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Input, Modal, Form, Select, 
  Tag, Tabs, Spin, message, Upload, Dropdown, Menu, 
  Statistic, Card, Row, Col, DatePicker, Space 
} from 'antd';
import { 
  HomeOutlined, UserOutlined, SettingOutlined, 
  UploadOutlined, BarsOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined, SearchOutlined,
  ExportOutlined, ImportOutlined, FilterOutlined,
  LineChartOutlined, BarChartOutlined, PieChartOutlined
} from '@ant-design/icons';
import { Switch } from 'antd';
import type { UploadProps } from 'antd';
import type { TabsProps } from 'antd';
import type { MenuProps } from 'antd';

// Types
interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  status: 'available' | 'sold' | 'rented';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'seller' | 'buyer';
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: number;
  rating: number;
  status: 'active' | 'inactive';
}

// Mock data - would be fetched from API in real application
const mockProperties: Property[] = [
  {
    id: 'prop-001',
    title: 'Luxury Apartment in Mumbai',
    type: 'Flat/Apartment',
    location: 'Mumbai',
    price: 12500000,
    status: 'available',
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    createdAt: new Date('2025-03-12'),
    updatedAt: new Date('2025-04-01')
  },
  {
    id: 'prop-002',
    title: 'Villa with Garden in Bangalore',
    type: 'Villa',
    location: 'Bangalore',
    price: 22000000,
    status: 'available',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-03-25')
  },
  {
    id: 'prop-003',
    title: 'Commercial Plot in Delhi',
    type: 'Plot',
    location: 'Delhi',
    price: 35000000,
    status: 'sold',
    area: 5000,
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-04-10')
  },
];

const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Raj Sharma',
    email: 'raj.sharma@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-12-01')
  },
  {
    id: 'user-002',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'agent',
    status: 'active',
    createdAt: new Date('2025-01-15')
  },
  {
    id: 'user-003',
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    role: 'seller',
    status: 'inactive',
    createdAt: new Date('2025-02-20')
  },
];

const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Vivek Kumar',
    email: 'vivek.kumar@legacyland.com',
    phone: '+91 98765 43210',
    properties: 24,
    rating: 4.8,
    status: 'active'
  },
  {
    id: 'agent-002',
    name: 'Neha Verma',
    email: 'neha.verma@legacyland.com',
    phone: '+91 98765 12345',
    properties: 18,
    rating: 4.5,
    status: 'active'
  },
  {
    id: 'agent-003',
    name: 'Suresh Reddy',
    email: 'suresh.reddy@legacyland.com',
    phone: '+91 87654 32109',
    properties: 12,
    rating: 4.2,
    status: 'inactive'
  },
];
const SettingsTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    form.validateFields().then(() => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        message.success('Settings updated successfully');
        setLoading(false);
      }, 1000);
    });
  };

  return (
    <div className="settings-tab">
      <Card title="General Settings">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            siteName: 'Legacy Land Real Estate',
            siteDescription: 'Find Your Dream Property in India',
            contactEmail: 'admin@legacyland.com',
            contactPhone: '+91 98765 43210',
            autoApprove: false,
            maxFileSize: 5,
            currencySymbol: '₹',
            defaultLanguage: 'en',
            resultsPerPage: 10
          }}
        >
          <Tabs defaultActiveKey="general">
            <Tabs.TabPane tab="General" key="general">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Site Name"
                    name="siteName"
                    rules={[{ required: true, message: 'Please enter site name' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Site Description"
                    name="siteDescription"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Contact Email"
                    name="contactEmail"
                    rules={[
                      { required: true, message: 'Please enter contact email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Contact Phone"
                    name="contactPhone"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Properties" key="properties">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Auto-approve Property Listings"
                    name="autoApprove"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Max Image Upload Size (MB)"
                    name="maxFileSize"
                  >
                    <Input type="number" min={1} max={20} />
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Display" key="display">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Currency Symbol"
                    name="currencySymbol"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Default Language"
                    name="defaultLanguage"
                  >
                    <Select>
                      <Select.Option value="en">English</Select.Option>
                      <Select.Option value="hi">Hindi</Select.Option>
                      <Select.Option value="ta">Tamil</Select.Option>
                      <Select.Option value="te">Telugu</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Results Per Page"
                    name="resultsPerPage"
                  >
                    <Select>
                      <Select.Option value={10}>10</Select.Option>
                      <Select.Option value={20}>20</Select.Option>
                      <Select.Option value={50}>50</Select.Option>
                      <Select.Option value={100}>100</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
          
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }}>Reset</Button>
            <Button id="btn-save-setting" type="primary" loading={loading} onClick={handleSubmit}>
              Save Settings
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsTab