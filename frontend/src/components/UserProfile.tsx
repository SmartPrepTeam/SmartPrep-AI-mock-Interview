import { ENDPOINTS } from '@/api/api-config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
interface Userdetails {
  full_name: string;
  email_address: string;
  job_title: string;
  current_location: string[];
  linkedin_profile_url: string;
  github_profile_url: string;
  programming_languages: string[];
  databases: string[];
  soft_skills: string[];
  frameworks_libraries: string[];
}
const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userDetails, setUserDetails] = useState<Userdetails | null>(null);
  const user_id = '64c0f45b99e6cba0fc123456';
  useEffect(() => {
    const getUserInfo = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(
          `${ENDPOINTS.user.profile}/${user_id}`
        );
        setUserDetails(response.data.data);
      } catch (err) {
        setError(true);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 500) {
            toast.error('Unable to parse the file');
          }
        } else {
          toast.error('Unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    getUserInfo();
  }, [user_id]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-white">
        Fetching user details
      </div>
    );
  }
  if (error || !userDetails) {
    return (
      <div className="flex justify-center items-center h-full text-white">
        Error Fetching user details
      </div>
    );
  }
  return (
    <div className="flex flex-1 w-full md:h-full">
      <div
        className="p-2 md:p-10 border border-white/[0.1] dark:border-neutral-700 bg-black-100 flex flex-col gap-2 flex-1 max-w-full h-full text-white"
        style={{
          background: 'rgb(4,7,29)',
          backgroundColor:
            'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(23, 25, 48,1) 100%)',
        }}
      >
        <div className="flex border-b border-b-white/[0.1] py-6 max-w-full">
          <img src="/mockup.png" alt="" width={120} />
          <div className="ml-4 items-center">
            <h2 className="font-sans text-lg lg:text-3xl font-bold">
              {userDetails.full_name}
            </h2>
            <p className="text-base lg:text-xl">{userDetails.job_title}</p>

            <p className="text-base">
              {userDetails.current_location[1]}{' '}
              {userDetails.current_location[0] && (
                <span>, {userDetails.current_location[0]}</span>
              )}
            </p>
            <p className="text-base whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {userDetails.email_address}
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-14 py-7">
          <div className="row-span-1">
            <h2 className="font-sans text-lg lg:text-3xl font-bold">
              LinkedIn Profile
            </h2>
            <p>{userDetails.linkedin_profile_url}</p>
          </div>
          <div className="row-span-1">
            <h2 className="font-sans text-lg lg:text-3xl font-bold">
              Github Profile
            </h2>

            <p>{userDetails.github_profile_url}</p>
          </div>
          <div className="row-span-1">
            <h2 className="font-sans text-lg lg:text-3xl font-bold">
              Programming Languages
            </h2>
            {userDetails.programming_languages &&
            userDetails.programming_languages.length > 0 ? (
              <div className="flex flex-wrap gap-4 mt-5">
                {userDetails.programming_languages.map((lang, index) => {
                  return (
                    <Badge
                      key={index}
                      className={cn(
                        "relative px-4 py-2 text-lg rounded flex items-center gap-1 data-[active='true']:ring-2 data-[active='true']:ring-muted-foreground truncate aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
                      )}
                      variant={'secondary'}
                    >
                      <span className="text-xs">{lang}</span>
                    </Badge>
                  );
                })}{' '}
              </div>
            ) : (
              <div>No programming languages provided</div>
            )}
          </div>
          <div className="row-span-1">
            <h2 className="font-sans text-lg lg:text-3xl font-bold">
              Databases
            </h2>

            {userDetails.databases && userDetails.databases.length > 0 ? (
              <div className="flex flex-wrap gap-4 mt-5">
                {userDetails.databases.map((db, index) => {
                  return (
                    <Badge
                      key={index}
                      className={cn(
                        "relative px-4 py-2 text-lg rounded flex items-center gap-1 data-[active='true']:ring-2 data-[active='true']:ring-muted-foreground truncate aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
                      )}
                      variant={'secondary'}
                    >
                      <span className="text-xs">{db}</span>
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <div>No Databases provided</div>
            )}
          </div>
          <div className="row-span-1">
            <h2 className="font-sans text-lg lg:text-3xl font-bold">
              Frameworks
            </h2>

            {userDetails.frameworks_libraries &&
            userDetails.frameworks_libraries.length > 0 ? (
              <div className="flex flex-wrap gap-4 mt-5">
                {userDetails.frameworks_libraries.map((lib, index) => {
                  return (
                    <Badge
                      key={index}
                      className={cn(
                        "relative px-4 py-2 text-lg rounded flex items-center gap-1 data-[active='true']:ring-2 data-[active='true']:ring-muted-foreground truncate aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
                      )}
                      variant={'secondary'}
                    >
                      <span className="text-xs">{lib}</span>
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <div>No Frameworks / Libraries provided</div>
            )}
          </div>
          <div className="row-span-1">
            <h2 className="font-sans text-lg lg:text-3xl font-bold">
              Soft Skills
            </h2>

            {userDetails.soft_skills && userDetails.soft_skills.length > 0 ? (
              <div className="flex flex-wrap gap-4 mt-5">
                {userDetails.soft_skills.map((skill, index) => {
                  return (
                    <Badge
                      key={index}
                      className={cn(
                        "relative px-4 py-2 text-lg rounded flex items-center gap-1 data-[active='true']:ring-2 data-[active='true']:ring-muted-foreground truncate aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
                      )}
                      variant={'secondary'}
                    >
                      <span className="text-xs">{skill}</span>
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <div>No Soft skills provided</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
