import { useQuery } from '@tanstack/react-query';

import { Profile, profileService } from '../http/ProfileHttpService';

import LoadingScreen from '@/components/Loading';

export default function Home() {
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<Profile | undefined>({
    queryKey: ['profile', 1],
    queryFn: async () => {
      const response = await profileService.getProfile(1);
      return response;
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <div>Erro ao carregar</div>;
  }

  return (
    <div>
      <h1>{profile?.title}</h1>
      <p>{profile?.completed ? 'Completo' : 'Incompleto'}</p>
    </div>
  );
}
