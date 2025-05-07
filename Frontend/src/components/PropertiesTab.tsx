import React, { useState, useEffect } from 'react';
import {
  Table, Button, Input, Modal, Form, Select,
  Tag, Spin, message, Upload, Space
} from 'antd';
import {
  HomeOutlined, SearchOutlined,
  ExportOutlined, PlusOutlined, EditOutlined,
  DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { debounce } from 'lodash';
import axiosInstance from '@/services/axiosInstance';

// Types
interface Property {
  _id: string;
  key?: string;
  title: string;
  type: string;
  location: string;
  price: number;
  status: 'available' | 'sold' | 'rented';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
}

const PropertiesTab: React.FC = () => {
  const [isPropertyModalVisible, setIsPropertyModalVisible] = useState<boolean>(false);
  const [isRejectionModalVisible, setIsRejectionModalVisible] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [rejectingProperty, setRejectingProperty] = useState<Property | null>(null);
  const [propertyForm] = Form.useForm();
  const [rejectionForm] = Form.useForm();
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [approvalFilter, setApprovalFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/Property/getAll`);
        console.log("Properties data", response.data)
        if (response.data && response.data.data) {
          const propertiesWithKeys = response.data.data.map((property: any, index: number) => ({
            ...property,
            id: property.id || `prop-${Date.now()}-${index}`,
            key: property.id || `prop-${Date.now()}-${index}`,
            approvalStatus: property.approvalStatus || 'pending',
            createdAt: property.createdAt ? new Date(property.createdAt) : new Date(),
            updatedAt: property.updatedAt ? new Date(property.updatedAt) : new Date(),
          }));
          setProperties(propertiesWithKeys);
        } else {
          setProperties([]);
          message.error('No properties found');
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
        message.error('Failed to fetch properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Property handlers
  function handleEditProperty(property: Property) {
    setEditingProperty(property);
    propertyForm.setFieldsValue({
      title: property.title,
      type: property.type,
      location: property.location,
      price: property.price,
      status: property.status,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
    });
    setIsPropertyModalVisible(true);
  }

  function handleDeleteProperty(propertyId: string) {
    Modal.confirm({
      title: 'Are you sure you want to delete this property?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setProperties(properties.filter(property => property._id !== propertyId));
        message.success('Property deleted successfully');
      },
    });
  }

  const handlePropertySubmit = () => {
    propertyForm.validateFields().then(values => {
      setIsLoading(true);

      setTimeout(() => {
        if (editingProperty) {
          setProperties(properties.map(property =>
            property._id === editingProperty._id
              ? { ...property, ...values, updatedAt: new Date(), key: property._id }
              : property
          ));
          message.success('Property updated successfully');
        } else {
          const newId = `prop-${(Math.floor(Math.random() * 1000)).toString().padStart(3, '0')}`;
          const newProperty: Property = {
            id: newId,
            key: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            approvalStatus: 'pending',
            ...values,
          };
          setProperties([...properties, newProperty]);
          message.success('Property added successfully');
        }

        setIsLoading(false);
        setIsPropertyModalVisible(false);
        propertyForm.resetFields();
      }, 1000);
    });
  };

  // Approval handlers
  const handleApproveProperty = async (propertyId: string) => {
    try {
      setIsLoading(true);
      // In a real application, you would call your API here
      await axiosInstance.put(`/Property/approve/${propertyId}`);
      
      // For now, we'll just update the local state
      setProperties(properties.map(property =>
        property._id === propertyId
          ? { ...property, approvalStatus: 'approved', updatedAt: new Date() }
          : property
      ));
      
      message.success('Property approved successfully');
    } catch (error) {
      console.error('Error approving property:', error);
      message.error('Failed to approve property');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectProperty = (property: Property) => {
    setRejectingProperty(property);
    console.log("property------->",property)
    setIsRejectionModalVisible(true);
  };

  const submitRejection = () => {
    rejectionForm.validateFields().then(async values => {
      try {
        setIsLoading(true);
        // In a real application, you would call your API here
        await axiosInstance.put(`/Property/rejected/${rejectingProperty._id}`, { rejectionReason: values.rejectionReason });
        
        // For now, we'll just update the local state
        setProperties(properties.map(property =>
          property._id === rejectingProperty?._id
            ? { 
                ...property, 
                approvalStatus: 'rejected', 
                rejectionReason: values.rejectionReason,
                updatedAt: new Date() 
              }
            : property
        ));
        
        message.success('Property rejected');
        setIsRejectionModalVisible(false);
        rejectionForm.resetFields();
      } catch (error) {
        console.error('Error rejecting property:', error);
        message.error('Failed to reject property');
      } finally {
        setIsLoading(false);
      }
    });
  };

  // Debounced search
  const debouncedSetSearchText = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchText(e.target.value);
  };

  // Filter properties
  const filteredProperties = properties.filter(
    (property) => {
      const matchesSearch = 
        property.title.toLowerCase().includes(searchText.toLowerCase()) ||
        property.location.toLowerCase().includes(searchText.toLowerCase()) ||
        property.type.toLowerCase().includes(searchText.toLowerCase());
      
      if (approvalFilter) {
        return matchesSearch && property.approvalStatus === approvalFilter;
      }
      
      return matchesSearch;
    }
  );

  const dataSource = filteredProperties.map((property) => ({
    ...property,
    key: property.key || property._id || `${property.title}-${Date.now()}-${Math.random()}`,
  }));

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: Property, b: Property) => a.title.localeCompare(b.title),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Flat/Apartment', value: 'Flat/Apartment' },
        { text: 'Villa', value: 'Villa' },
        { text: 'Builder Floor', value: 'Builder Floor' },
        { text: 'Plot', value: 'Plot' },
        { text: 'Independent House', value: 'Independent House' },
      ],
      onFilter: (value: string, record: Property) => record.type === value,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Price (₹)',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: Property, b: Property) => a.price - b.price,
      render: (price: number) => `${(price / 100000).toFixed(2)} L`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Available', value: 'available' },
        { text: 'Sold', value: 'sold' },
        { text: 'Rented', value: 'rented' },
      ],
      onFilter: (value: string, record: Property) => record.status === value,
      render: (status: string) => {
        let color = 'green';
        if (status === 'sold') {
          color = 'red';
        } else if (status === 'rented') {
          color = 'blue';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Approval Status',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value: string, record: Property) => record.approvalStatus === value,
      render: (approvalStatus: string, record: Property) => {
        let color = 'gold';
        let text = 'PENDING';
        
        if (approvalStatus === 'approved') {
          color = 'green';
          text = 'APPROVED';
        } else if (approvalStatus === 'rejected') {
          color = 'red';
          text = 'REJECTED';
        }
        
        return (
          <div>
            <Tag color={color}>{text}</Tag>
            {approvalStatus === 'rejected' && record.rejectionReason && (
              <div className="text-xs text-red-500 mt-1">
                Reason: {record.rejectionReason}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a: Property, b: Property) => {
        const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
        const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt);
        return dateA.getTime() - dateB.getTime();
      },
      render: (date: Date | string) => {
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString();
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Property) => (
        <Space>
          {record.approvalStatus === 'pending' && (
            <>
              <Button
                icon={<CheckCircleOutlined />}
                type="primary"
                onClick={() => handleApproveProperty(record._id)}
                size="small"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Approve
              </Button>
              <Button
                icon={<CloseCircleOutlined />}
                danger
                onClick={() => handleRejectProperty(record)}
                size="small"
              >
                Reject
              </Button>
            </>
          )}
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditProperty(record)}
            size="small"
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteProperty(record._id)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="properties-tab">
      <Modal
        title={editingProperty ? 'Edit Property' : 'Add New Property'}
        open={isPropertyModalVisible}
        onCancel={() => setIsPropertyModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsPropertyModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={handlePropertySubmit}
          >
            {editingProperty ? 'Update' : 'Add'}
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={propertyForm}
          layout="vertical"
          name="propertyForm"
        >
          <Form.Item
            name="title"
            label="Property Title"
            rules={[{ required: true, message: 'Please enter property title' }]}
          >
            <Input placeholder="Enter property title" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Property Type"
            rules={[{ required: true, message: 'Please select property type' }]}
          >
            <Select placeholder="Select property type">
              <Select.Option value="Flat/Apartment">Flat/Apartment</Select.Option>
              <Select.Option value="Villa">Villa</Select.Option>
              <Select.Option value="Builder Floor">Builder Floor</Select.Option>
              <Select.Option value="Plot">Plot</Select.Option>
              <Select.Option value="Independent House">Independent House</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input placeholder="Enter location" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price (₹)"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="available">Available</Select.Option>
              <Select.Option value="sold">Sold</Select.Option>
              <Select.Option value="rented">Rented</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="bedrooms"
            label="Bedrooms"
          >
            <Input type="number" placeholder="Enter bedrooms" />
          </Form.Item>
          <Form.Item
            name="bathrooms"
            label="Bathrooms"
          >
            <Input type="number" placeholder="Enter bathrooms" />
          </Form.Item>
          <Form.Item
            name="area"
            label="Area (sq ft)"
          >
            <Input type="number" placeholder="Enter area" />
          </Form.Item>
          <Form.Item
            name="featuredImage"
            label="Featured Image"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Reject Property"
        open={isRejectionModalVisible}
        onCancel={() => setIsRejectionModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsRejectionModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            loading={isLoading}
            onClick={submitRejection}
          >
            Reject
          </Button>,
        ]}
      >
        <Form
          form={rejectionForm}
          layout="vertical"
          name="rejectionForm"
        >
          <Form.Item
            name="rejectionReason"
            label="Reason for Rejection"
            rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter reason for rejection" />
          </Form.Item>
        </Form>
      </Modal>

      <div className="table-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            placeholder="Search properties..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: 300 }}
          />
          <Select 
            placeholder="Filter by approval status"
            style={{ width: 200 }}
            allowClear
            onChange={(value) => setApprovalFilter(value)}
          >
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="approved">Approved</Select.Option>
            <Select.Option value="rejected">Rejected</Select.Option>
          </Select>
        </div>
        <div>
          <Button className="btn-export" icon={<ExportOutlined />} style={{ marginRight: 8 }}>
            Export
          </Button>
          <Button
            className="btn-add-property"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsPropertyModalVisible(true)}
          >
            Add Property
          </Button>
        </div>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        loading={isLoading}
      />
    </div>
  );
};

export default PropertiesTab;