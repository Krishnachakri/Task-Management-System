import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { user, isAdmin } = useAuth();
  const canEdit = isAdmin || task.createdBy === user?.id;
  const canDelete = isAdmin || task.createdBy === user?.id;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>
      {task.description && (
        <p className="text-gray-600 mb-4">{task.description}</p>
      )}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <p>Created by: {task.createdByUsername || 'Unknown'}</p>
          <p> Created at:
            {new Date(task.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex space-x-2">
          {canEdit && (
            <button
              onClick={() => onEdit(task)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;


