export default function MemberDetail({ member }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
          {!member.isActive && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactive</span>
          )}
        </div>
        <p className="text-gray-500">{member.cohort} &middot; Class of {member.graduationYear}</p>
        {member.email && <p className="text-gray-500 text-sm">{member.email}</p>}
        {member.linkedinUrl && (
          <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
            LinkedIn Profile
          </a>
        )}
      </div>

      {member.bio && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Bio</h2>
          <p className="text-gray-700">{member.bio}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {member.tracks.map(t => (
          <span key={t.id} className="text-sm px-3 py-1 rounded-full text-white font-medium" style={{ backgroundColor: t.color || '#6B7280' }}>
            {t.name}
          </span>
        ))}
        {member.roles.map(r => (
          <span key={r.id} className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
            {r.name}
          </span>
        ))}
      </div>

      {member.experiences.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Experience</h2>
          <div className="space-y-3">
            {member.experiences.map(exp => (
              <div key={exp.id} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="font-medium text-gray-900">{exp.title}</p>
                  <p className="text-gray-600">{exp.company}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${exp.type === 'FULLTIME' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {exp.type === 'FULLTIME' ? 'Full-Time' : 'Internship'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
