import { useEffect, useState, useContext } from 'react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { useGetUserProfileQuery } from '@/features/apiSlice';
import AuthContext from '@/context/auth_context';
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
  const [userDetails, setUserDetails] = useState<Userdetails | null>(null);
  const auth = useContext(AuthContext);
  const user_id = auth?.userId;
  const { data, isLoading, isError, error } = useGetUserProfileQuery(user_id);
  useEffect(() => {
    if (data) {
      console.log(data);
      setUserDetails(data.data);
    }
  }, [data]);
  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center h-full text-white">
        Loading....
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center h-full text-white">
        Error {error?.data?.message || 'Unknown error occurred'}
      </div>
    );
  }
  if (!userDetails) {
    return <div>Profile not made yet</div>;
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
