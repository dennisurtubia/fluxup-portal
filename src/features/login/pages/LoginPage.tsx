import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Eye, EyeOff } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { authServiceHttpServiceInstance } from '../http/AuthHttpService';

import Logo from '@/assets/fluxup.svg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type JwtDecryptedPayload = {
  username: string;
} & JwtPayload;

const loginSchema = z.object({
  username: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });
  const { reset, getValues, setFocus } = form;

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(() => setShowPassword((prev) => !prev), []);

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => authServiceHttpServiceInstance.login(data),
    onSuccess: (response) => {
      const decodedToken = jwtDecode<JwtDecryptedPayload>(response.access_token);
      const username = decodedToken.username;

      toast(`Bem-vindo(a), ${username}`, {
        autoClose: 1500,
      });

      const token = response.access_token;

      localStorage.setItem('token', token);
      navigate('/app');
    },
    onError: () => {
      toast.error('E-mail ou senha inválidos. Tente novamente.');
      reset({
        username: getValues('username'),
        password: '',
      });
      setFocus('password');
    },
  });

  const onSubmit = useCallback(
    (data: LoginData) => {
      loginMutation.mutate(data);
    },
    [loginMutation],
  );

  const renderEyeButton = useCallback(() => {
    return (
      <Button
        type="button"
        className="absolute top-1/2 right-2 -translate-y-1/2 hover:bg-transparent"
        onClick={togglePassword}
        variant="ghost"
        size="icon"
        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={showPassword}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </Button>
    );
  }, [showPassword, togglePassword]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            <img src={Logo} alt="FluxUP" className="w-42 mx-auto mb-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="voce@exemplo.com"
                        autoComplete="username"
                        disabled={loginMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Senha"
                          autoComplete="current-password"
                          disabled={loginMutation.isPending}
                          className="pr-10"
                          {...field}
                        />
                        {renderEyeButton()}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
