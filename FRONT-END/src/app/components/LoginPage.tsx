import { useState } from 'react';
import { User, Building2, Heart, PawPrint, Mail, Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'adopter' | 'ngo'>('adopter');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      id: Date.now().toString(),
      email: formData.email,
      name: formData.name || formData.email.split('@')[0],
      type: userType,
      adoptionsCount: 0,
      approvedAdoptions: []
    };

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = existingUsers.find((u: any) => u.email === formData.email);

    if (foundUser) {
      onLogin(foundUser);
    } else {
      existingUsers.push(user);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-9xl">🐕</div>
        <div className="absolute bottom-20 right-20 text-9xl">🐱</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">🐾</div>
        <div className="absolute top-1/3 right-1/3 text-6xl">❤️</div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-full mb-4 shadow-2xl animate-pulse">
            <Heart className="w-10 h-10 text-white" fill="white" />
          </div>
          <h1 className="text-5xl md:text-6xl mb-3 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            AdotaPet
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground flex items-center justify-center gap-2">
            <PawPrint className="w-5 h-5" />
            Conectando corações a patinhas
            <PawPrint className="w-5 h-5" />
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-white">
            <h2 className="text-3xl mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Por que adotar?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Salve uma vida</h3>
                  <p className="text-sm text-muted-foreground">
                    Milhares de animais aguardam por um lar amoroso
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">ONGs confiáveis</h3>
                  <p className="text-sm text-muted-foreground">
                    Conectamos você com organizações verificadas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <PawPrint className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Amor incondicional</h3>
                  <p className="text-sm text-muted-foreground">
                    Ganhe um companheiro fiel para toda a vida
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-white">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-xl transition-all font-medium ${
                  isLogin
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-xl transition-all font-medium ${
                  !isLogin
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                Cadastrar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setUserType('adopter')}
                className={`py-4 px-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  userType === 'adopter'
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 shadow-lg scale-105'
                    : 'border-border bg-background hover:bg-secondary'
                }`}
              >
                <User className="w-8 h-8" />
                <span className="text-sm font-medium">Adotante</span>
              </button>
              <button
                onClick={() => setUserType('ngo')}
                className={`py-4 px-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  userType === 'ngo'
                    ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100 text-pink-700 shadow-lg scale-105'
                    : 'border-border bg-background hover:bg-secondary'
                }`}
              >
                <Building2 className="w-8 h-8" />
                <span className="text-sm font-medium">ONG</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {userType === 'adopter' ? 'Seu nome' : 'Nome da ONG'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border-2 border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder={userType === 'adopter' ? 'João Silva' : 'ONG Patinhas Felizes'}
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-input-background border-2 border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-input-background border-2 border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold text-lg"
              >
                {isLogin ? '✨ Entrar' : '🎉 Criar conta'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
          Adote com amor, mude uma vida
          <PawPrint className="w-4 h-4 text-orange-500" />
        </p>
      </div>
    </div>
  );
}
