'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
          } else {
            throw new Error('Failed to fetch profile');
          }
          return;
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <Link 
          href="/profile/update"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </Link>
      </div>
      
      {profile ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-600">{profile.profession}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Contact Information</h3>
              <p><span className="font-medium">Email:</span> {profile.email}</p>
              {profile.website && (
                <p>
                  <span className="font-medium">Website:</span>{' '}
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {profile.website}
                  </a>
                </p>
              )}
              {profile.location && (
                <p><span className="font-medium">Location:</span> {profile.location}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">About</h3>
              {profile.bio ? (
                <p className="whitespace-pre-line">{profile.bio}</p>
              ) : (
                <p className="text-gray-500">No bio provided</p>
              )}
              
              {profile.skills?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium">Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {profile.companyName && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium mb-2">Work</h3>
              <p className="font-medium">{profile.companyName}</p>
              {profile.companyDetails && (
                <p className="text-gray-600">{profile.companyDetails}</p>
              )}
            </div>
          )}
          
          {profile.education?.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium mb-2">Education</h3>
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">
                      {edu.startYear} - {edu.endYear || 'Present'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">You don't have a profile yet.</p>
          <Link
            href="/profile/update"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
          >
            Create Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
