import { useQuery } from '@tanstack/react-query';
import { Profile, profileService } from '../services/ProfileService';
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

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <div>Erro ao carregar</div>
      ) : (
        <div>
          <h1>{profile?.title}</h1>
          <p>{profile?.completed ? 'Completo' : 'Incompleto'}</p>
        </div>
      )}
    </div>
  );
}
