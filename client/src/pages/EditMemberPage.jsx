import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMember, useUpdateMember } from '../hooks/useMembers.js';
import MemberForm from '../components/members/MemberForm.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

export default function EditMemberPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: member, isLoading } = useMember(id);
  const updateMutation = useUpdateMember();

  const handleSubmit = async (data) => {
    await updateMutation.mutateAsync({ id, data });
    navigate(`/members/${id}`);
  };

  if (isLoading) return <LoadingSpinner className="py-12" />;
  if (!member) return <div className="text-center py-12 text-red-600">Member not found.</div>;

  return (
    <div>
      <Link to={`/members/${id}`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Back to {member.name}</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Member</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <MemberForm initialData={member} onSubmit={handleSubmit} isSubmitting={updateMutation.isPending} />
      </div>
    </div>
  );
}
