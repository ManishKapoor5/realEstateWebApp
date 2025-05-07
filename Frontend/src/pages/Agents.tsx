import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Input, Modal, Form, Select, 
  Tag, Tabs, Spin, message, Space, Badge, Tooltip
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  CheckCircleOutlined, CloseCircleOutlined, CrownOutlined
} from '@ant-design/icons';
import axios from 'axios';
import config from '../config.js';
import axiosInstance from '@/services/axiosInstance.js';
import { useAuthStore } from '@/store/authStore.ts';
// Correct the import path to the actual location of userStore.ts
import { useUserStore } from '../store/userStore';

// Types
interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  properties: number;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  role: 'agent' | 'seller' | 'admin';
}

const AgentsTab: React.FC = () => {
  const [isAgentModalVisible, setIsAgentModalVisible] = useState<boolean>(false);
  const [agentForm] = Form.useForm();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('all'); // 'all', 'pending', 'active', 'inactive'
  const { realestateusers } = useUserStore.getState()
  // Fetch agents from API on mount
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, you might want to add query parameters for filtering
      const response = await axiosInstance.get('/RealEstateUser/getAllAgentsAndSellers');
      console.log('API agents/sellers data:', response.data);
      setAgents(response.data.users || []);
      
    } catch (err: any) {
      console.error('Error fetching agents and sellers:', err);
      setError('Failed to fetch agents and sellers. Please try again.');
      
    } finally {
      setIsLoading(false);
    }
  };

  // Handle approval of pending agent/seller
  const handleApprove = async (record: Agent) => {
    try {
      setIsLoading(true);
      await axiosInstance.put(
        `/RealEstateUser/approveUser/${record._id}`,
        { status: 'active' }
      );
      
      // Update local state
      setAgents(agents.map(agent => 
        agent._id === record._id ? { ...agent, status: 'active' } : agent
      ));
      
      message.success(`${record.role === 'agent' ? 'Agent' : 'Seller'} approved successfully`);
    } catch (err: any) {
      console.error('Error approving user:', err);
      message.error('Failed to approve user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle rejection of pending agent/seller
  const handleReject = async (record: Agent) => {
    try {
      setIsLoading(true);
      await axiosInstance.put(
        `/RealEstateUser/rejectUser/${record._id}`,
        { status: 'inactive' }
      );
      
      // Update local state
      setAgents(agents.map(agent => 
        agent._id === record._id ? { ...agent, status: 'inactive' } : agent
      ));
      
      message.success(`${record.role === 'agent' ? 'Agent' : 'Seller'} rejected`);
    } catch (err: any) {
      console.error('Error rejecting user:', err);
      message.error('Failed to reject user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle promotion to admin
  const handlePromoteToAdmin = async (userId: string, userName: string) => {
    try {
      const response = await axiosInstance.put(`/RealEstateUser/promote-to-admin/${userId}`);
      
      if (response.data.success) {
        message.success(`${userName} has been promoted to admin`);
        
        // Update local state to show role change immediately
        setAgents(agents.map(agent => 
          agent._id === userId ? { ...agent, role: 'admin' } : agent
        ));
      }
    } catch (error: any) {
      console.error("Error promoting user:", error);
      message.error(error.response?.data?.message || "Failed to promote user");
    }
  };

  // Handle modification of agent/seller details
  const handleEdit = (record: Agent) => {
    setEditingAgent(record);
    setIsAgentModalVisible(true);
    agentForm.setFieldsValue(record);
  };

  // Handle deletion of agent/seller
  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/RealEstateUser/deleteUser/${id}`);
      
      // Update local state
      setAgents(agents.filter(agent => agent._id !== id));
      message.success('User deleted successfully');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      message.error('Failed to delete user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form submission handler
  const handleAgentSubmit = async () => {
    try {
      const values = await agentForm.validateFields();
      setIsLoading(true);

      if (editingAgent) {
        // Update existing agent/seller via API
        const response = await axiosInstance.put(
          `/RealEstateUser/updateUser/${editingAgent._id}`,
          values
        );
        
        // Update local state
        setAgents(agents.map(agent => 
          agent._id === editingAgent._id ? { ...agent, ...values } : agent
        ));
        
        message.success(`${editingAgent.role === 'agent' ? 'Agent' : 'Seller'} updated successfully`);
      } else {
        // Add new agent via API (rarely used as users register themselves)
        const response = await axiosInstance.post(
          `/api/v1/RealEstateUser/addUser`,
          { ...values, properties: 0, rating: 0 }
        );
        
        // Update local state
        setAgents([...agents, response.data.user]);
        message.success('User added successfully');
      }

      setIsAgentModalVisible(false);
      setEditingAgent(null);
      agentForm.resetFields();
    } catch (err: any) {
      console.error('Error submitting user:', err);
      message.error('Failed to save user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter agents/sellers based on selected tab
  const getFilteredAgents = () => {
    if (currentTab === 'all') return agents;
    return agents.filter(agent => agent.status === currentTab);
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Agent, b: Agent) => a.name.localeCompare(b.name),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Agent', value: 'agent' },
        { text: 'Seller', value: 'seller' },
        { text: 'Admin', value: 'admin' },
      ],
      onFilter: (value: string, record: Agent) => record.role === value,
      render: (role: string) => {
        let color = 'purple';
        if (role === 'agent') color = 'blue';
        if (role === 'admin') color = 'gold';
        
        return (
          <Tag color={color}>
            {role.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Properties',
      dataIndex: 'properties',
      key: 'properties',
      sorter: (a: Agent, b: Agent) => a.properties - b.properties,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a: Agent, b: Agent) => a.rating - b.rating,
      render: (rating: number) => (
        <span>{rating} / 5</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Pending', value: 'pending' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value: string, record: Agent) => record.status === value,
      render: (status: string) => {
        let color = 'green';
        if (status === 'pending') color = 'gold';
        if (status === 'inactive') color = 'red';
        
        return (
          <Badge status={status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'error'} text={
            <Tag color={color}>
              {status.toUpperCase()}
            </Tag>
          } />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Agent) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleApprove(record)}
                  size="small"
                  style={{ backgroundColor: '#52c41a' }}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleReject(record)}
                  size="small"
                />
              </Tooltip>
            </>
          )}
          {record.role !== 'admin' && record.status === 'active' && (
            <Tooltip title="Make Admin">
              <Button
                icon={<CrownOutlined />}
                onClick={() => handlePromoteToAdmin(record._id, record.name)}
                size="small"
                style={{ backgroundColor: '#faad14', color: 'white' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              onClick={() => handleDelete(record._id)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Tab items for different agent/seller status
  const tabItems = [
    { key: 'all', label: 'All Users' },
    { key: 'pending', label: 'Pending Approval' },
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
  ];

  // Count of pending users for badge
  const pendingCount = agents.filter(agent => agent.status === 'pending').length;

  return (
    <div className="agents-tab">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {/* Status tabs */}
      <Tabs 
        activeKey={currentTab} 
        onChange={setCurrentTab}
        items={tabItems.map(item => ({
          key: item.key,
          label: item.key === 'pending' ? (
            <Badge count={pendingCount} size="small">
              {item.label}
            </Badge>
          ) : item.label
        }))}
        className="mb-4"
      />
      
      {isLoading && <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />}
      
      {!isLoading && (
        <>
          <div className="table-actions">
            <Button 
              id="btn-agent"
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingAgent(null);
                setIsAgentModalVisible(true);
                agentForm.resetFields();
              }}
              style={{ marginBottom: 16 }}
            >
              Add User
            </Button>
            <Button 
              onClick={fetchAgents}
              style={{ marginBottom: 16, marginLeft: 8 }}
            >
              Refresh
            </Button>
          </div>

          <Table 
            dataSource={getFilteredAgents()} 
            columns={columns} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />

          {/* Add/Edit User Modal */}
          <Modal
            title={editingAgent ? `Edit ${editingAgent.role === 'agent' ? 'Agent' : 'Seller'}` : "Add New User"}
            open={isAgentModalVisible}
            onCancel={() => {
              setIsAgentModalVisible(false);
              setEditingAgent(null);
              agentForm.resetFields();
            }}
            footer={[
              <Button 
                key="cancel" 
                onClick={() => {
                  setIsAgentModalVisible(false);
                  setEditingAgent(null);
                  agentForm.resetFields();
                }}
              >
                Cancel
              </Button>,
              <Button 
                key="submit" 
                type="primary" 
                loading={isLoading} 
                onClick={handleAgentSubmit}
              >
                {editingAgent ? "Update" : "Add"}
              </Button>,
            ]}
          >
            <Form
              form={agentForm}
              layout="vertical"
              name="agentForm"
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter name' }]}
              >
                <Input placeholder="Enter name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select role' }]}
              >
                <Select placeholder="Select role">
                  <Select.Option value="agent">Agent</Select.Option>
                  <Select.Option value="seller">Seller</Select.Option>
                  <Select.Option value="admin">Admin</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="rating"
                label="Rating"
                rules={[{ required: true, message: 'Please enter rating' }]}
              >
                <Input type="number" min={0} max={5} step={0.1} placeholder="Enter rating (0-5)" />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AgentsTab;