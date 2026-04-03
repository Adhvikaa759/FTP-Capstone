import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useMember, useDeleteMember } from '../hooks/useMembers.js';
import { useAuth } from '../hooks/useAuth.jsx';
import MemberDetail from '../components/members/MemberDetail.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';

export default function MemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: member, isLoading, error } = useMember(id);
  const deleteMutation = useDeleteMember();
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    navigate('/');
  };

  if (isLoading) return <LoadingSpinner className="py-12" />;
  if (error || !member) return <div className="text-center py-12 text-red-600">Member not found.</div>;

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Directory</Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        {user?.role === 'ADMIN' && (
          <div className="flex gap-2 float-right">
            <Link to={`/members/${id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Button variant="danger" onClick={() => setShowDelete(true)}>Delete</Button>
          </div>
        )}

        <MemberDetail member={member} />
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Member">
        <p className="text-gray-600 mb-4">Are you sure you want to delete <strong>{member.name}</strong>? This cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
