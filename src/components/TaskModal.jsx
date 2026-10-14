import { Modal, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { STATUSES } from '../constants/statuses';
import { PRIORITIES } from '../constants/priorities';
import { USERS } from '../constants/users';

export default function TaskModal({ open, task, currentStatus, currentBoardId, boards, projects, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: currentStatus,
        boardId: task.boardId || currentBoardId,
        projectId: task.projectId,
        assignee: task.assignee,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        priority: 'medium',
        status: currentStatus || 'backlog',
        boardId: currentBoardId || (boards?.[0]?.id ?? '1'),
      });
    }
  }, [task, currentStatus, currentBoardId, boards, open, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={task ? 'Редактировать задачу' : 'Новая задача'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={task ? 'Сохранить' : 'Создать'}
      cancelText="Отмена"
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
        <Form.Item
          name="title"
          label="Название"
          rules={[{ required: true, message: 'Пожалуйста, введите название задачи!' }]}
        >
          <Input placeholder="Введите название..." />
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={4} placeholder="Подробное описание задачи..." />
        </Form.Item>

        <Form.Item name="priority" label="Приоритет">
          <Select options={PRIORITIES.map(p => ({ value: p.key, label: p.label }))} />
        </Form.Item>

        <Form.Item name="assignee" label="Исполнитель">
          <Select 
            placeholder="Выберите исполнителя" 
            allowClear
            options={USERS.map(u => ({ value: u.id, label: u.name }))} 
          />
        </Form.Item>

        <Form.Item name="boardId" label="Доска">
          <Select options={boards?.map(b => ({ value: b.id, label: b.name })) || []} />
        </Form.Item>

        <Form.Item name="projectId" label="Проект">
          <Select 
            placeholder="Выберите проект" 
            allowClear
            options={projects?.map(p => ({ value: p.id, label: p.name })) || []} 
          />
        </Form.Item>

        <Form.Item name="status" label="Статус">
          <Select options={STATUSES.map(s => ({ value: s.key, label: s.label }))} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
