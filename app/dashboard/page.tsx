'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User, Service } from '@/lib/db';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Omit<User, 'password_hash'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'provider') {
      router.push('/login?type=provider');
      return;
    }

    const stored = localStorage.getItem('userData');
    if (stored) {
      try {
        setUser(JSON.parse(stored) as Omit<User, 'password_hash'>);
      } catch {
        localStorage.removeItem('userData');
        router.push('/login?type=provider');
        return;
      }
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    router.push('/');
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceValue = formData.price ? parseFloat(formData.price) : undefined;

    const newService: Service = {
      id: crypto.randomUUID(),
      provider_id: user?.id ?? '',
      name: formData.name,
      description: formData.description || undefined,
      price: Number.isFinite(priceValue) ? priceValue : undefined,
      created_at: new Date().toISOString(),
    };

    setServices((prev) => [...prev, newService]);
    setFormData({ name: '', description: '', price: '' });
    setShowForm(false);
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-600">ABCResolve</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informações</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Serviço</p>
                  <p className="font-semibold text-gray-900">{user?.service ?? '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cidade</p>
                  <p className="font-semibold text-gray-900">{user?.city ?? '—'}</p>
                </div>
              </div>
              <Link
                href="/profile"
                className="mt-6 block w-full text-center bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
              >
                Editar Perfil
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Meus Serviços</h2>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {showForm ? 'Cancelar' : '+ Novo Serviço'}
                </button>
              </div>

              {showForm && (
                <form
                  onSubmit={handleAddService}
                  className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Serviço
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: Instalação de Tomadas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Descreva seu serviço..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Adicionar Serviço
                  </button>
                </form>
              )}

              {services.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Nenhum serviço cadastrado</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Adicionar seu primeiro serviço
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          {service.description && (
                            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                          )}
                          {service.price != null && (
                            <p className="text-lg font-bold text-green-600 mt-2">
                              R$ {service.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
