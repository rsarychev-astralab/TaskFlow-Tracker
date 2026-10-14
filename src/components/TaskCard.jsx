import { DeleteOutlined, EditOutlined, HolderOutlined, UserOutlined, ProjectOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Typography, Avatar, Tooltip, Tag } from 'antd';
import { getPriorityMeta } from '../constants/priorities';
import { USERS } from '../constants/users';

const { Text } = Typography;

export default function TaskCard({ task, statusKey, onEdit, onDelete, projects = [] }) {
  const priority = getPriorityMeta(task.priority);
  const taskId = `TASK-${task.id}`;
  const assignee = USERS.find(u => u.id === task.assignee);
  const project = projects.find(p => p.id === task.projectId);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId: task.id, sourceStatus: statusKey }));
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        padding: '10px 12px',
        backgroundColor: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        borderLeft: `4px solid ${priority.color}`,
        cursor: 'grab',
        marginBottom: '8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>{taskId}</Text>
        <Space size={0}>
          <Button type="text" size="small" icon={<EditOutlined style={{ fontSize: '12px' }} />} onClick={() => onEdit(task)} />
          <Popconfirm title="Удалить задачу?" onConfirm={() => onDelete(task.id)}>
            <Button type="text" size="small" danger icon={<DeleteOutlined style={{ fontSize: '12px' }} />} />
          </Popconfirm>
        </Space>
      </div>

      <Text style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', lineHeight: '1.4' }}>
        {task.title}
      </Text>

      <div style={{ marginBottom: '8px' }}>
        {project && (
          <Tag icon={<ProjectOutlined />} color="default" style={{ fontSize: '10px' }}>
            {project.name}
          </Tag>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size={6}>
          <span style={{
            fontSize: '10px',
            padding: '1px 6px',
            borderRadius: '10px',
            backgroundColor: priority.bg,
            color: priority.color,
            border: `1px solid ${priority.border}`,
            fontWeight: 600
          }}>
            {priority.label}
          </span>
          {assignee && (
            <Tooltip title={assignee.name}>
              <Avatar size="small" style={{ backgroundColor: assignee.color, fontSize: '10px' }}>
                {assignee.avatar}
              </Avatar>
            </Tooltip>
          )}
        </Space>
        <HolderOutlined style={{ color: '#bfbfbf', cursor: 'grab' }} />
      </div>
    </div>
  );
}
