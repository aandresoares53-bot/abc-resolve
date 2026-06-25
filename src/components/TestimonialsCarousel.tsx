'use client';

import { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  client_name: string;
  rating: number;
  comment: string;
  city: string;
  service_name: string;
  created_at: string;
}

export function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        const data = await res.json() as { testimonials?: Testimonial[] };
        setTestimonials(data.testimonials || []);
      } catch (error) {
        console.error('Erro ao buscar depoimentos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();

    // Intersection Observer para animação ao entrar na seção
    const section = document.querySelector('#testimonials-section');
    if (section) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(section);
      return () => observer.unobserve(section);
    }
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (isLoading || testimonials.length === 0) {
    return (
      <section
        id="testimonials-section"
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">O que dizem nossos clientes</h2>
            <p className="section-subtitle">Carregando depoimentos...</p>
          </div>
        </div>
      </section>
    );
  }

  const visibleTestimonials = testimonials.slice(0, 3);

  return (
    <section
      id="testimonials-section"
      className={`py-20 bg-white transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">O que dizem nossos clientes</h2>
          <p className="section-subtitle">Avaliações reais de quem já usou o ABCResolve</p>
        </div>

        {/* Grid de 3 colunas para desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {visibleTestimonials.map((t, idx) => (
            <div
              key={t.id}
              className={`card p-6 transform transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                &ldquo;{t.comment}&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {t.client_name}
                  </p>
                  <p className="text-xs text-gray-400">{t.city}</p>
                </div>
                <span className="badge bg-primary-50 text-primary-700 text-xs">
                  {t.service_name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Carrousel para mobile */}
        <div className="md:hidden relative mb-8">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="w-full flex-shrink-0">
                  <div className="card p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          {t.client_name}
                        </p>
                        <p className="text-xs text-gray-400">{t.city}</p>
                      </div>
                      <span className="badge bg-primary-50 text-primary-700 text-xs">
                        {t.service_name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles de navegação */}
          <button
            onClick={goToPrevious}
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 shadow-lg transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 shadow-lg transition-all"
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicadores */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'bg-primary-600 w-6'
                    : 'bg-gray-300 w-2'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Formulário para novo depoimento */}
        <div className="mt-16 bg-primary-50 rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Compartilhe sua experiência
          </h3>
          <TestimonialForm onSuccess={() => window.location.reload()} />
        </div>
      </div>
    </section>
  );
}

function TestimonialForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      client_name: formData.get('name'),
      email: formData.get('email'),
      city: formData.get('city'),
      service_name: formData.get('service'),
      rating: parseInt(formData.get('rating') as string),
      comment: formData.get('comment'),
    };

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage('✓ Depoimento adicionado com sucesso!');
        (e.target as HTMLFormElement).reset();
        setTimeout(() => onSuccess(), 1500);
      } else {
        setMessage('✗ Erro ao adicionar depoimento');
      }
    } catch (error) {
      setMessage('✗ Erro ao processar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Seu nome"
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        />
        <input
          type="email"
          name="email"
          placeholder="seu@email.com"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="city"
          placeholder="Cidade"
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        />
        <select
          name="service"
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        >
          <option value="">Selecione o serviço</option>
          <option value="Elétrica">Elétrica</option>
          <option value="Hidráulica">Hidráulica</option>
          <option value="Limpeza">Limpeza</option>
          <option value="Pintura">Pintura</option>
          <option value="Educação">Educação</option>
          <option value="Automóvel">Automóvel</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sua avaliação
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={value}
                defaultChecked={value === 5}
                className="sr-only"
              />
              <Star
                size={28}
                className="fill-yellow-400 text-yellow-400 hover:opacity-75 transition"
              />
            </label>
          ))}
        </div>
      </div>

      <textarea
        name="comment"
        placeholder="Conte sua experiência..."
        required
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none"
      />

      {message && (
        <p
          className={`text-sm text-center ${
            message.startsWith('✓') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary py-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Enviando...' : 'Compartilhar depoimento'}
      </button>
    </form>
  );
}
