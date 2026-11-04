import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const emptyDevice = {
  deviceId: '',
  name: '',
  deviceType: '',
  room: '',
  brand: '',
  model: '',
  quantity: 1,
  status: 'Đang sử dụng',
  purchaseDate: '',
  description: ''
};

function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [form, setForm] = useState(emptyDevice);

  const loadDevices = async (keyword = search) => {
    try {
      setLoading(true);
      setError('');

      const url = keyword.trim()
        ? `${API_URL}/api/devices?search=${encodeURIComponent(keyword)}`
        : `${API_URL}/api/devices`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Không thể tải danh sách thiết bị');
      }

      const data = await response.json();
      setDevices(data);
    } catch (err) {
      setError(err.message + '. Em hãy kiểm tra kết nối Backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices('');
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const resetForm = () => {
    setForm(emptyDevice);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setMessage('');
      setError('');

      const url = editingId
        ? `${API_URL}/api/devices/${editingId}`
        : `${API_URL}/api/devices`;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lưu thiết bị');
      }

      setMessage(data.message || 'Lưu thiết bị thành công');
      resetForm();
      await loadDevices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (device) => {
    setEditingId(device._id);
    setForm({
      ...emptyDevice,
      ...device,
      purchaseDate: device.purchaseDate
        ? device.purchaseDate.slice(0, 10)
        : ''
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Em có chắc chắn muốn xóa thiết bị này không?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/devices/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể xóa thiết bị');
      }

      setMessage(data.message);
      await loadDevices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadDevices(search);
  };

  const statusClass = (status) => {
    if (status === 'Đang sử dụng') return 'active';
    if (status === 'Hư hỏng') return 'broken';
    if (status === 'Đang sửa chữa') return 'repair';
    return 'stopped';
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">🏫</div>
          <div>
            <h1>Quản lý thiết bị phòng học</h1>
            <p>Hệ thống quản lý cơ sở vật chất và thiết bị giảng dạy</p>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat-card">
            <span>Tổng loại thiết bị</span>
            <strong>{devices.length}</strong>
          </div>
          <div className="stat-card">
            <span>Tổng số lượng</span>
            <strong>
              {devices.reduce((sum, device) => sum + device.quantity, 0)}
            </strong>
          </div>
          <div className="stat-card">
            <span>Đang sử dụng</span>
            <strong>
              {devices.filter((device) => device.status === 'Đang sử dụng').length}
            </strong>
          </div>
          <div className="stat-card">
            <span>Thiết bị hư hỏng</span>
            <strong>
              {devices.filter((device) => device.status === 'Hư hỏng').length}
            </strong>
          </div>
        </section>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <section className="panel">
          <h2>{editingId ? '✏️ Cập nhật thiết bị' : '➕ Thêm thiết bị mới'}</h2>

          <form className="device-form" onSubmit={handleSubmit}>
            <label>
              Mã thiết bị *
              <input name="deviceId" value={form.deviceId} onChange={handleChange} required />
            </label>

            <label>
              Tên thiết bị *
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
              Loại thiết bị *
              <input name="deviceType" value={form.deviceType} onChange={handleChange} required />
            </label>

            <label>
              Phòng học *
              <input name="room" value={form.room} onChange={handleChange} required />
            </label>

            <label>
              Thương hiệu
              <input name="brand" value={form.brand} onChange={handleChange} />
            </label>

            <label>
              Model
              <input name="model" value={form.model} onChange={handleChange} />
            </label>

            <label>
              Số lượng *
              <input type="number" name="quantity" min="0" value={form.quantity} onChange={handleChange} required />
            </label>

            <label>
              Trạng thái
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Đang sử dụng</option>
                <option>Hư hỏng</option>
                <option>Đang sửa chữa</option>
                <option>Ngừng sử dụng</option>
              </select>
            </label>

            <label>
              Ngày mua
              <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} />
            </label>

            <label className="full-width">
              Mô tả
              <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
            </label>

            <div className="form-actions full-width">
              <button type="submit" className="btn primary">
                {editingId ? 'Lưu cập nhật' : 'Thêm thiết bị'}
              </button>
              <button type="button" className="btn secondary" onClick={resetForm}>
                Làm mới
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="list-heading">
            <h2>📋 Danh sách thiết bị</h2>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                placeholder="Tìm mã, tên, loại hoặc phòng..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button className="btn primary" type="submit">Tìm kiếm</button>
              <button
                className="btn secondary"
                type="button"
                onClick={() => {
                  setSearch('');
                  loadDevices('');
                }}
              >
                Xóa lọc
              </button>
            </form>
          </div>

          {loading ? (
            <p className="empty">Đang tải dữ liệu...</p>
          ) : devices.length === 0 ? (
            <p className="empty">Không tìm thấy thiết bị nào.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Mã thiết bị</th>
                    <th>Tên thiết bị</th>
                    <th>Loại</th>
                    <th>Phòng</th>
                    <th>Số lượng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device._id}>
                      <td>{device.deviceId}</td>
                      <td>{device.name}</td>
                      <td>{device.deviceType}</td>
                      <td>{device.room}</td>
                      <td>{device.quantity}</td>
                      <td>
                        <span className={`status ${statusClass(device.status)}`}>
                          {device.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="btn small info" onClick={() => setSelectedDevice(device)}>
                          Xem
                        </button>
                        <button className="btn small warning" onClick={() => handleEdit(device)}>
                          Sửa
                        </button>
                        <button className="btn small danger" onClick={() => handleDelete(device._id)}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedDevice && (
          <div className="modal-backdrop" onClick={() => setSelectedDevice(null)}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
              <h2>Chi tiết thiết bị</h2>
              <p><strong>Mã:</strong> {selectedDevice.deviceId}</p>
              <p><strong>Tên:</strong> {selectedDevice.name}</p>
              <p><strong>Loại:</strong> {selectedDevice.deviceType}</p>
              <p><strong>Phòng:</strong> {selectedDevice.room}</p>
              <p><strong>Thương hiệu:</strong> {selectedDevice.brand || 'Chưa có'}</p>
              <p><strong>Model:</strong> {selectedDevice.model || 'Chưa có'}</p>
              <p><strong>Số lượng:</strong> {selectedDevice.quantity}</p>
              <p><strong>Trạng thái:</strong> {selectedDevice.status}</p>
              <p><strong>Ngày mua:</strong> {selectedDevice.purchaseDate ? selectedDevice.purchaseDate.slice(0, 10) : 'Chưa có'}</p>
              <p><strong>Mô tả:</strong> {selectedDevice.description || 'Không có'}</p>
              <button className="btn primary" onClick={() => setSelectedDevice(null)}>Đóng</button>
            </div>
          </div>
        )}
      </main>

      <footer>
        <p>© 2026 - Hệ thống quản lý thiết bị phòng học</p>
      </footer>
    </div>
  );
}

export default App;
