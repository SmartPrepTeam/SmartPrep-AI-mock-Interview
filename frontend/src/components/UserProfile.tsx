import { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { useGetUserProfileQuery } from '@/features/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setProfileImg, setProfileUserName } from '@/features/profileSlice';
import { useNavigate } from 'react-router-dom';
interface Userdetails {
  full_name: string;
  email_address: string;
  profileImage: string;
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<Userdetails | null>(null);
  const user_id = useSelector((state: RootState) => state.auth.userId);
  const { data, isLoading, isError, error } = useGetUserProfileQuery(user_id);
  useEffect(() => {
    if (data) {
      console.log(data);
      // dispatch(setProfileImg(data.data.profileImage));
      dispatch(setProfileUserName(data.data.full_name));
      setUserDetails(data.data);
    } else if (!isLoading && !data) {
      navigate('/resume');
    }
  }, [data]);
  useLayoutEffect(() => {
    if (isError && !data) {
      navigate('/resume');
    }
  }, [data]);
  // useEffect(() => {
  //   if (userDetails?.profileImage) {
  //     let img = userDetails.profileImage;

  //     // Handle the `b''` or `b""` prefix issue
  //     if (img.startsWith("b'") || img.startsWith('b"')) {
  //       img = img.slice(2, -1);
  //     }

  //     img = img.trim();

  //     dispatch(setProfileImg(img));
  //   }
  // }, [userDetails?.profileImage]);

  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center h-full text-white">
        Loading....
      </div>
    );
  }
  if (isError) {
    if (!data) {
      navigate('/resume');
    }
    return (
      <div className="flex w-full justify-center items-center h-full text-white">
        {error?.data?.message || 'Unknown error occurred'}
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
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={'./mockup.png'}
            alt=""
            className="object-cover rounded-lg h-60"
          />
          <div className="border border-white/[0.1] p-3 rounded-lg h-auto w-full">
            <div className="mb-5 mt-2">
              <p className="text-white-100 mb-1">Name</p>
              <h2 className="font-sans text-lg font-bold">
                {userDetails.full_name}
              </h2>
            </div>
            <div className="mb-5">
              <p className="text-white-100 mb-1">Current Position</p>
              <p className="text-base lg:text-xl">{userDetails.job_title}</p>
            </div>
            <div>
              <p className="text-white-100 mb-1">Location</p>
              <p className="text-base">
                {userDetails.current_location[1]}{' '}
                {userDetails.current_location[0] && (
                  <span>, {userDetails.current_location[0]}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          <div className="border border-white/[0.1] p-3 rounded-lg col-span-1">
            <h2 className="uppercase font-bold mb-5">CONtact details</h2>
            <p className="text-white-100 mb-1">Email</p>
            <p className="text-base whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {userDetails.email_address}
            </p>
          </div>
          <div className="border border-white/[0.1] p-3 rounded-lg col-span-1">
            <h2 className="uppercase font-bold mb-5">SOCIALS</h2>
            <p className="text-white-100 mb-1"> LinkedIn Profile</p>
            <p className="text-base whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {userDetails.linkedin_profile_url}
            </p>
            <p className="text-white-100 mb-1 mt-5"> Github Profile</p>
            <p className="text-base whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {userDetails.github_profile_url}
            </p>
          </div>
          <div className="flex flex-col border border-white/[0.1] py-6 p-3 rounded-lg col-span-1">
            <h2 className="uppercase font-bold mb-5">Technical Skills</h2>
            <div>
              <h2 className="font-sans text-white-100">
                Programming Languages
              </h2>
              {userDetails.programming_languages &&
              userDetails.programming_languages.length > 0 ? (
                <div className="flex flex-wrap gap-4 mt-2">
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
            <div className="mt-5">
              <h2 className="font-sans text-white-100">Databases</h2>

              {userDetails.databases && userDetails.databases.length > 0 ? (
                <div className="flex flex-wrap gap-4 mt-2">
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
            <div className="mt-5">
              <h2 className="font-sans text-white-100">Frameworks</h2>

              {userDetails.frameworks_libraries &&
              userDetails.frameworks_libraries.length > 0 ? (
                <div className="flex flex-wrap gap-4 mt-2">
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
          </div>
          <div className="p-3 rounded-lg border border-white/[0.1] col-span-1">
            <h2 className="font-sans uppercase font-bold ">Soft Skills</h2>

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
