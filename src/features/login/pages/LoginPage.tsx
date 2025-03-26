import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { authServiceHttpServiceInstance } from '../http/AuthHttpService';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(() => setShowPassword((prev) => !prev), []);

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => authServiceHttpServiceInstance.login(data),
    onSuccess: (response) => {
      toast.success('Login realizado com sucesso!');
      const token = response.access_token;
      localStorage.setItem('token', token);
      navigate('/app');
    },
    onError: () => {
      toast.error('Erro ao realizar login');
    },
  });

  const onSubmit = useCallback(
    (data: LoginData) => {
      loginMutation.mutate(data);
    },
    [loginMutation],
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-primary to-primary/70"
    >
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input type="text" placeholder="E-mail" {...register('username')} />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  {...register('password')}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute top-1/2 right-2 -translate-y-1/2
                  text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
