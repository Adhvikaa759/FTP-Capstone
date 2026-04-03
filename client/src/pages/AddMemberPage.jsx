import { useNavigate, Link } from 'react-router-dom';
import { useCreateMember } from '../hooks/useMembers.js';
import MemberForm from '../components/members/MemberForm.jsx';

export default function AddMemberPage() {
  const navigate = useNavigate();
  const createMutation = useCreateMember();

  const handleSubmit = async (data) => {
    await createMutation.mutateAsync(data);
    navigate('/');
  };

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Directory</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Member</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <MemberForm onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />
      </div>
    </div>
  );
}
