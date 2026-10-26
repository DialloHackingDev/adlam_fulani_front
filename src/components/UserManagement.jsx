import { useState, useEffect } from 'react';
import { HiSearch, HiFilter, HiUserAdd, HiPencil, HiTrash, HiEye, HiMail, HiPhone } from 'react-icons/hi';
import { apiService } from '../services/apiService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filterRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        role: filterRole !== 'all' ? filterRole : undefined
      };
      
      const response = await apiService.admin.getUsers(params);
      setUsers(response.data.data?.users || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('𞤀𞤪𞤫 𞤸𞤢𞤤𞤢 𞤫 𞤸𞤢𞤤𞤢𞤲𞤣𞤫 𞤖𞤮𞤪𞤦𞤫 𞤲𞤣𞤫?')) {
      try {
        await apiService.admin.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        alert('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      user: 'bg-blue-100 text-blue-800',
      moderator: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      admin: '𞤀𞤣𞤥𞤭𞤲',
      user: '𞤖𞤮𞤪𞤦𞤫',
      moderator: '𞤃𞤮𞤣𞤫𞤪𞤢𞤼𞤮𞤪'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[role] || styles.user}`}>
        {labels[role] || role}
      </span>
    );
  };

  const getStatusBadge = (isActive) => (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      {isActive ? '𞤀𞤳𞤼𞤭𞤬' : '𞤐𞤮𞤲-𞤀𞤳𞤼𞤭𞤬'}
    </span>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          𞤖𞤮𞤪𞤦𞤫 𞤃𞤢𞤲𞤢𞤺𞤫
        </h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <HiUserAdd className="h-4 w-4 mr-2" />
          𞤖𞤮𞤪𞤦𞤫 𞤚𞤢𞤥𞤭
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="𞤧𞤢𞤦𞤼𞤮 𞤖𞤮𞤪𞤦𞤫..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">𞤊𞤮𞤪𞤪𞤫 𞤈𞤮𞤤</option>
              <option value="admin">𞤀𞤣𞤥𞤭𞤲</option>
              <option value="user">𞤖𞤮𞤪𞤦𞤫</option>
              <option value="moderator">𞤃𞤮𞤣𞤫𞤪𞤢𞤼𞤮𞤪</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤖𞤮𞤪𞤦𞤫</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤈𞤮𞤤</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤅𞤼𞤢𞤼𞤵𞤧</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤚𞤢𞤪𞤭𞤸</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤀𞤳𞤧𞤢𞤲</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <HiMail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <HiPhone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.isActive)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('ar')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                        <HiEye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded">
                        <HiPencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                𞤆𞤫𞤶 {currentPage} 𞤫 {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  𞤀𞤪𞤢𞤲
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  𞤅𞤢𞤦𞤮
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;