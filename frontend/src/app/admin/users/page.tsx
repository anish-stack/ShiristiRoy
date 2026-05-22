'use client';
import { useEffect, useState, useCallback } from 'react';
import { UserCheck, UserX, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import {
  AdminPage, StatCard, Card, CardHeader, SearchBar, Table,
  Badge, Btn, Modal, Field, inputCls, ConfirmDelete, Pagination,
} from '@/components/admin/AdminUI';

type User = {
  _id: string; name: string; email: string; role: string;
  isActive: boolean; isEmailVerified: boolean; createdAt: string; lastLoginAt?: string;
};

const ROLES = ['all', 'user', 'therapist', 'admin'];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [loading, setLoading] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', password: '' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (search) params.set('q', search);
      if (role !== 'all') params.set('role', role);
      const data = await api.get<{ items: User[]; total: number }>(`/admin/users?${params}`);
      setUsers(data.items);
      setTotal(data.total);
    } catch { toast('Failed to load users', 'error'); }
    finally { setLoading(false); }
  }, [page, search, role]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggle = async (u: User) => {
    try {
      await api.patch(`/admin/users/${u._id}/toggle-active`);
      setUsers((p) => p.map((x) => x._id === u._id ? { ...x, isActive: !x.isActive } : x));
      toast(`User ${u.isActive ? 'deactivated' : 'activated'}`, 'success');
    } catch { toast('Failed', 'error'); }
  };

  const createUser = async () => {
    try {
      await api.post('/auth/register', form);
      toast('User invited', 'success');
      setInviteOpen(false);
      setForm({ name: '', email: '', role: 'user', password: '' });
      fetchUsers();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const active = users.filter((u) => u.isActive).length;
  const admins = users.filter((u) => u.role === 'admin').length;

  return (
    <AdminPage title="Users" subtitle={`${total} total`}
      actions={<Btn variant="primary" onClick={() => setInviteOpen(true)}><Plus size={14} />Invite user</Btn>}>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total users" value={total} color="lavender" />
        <StatCard label="Active" value={active} color="sage" />
        <StatCard label="Inactive" value={total - active} color="amber" />
        <StatCard label="Admins" value={admins} color="blue" />
      </div>

      {/* Table */}
      <Card>
        <CardHeader title="All users" actions={
          <div className="flex items-center gap-2">
            {ROLES.map((r) => (
              <button key={r} onClick={() => { setRole(r); setPage(1); }}
                className={`text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${role === r ? 'bg-brand-lavender text-white' : 'text-brand-ink/50 hover:text-brand-ink'}`}>
                {r}
              </button>
            ))}
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search users..." />
          </div>
        } />

        <Table
          cols={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role', width: '90px' },
            { key: 'status', label: 'Status', width: '90px' },
            { key: 'verified', label: 'Verified', width: '80px' },
            { key: 'joined', label: 'Joined', width: '110px' },
            { key: 'actions', label: '', width: '100px' },
          ]}
          empty={loading ? 'Loading...' : 'No users found'}
          rows={users.map((u) => [
            <div key="n" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-lavender/10 flex items-center justify-center text-xs font-medium text-brand-lavender flex-shrink-0">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-brand-ink">{u.name}</span>
            </div>,
            <span key="e" className="text-brand-ink/60">{u.email}</span>,
            <Badge key="r" label={u.role} variant={u.role === 'admin' ? 'lavender' : u.role === 'therapist' ? 'blue' : 'gray'} />,
            <Badge key="s" label={u.isActive ? 'active' : 'inactive'} variant={u.isActive ? 'green' : 'red'} />,
            u.isEmailVerified
              ? <UserCheck key="v" size={14} className="text-brand-sage" />
              : <UserX key="v" size={14} className="text-red-400" />,
            <span key="j" className="text-brand-ink/50 text-xs">{formatDate(u.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}</span>,
            <div key="a" className="flex gap-1">
              <Btn size="sm" variant={u.isActive ? 'danger' : 'primary'} onClick={() => toggle(u)}>
                {u.isActive ? 'Deactivate' : 'Activate'}
              </Btn>
            </div>,
          ])}
        />
        <Pagination page={page} total={total} limit={15} onChange={setPage} />
      </Card>

      {/* Invite modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite user"
        footer={<><Btn variant="default" onClick={() => setInviteOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={createUser}>Send invite</Btn></>}>
        <div className="space-y-4">
          <Field label="Full name" required>
            <input className={inputCls} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" />
          </Field>
          <Field label="Email" required>
            <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="jane@example.com" />
          </Field>
          <Field label="Role">
            <select className={inputCls} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
              <option value="user">User / Patient</option>
              <option value="therapist">Therapist</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
          <Field label="Temporary password" required>
            <input type="password" className={inputCls} value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Min 8 characters" />
          </Field>
        </div>
      </Modal>
    </AdminPage>
  );
}
