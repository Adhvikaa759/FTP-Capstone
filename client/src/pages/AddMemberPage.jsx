import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateMember } from '../hooks/useMembers.js';
import MemberForm from '../components/members/MemberForm.jsx';

export default function AddMemberPage() {
  const navigate = useNavigate();
  const createMutation = useCreateMember();
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (data) => {
    try {
      setErrorMsg(null);
      await createMutation.mutateAsync(data);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to add member. Make sure you are logged in as an Admin.');
    }
  };

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Directory</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Member</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}
        <MemberForm onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />
      </div>
    </div>
  );
}
