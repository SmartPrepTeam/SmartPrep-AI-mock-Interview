import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { zfd } from 'zod-form-data';
import MagicButton from './ui/MagicButton';
import axios from 'axios';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LocationSelector from '@/components/ui/location-input';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select';
import {
  databases,
  frameworksLibraries,
  programmingLanguages,
  softSkills,
} from '@/data';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateUserProfileMutation } from '@/features/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
const formSchema = zfd.formData({
  profileImage: zfd
    .file()
    .refine((file) => file.size < 5000000, {
      message: "File can't be bigger than 5MB.",
    })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      {
        message: 'File format must be either jpg, jpeg lub png.',
      }
    ),
  full_name: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .regex(
      /^[a-zA-Z]+([-'\s][a-zA-Z]+)*$/,
      'Full name must contain only letters and spaces, with at least two words'
    ),
  email_address: z.string(),
  linkedin_profile_url: z
    .string()
    .url('Invalid URL format')
    .regex(
      /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_.]+\/?$/,
      'Invalid LinkedIn profile URL'
    ),
  github_profile_url: z
    .string()
    .url('Invalid URL format')
    .regex(
      /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-_.]+$/,
      'Invalid GitHub profile URL'
    ),
  job_title: z
    .string()
    .trim()
    .min(2, 'Current position must be at least 2 characters long')
    .max(100, 'Current position must not exceed 100 characters')
    .regex(
      /^[a-zA-Z\s-]+$/,
      'Current position can only contain letters, spaces, and hyphens'
    ),
  current_location: z.tuple([z.string(), z.string().optional()]),
  programming_languages: z
    .array(z.string())
    .nonempty('Please at least one item')
    .optional(),
  databases: z
    .array(z.string())
    .nonempty('Please at least one item')
    .optional(),
  frameworks_libraries: z
    .array(z.string())
    .nonempty('Please at least one item')
    .optional(),
  soft_skills: z.array(z.string()).nonempty('Please at least one item'),
});

export default function MyForm() {
  const user_id = useSelector((state: RootState) => state.auth.userId);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(location.state);
    if (!location.state) {
      navigate('/resume', { replace: true });
    }
  }, [location, navigate]);
  if (!location.state) {
    return null;
  }
  const userInfo = location.state?.userData;
  const [countryName, setCountryName] = useState<string>('');
  const [stateName, setStateName] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programming_languages: userInfo.programming_languages || [],
      frameworks_libraries: userInfo.frameworks_libraries || [],
      databases: userInfo.databases || [],
      soft_skills: userInfo.soft_skills || [],
      email_address: userInfo.email_address || '',
      job_title: userInfo.current_position?.job_title?.toLowerCase() || '',
      full_name: userInfo?.full_name?.toLowerCase() || '',
      github_profile_url: userInfo.github_profile_url || '',
      linkedin_profile_url: userInfo.linkedin_profile_url || '',
      current_location: [
        userInfo.current_country || '',
        userInfo.current_state || '',
      ],
    },
  });
  const [createUserProfile, { isLoading, isError, error }] =
    useCreateUserProfileMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    if (values.programming_languages) {
      values.programming_languages.forEach((lang) =>
        formData.append('programming_languages', lang)
      );
    }

    if (values.frameworks_libraries) {
      values.frameworks_libraries.forEach((framework) =>
        formData.append('frameworks_libraries', framework)
      );
    }

    if (values.databases) {
      values.databases.forEach((db) => formData.append('databases', db));
    }

    if (values.soft_skills) {
      values.soft_skills.forEach((skill) =>
        formData.append('soft_skills', skill)
      );
    }
    values.email_address &&
      formData.append('email_address', values.email_address);
    values.job_title && formData.append('job_title', values.job_title);
    values.full_name && formData.append('full_name', values.full_name);
    values.github_profile_url &&
      formData.append('github_profile_url', values.github_profile_url);
    values.linkedin_profile_url &&
      formData.append('linkedin_profile_url', values.linkedin_profile_url);
    values.current_location &&
      formData.append(
        'current_location',
        JSON.stringify(values.current_location)
      );
    values.profileImage &&
      formData.append('profile_image', values.profileImage);
    try {
      await createUserProfile({ user_id: user_id, data: formData }).unwrap();
      navigate('/home');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          toast.error('User not logged in');
          // log him out
        } else if (err.response?.status === 400) {
          toast.error('Profile already exists');
        }
      } else {
        toast.error('Unexpected error occurred');
      }
    }

    // toast(
    //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //     <code className="text-white">{JSON.stringify(values, null, 2)}</code>
    //   </pre>
    // );
  }
  return (
    <div className="text-white md:px-16 bg-black-100 min-w-full">
      <h2 className="max-w-3xl mx-auto pt-10 text-3xl text-center">
        Complete Your Profile
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full px-2 md:max-w-3xl md:mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Profile picture</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#10132E] text-white"
                    type="file"
                    {...fieldProps}
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(event) => {
                      const file = event.target.files && event.target.files[0];
                      const maxSize = 5 * 1024 * 1024; // 5MB in bytes

                      if (file) {
                        if (file.size > maxSize) {
                          toast.error('File size exceeds the 5MB limit.');
                          return; // Stop processing the file
                        }
                        onChange(event.target.files && event.target.files[0]);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#10132E] w-full"
                    placeholder="Enter your full name"
                    type="text"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <FormField
                control={form.control}
                name="email_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#10132E]"
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <FormField
                control={form.control}
                name="linkedin_profile_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#10132E]"
                        placeholder="LinkedIn Profile Url"
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <FormField
                control={form.control}
                name="github_profile_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Github</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#10132E]"
                        placeholder="Github profile URL"
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Position</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#10132E]"
                    placeholder="Software Engineer"
                    type="text"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Country</FormLabel>
                <FormControl className="bg-[#10132E]">
                  <LocationSelector
                    onCountryChange={(country) => {
                      setCountryName(country?.name || '');
                      form.setValue(field.name, [
                        country?.name || '',
                        stateName || '',
                      ]);
                    }}
                    onStateChange={(state) => {
                      setStateName(state?.name || '');
                      form.setValue(field.name, [
                        countryName || '',
                        state?.name || '',
                      ]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  If your country has states, it will be appear after selecting
                  country
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="programming_languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Programming Languages</FormLabel>
                <FormControl>
                  <MultiSelector
                    values={field.value}
                    onValuesChange={field.onChange}
                    loop
                    className="md:max-w-xs"
                  >
                    <MultiSelectorTrigger className="bg-[#10132E]">
                      <MultiSelectorInput placeholder="Select languages" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList className="bg-[#10132E] text-white">
                        {programmingLanguages.map((language) => {
                          return (
                            <MultiSelectorItem key={language} value={language}>
                              {language}
                            </MultiSelectorItem>
                          );
                        })}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </FormControl>
                <FormDescription>
                  You can select multiple languages.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <FormField
                control={form.control}
                name="frameworks_libraries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Framework/Library</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                        className="w-full md:max-w-xs"
                      >
                        <MultiSelectorTrigger className="bg-[#10132E]">
                          <MultiSelectorInput placeholder="Select Frameworks/Libraries" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList className="bg-[#10132E] text-white">
                            {frameworksLibraries.map((framework) => {
                              return (
                                <MultiSelectorItem
                                  key={framework}
                                  value={framework}
                                >
                                  {framework}
                                </MultiSelectorItem>
                              );
                            })}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <FormField
                control={form.control}
                name="databases"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Databases</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                        className="w-full md:max-w-xs"
                      >
                        <MultiSelectorTrigger className="bg-[#10132E]">
                          <MultiSelectorInput placeholder="Select Databases" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList className="bg-[#10132E] text-white">
                            {databases.map((db) => {
                              return (
                                <MultiSelectorItem key={db} value={db}>
                                  {db}
                                </MultiSelectorItem>
                              );
                            })}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="soft_skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soft Skills</FormLabel>
                <FormControl>
                  <MultiSelector
                    values={field.value}
                    onValuesChange={field.onChange}
                    loop
                    className="w-full md:max-w-xs"
                  >
                    <MultiSelectorTrigger className="bg-[#10132E]">
                      <MultiSelectorInput placeholder="Select Skills" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList className="bg-[#10132E] text-white">
                        {softSkills.map((skill) => {
                          return (
                            <MultiSelectorItem key={skill} value={skill}>
                              {skill}
                            </MultiSelectorItem>
                          );
                        })}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button type="submit">
            <MagicButton
              title="Submit"
              position="left"
              isLoading={isLoading}
              isLoadingText="Submitting...."
            />
          </button>
        </form>
      </Form>
    </div>
  );
}
