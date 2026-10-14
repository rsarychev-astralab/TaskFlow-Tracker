import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Modal, Input, Space, Collapse, Tag, Radio, Select } from 'antd';
import { 
  PlusOutlined, 
  CheckSquareOutlined, 
  ProjectOutlined, 
  AppstoreOutlined, 
  BarChartOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { useTasks } from './hooks/useTasks';
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';
import { STATUSES } from './constants/statuses';
import { PRIORITIES } from './constants/priorities';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetStatus, setTargetStatus] = useState('backlog');
  const [currentMenu, setCurrentMenu] = useState('boards');
  const [tasksViewMode, setTasksViewMode] = useState('grouped');
  
  // Состояние фильтров для раздела Задачи
  const [filters, setFilters] = useState({
    projectId: null,
    boardId: null,
    priority: null
  });

  // Состояние для досок
  const [boards, setBoards] = useState([
    { id: '1', name: 'Тестовая доска' }
  ]);
  const [currentBoardId, setCurrentBoardId] = useState('1');
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  // Состояние для проектов
  const [projects, setProjects] = useState([
    { id: 'p1', name: 'Первый проект', description: 'Описание первого проекта' },
    { id: 'p2', name: 'Второй проект', description: 'Описание второго проекта' }
  ]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const openCreateModal = (status = 'backlog') => {
    setTargetStatus(status);
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    const status = Object.keys(tasks).find(key => tasks[key].some(t => t.id === task.id));
    setTargetStatus(status || 'backlog');
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;
    const newBoard = {
      id: Date.now().toString(),
      name: newBoardName.trim()
    };
    setBoards([...boards, newBoard]);
    setCurrentBoardId(newBoard.id);
    setNewBoardName('');
    setIsBoardModalOpen(false);
  };

  const handleCreateProject = () => {
    handleSaveProject();
  };

  const handleOpenEditProject = (project) => {
    setEditingProject(project);
    setNewProject({ name: project.name, description: project.description });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = () => {
    if (!newProject.name.trim()) return;
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...newProject } : p));
    } else {
      setProjects([...projects, { ...newProject, id: Date.now().toString() }]);
    }
    setNewProject({ name: '', description: '' });
    setEditingProject(null);
    setIsProjectModalOpen(false);
  };

  const currentBoard = boards.find(b => b.id === currentBoardId) || boards[0];

  // Фильтруем задачи для текущей выбранной доски
  const filteredTasks = Object.keys(tasks).reduce((acc, statusKey) => {
    acc[statusKey] = (tasks[statusKey] || []).filter(task => {
      const taskBoardId = task.boardId || '1';
      return taskBoardId === currentBoardId;
    });
    return acc;
  }, {});

  const handleFormSubmit = (values) => {
    const targetBoardId = values.boardId || currentBoardId;
    if (editingTask) {
      const oldStatus = Object.keys(tasks).find(key => tasks[key].some(t => t.id === editingTask.id));
      
      const updatedFields = {
        title: values.title,
        description: values.description,
        priority: values.priority,
        boardId: targetBoardId,
        projectId: values.projectId,
      };

      if (oldStatus !== values.status) {
        deleteTask(oldStatus, editingTask.id);
        addTask(values.status, updatedFields);
      } else {
        updateTask(values.status, editingTask.id, updatedFields);
      }
    } else {
      addTask(values.status, {
        title: values.title,
        description: values.description,
        priority: values.priority,
        boardId: targetBoardId,
        projectId: values.projectId,
      });
    }
    setModalOpen(false);
  };

  // Получаем все задачи для общего списка
  const allTasksList = Object.values(tasks).flat();

  // Группируем задачи по доскам для раздела "Задачи"
  const tasksByBoard = boards.map(board => {
    const boardTasks = allTasksList.filter(t => (t.boardId || '1') === board.id);
    return {
      ...board,
      tasks: boardTasks
    };
  });

  const renderTaskCard = (task) => {
    const statusObj = STATUSES.find(s => tasks[s.key]?.some(t => t.id === task.id));
    const priorityObj = PRIORITIES.find(p => p.key === task.priority);
    const boardObj = boards.find(b => b.id === (task.boardId || '1'));

    return (
      <div 
        key={task.id} 
        style={{ 
          padding: '12px 16px', 
          background: '#fafafa', 
          borderRadius: 6, 
          border: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => openEditModal(task)}
      >
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{task.title}</div>
          {task.description && <Text type="secondary" style={{ fontSize: '13px' }}>{task.description}</Text>}
        </div>
        <Space>
          {tasksViewMode === 'all' && boardObj && <Tag color="blue">{boardObj.name}</Tag>}
          {priorityObj && <Tag color={priorityObj.color}>{priorityObj.label}</Tag>}
          {statusObj && <Tag>{statusObj.label}</Tag>}
        </Space>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ background: '#fff' }}>
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.05)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          TaskFlow
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentMenu]}
          onClick={(e) => setCurrentMenu(e.key)}
          items={[
            {
              key: 'tasks',
              icon: <CheckSquareOutlined />,
              label: 'Задачи',
            },
            {
              key: 'projects',
              icon: <ProjectOutlined />,
              label: 'Проекты',
            },
            {
              key: 'boards',
              icon: <AppstoreOutlined />,
              label: 'Доски',
            },
            {
              key: 'reports',
              icon: <BarChartOutlined />,
              label: 'Отчеты',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>
            {currentMenu === 'boards' && `Доска: ${currentBoard.name}`}
            {currentMenu === 'tasks' && 'Все задачи'}
            {currentMenu === 'projects' && 'Проекты'}
            {currentMenu === 'reports' && 'Отчеты'}
          </Title>
          <Space>
            {currentMenu === 'boards' && (
              <Space>
                <Button onClick={() => setIsBoardModalOpen(true)} icon={<PlusOutlined />}>
                  Новая доска
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreateModal()}>
                  Новая задача
                </Button>
              </Space>
            )}
            {currentMenu === 'tasks' && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreateModal()}>
                Новая задача
              </Button>
            )}
            {currentMenu === 'projects' && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsProjectModalOpen(true)}>
                Новый проект
              </Button>
            )}
          </Space>
        </Header>
        <Content style={{ padding: '24px', background: '#f0f2f5' }}>
          {currentMenu === 'boards' && (
            <div>
              <div style={{ marginBottom: 16, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {boards.map(board => (
                  <Button 
                    key={board.id} 
                    type={board.id === currentBoardId ? 'primary' : 'default'}
                    onClick={() => setCurrentBoardId(board.id)}
                    icon={<DashboardOutlined />}
                  >
                    {board.name}
                  </Button>
                ))}
              </div>
              <KanbanBoard 
                tasks={filteredTasks} 
                onEdit={openEditModal} 
                onDelete={deleteTask} 
                onMove={moveTask} 
                onAdd={openCreateModal}
                projects={projects}
              />
            </div>
          )}

          {currentMenu === 'tasks' && (
            <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
              <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Select
                  allowClear
                  placeholder="Проект"
                  style={{ width: 150 }}
                  onChange={(val) => setFilters(f => ({ ...f, projectId: val }))}
                  options={projects.map(p => ({ value: p.id, label: p.name }))}
                />
                <Select
                  allowClear
                  placeholder="Доска"
                  style={{ width: 150 }}
                  onChange={(val) => setFilters(f => ({ ...f, boardId: val }))}
                  options={boards.map(b => ({ value: b.id, label: b.name }))}
                />
                <Select
                  allowClear
                  placeholder="Приоритет"
                  style={{ width: 150 }}
                  onChange={(val) => setFilters(f => ({ ...f, priority: val }))}
                  options={PRIORITIES.map(p => ({ value: p.key, label: p.label }))}
                />
                <Radio.Group 
                  value={tasksViewMode} 
                  onChange={(e) => setTasksViewMode(e.target.value)}
                  buttonStyle="solid"
                  style={{ marginLeft: 'auto' }}
                >
                  <Radio.Button value="grouped">По доскам</Radio.Button>
                  <Radio.Button value="all">Все задачи</Radio.Button>
                </Radio.Group>
              </div>

              {tasksViewMode === 'grouped' ? (
                <Collapse
                  items={tasksByBoard
                    .map(board => ({
                      ...board,
                      tasks: board.tasks.filter(t => 
                        (!filters.projectId || t.projectId === filters.projectId) &&
                        (!filters.boardId || t.boardId === filters.boardId) &&
                        (!filters.priority || t.priority === filters.priority)
                      )
                    }))
                    .filter(board => board.tasks.length > 0)
                    .map(board => ({
                      key: board.id,
                      label: <span style={{ fontWeight: 'bold' }}>{board.name} ({board.tasks.length})</span>,
                      children: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {board.tasks.map(renderTaskCard)}
                        </div>
                      )
                    }))
                  }
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {allTasksList
                    .filter(t => 
                      (!filters.projectId || t.projectId === filters.projectId) &&
                      (!filters.boardId || t.boardId === filters.boardId) &&
                      (!filters.priority || t.priority === filters.priority)
                    )
                    .map(renderTaskCard)
                  }
                </div>
              )}
            </div>
          )}

          {currentMenu === 'projects' && (
            <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
              {projects.length === 0 ? (
                <Text type="secondary">Нет созданных проектов</Text>
              ) : (
                projects.map(p => (
                  <div key={p.id} style={{ marginBottom: 16, padding: 12, border: '1px solid #f0f0f0', borderRadius: 6 }}>
                    <Title level={5}>{p.name}</Title>
                    <Text>{p.description}</Text>
                  </div>
                ))
              )}
            </div>
          )}

          {currentMenu === 'reports' && (
            <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: 8 }}>
              <Title level={3} type="secondary">Раздел в разработке</Title>
            </div>
          )}

          <TaskModal
            open={modalOpen}
            task={editingTask}
            currentStatus={targetStatus}
            currentBoardId={currentBoardId}
            boards={boards}
            projects={projects}
            onCancel={() => setModalOpen(false)}
            onSubmit={handleFormSubmit}
          />

          <Modal
            title="Создать новый проект"
            open={isProjectModalOpen}
            onOk={handleCreateProject}
            onCancel={() => setIsProjectModalOpen(false)}
            okText="Создать"
            cancelText="Отмена"
          >
            <Input
              placeholder="Название проекта"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              style={{ marginBottom: 12 }}
            />
            <Input.TextArea
              placeholder="Описание проекта"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </Modal>

          <Modal
            title="Создать новую доску"
            open={isBoardModalOpen}
            onOk={handleCreateBoard}
            onCancel={() => {
              setIsBoardModalOpen(false);
              setNewBoardName('');
            }}
            okText="Создать"
            cancelText="Отмена"
          >
            <Input
              placeholder="Введите название доски"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onPressEnter={handleCreateBoard}
              style={{ marginTop: 12 }}
            />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}
