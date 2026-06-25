export const onRequest = async (context: any) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // API routes - sempre processa pelo servidor
  if (pathname.startsWith('/api/')) {
    return fetch(request);
  }

  // Assets estáticos
  if (pathname.startsWith('/_next/') || /\.(js|css|png|jpg|gif|svg|ico|woff|woff2|json)$/.test(pathname)) {
    return fetch(request);
  }

  // Rotas dinâmicas - renderizar as páginas
  const routes: { [key: string]: () => string } = {
    '/': renderHome,
    '/auth/login': renderLogin,
    '/auth/registrar': renderRegistrar,
    '/categorias': renderCategorias,
    '/prestadores/dashboard': renderDashboard,
    '/solicitacoes': renderSolicitacoes,
    '/solicitacoes/nova': renderNovaSolicitacao,
    '/conta/editar': renderEditarConta,
  };

  // Verificar rotas exatas
  if (routes[pathname]) {
    return new Response(routes[pathname](), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }

  // Verificar rotas dinâmicas
  if (pathname.match(/^\/servicos\/\d+$/)) {
    return new Response(renderServicoDetalhes(), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }

  if (pathname.match(/^\/prestadores\/\d+$/)) {
    return new Response(renderPrestadorPerfil(), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }

  // 404
  return new Response(render404(), {
    status: 404,
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
};

function renderHome() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ABC Resolve - Marketplace de Serviços</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      color: #333;
    }
    header {
      background: white;
      border-bottom: 1px solid #ddd;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #E74C3C;
    }
    nav a {
      margin: 0 15px;
      text-decoration: none;
      color: #666;
      transition: color 0.3s;
    }
    nav a:hover { color: #E74C3C; }
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 30px;
      text-align: center;
    }
    .hero h1 { font-size: 48px; margin-bottom: 20px; }
    .hero p { font-size: 18px; margin-bottom: 30px; }
    .search-bar {
      background: white;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      gap: 10px;
      max-width: 600px;
      margin: 0 auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .search-bar input {
      flex: 1;
      border: none;
      padding: 10px;
      border-radius: 4px;
      font-size: 14px;
    }
    .search-bar button {
      background: #E74C3C;
      color: white;
      border: none;
      padding: 10px 30px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }
    .categories {
      padding: 60px 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .categories h2 { margin-bottom: 30px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }
    .card-icon { font-size: 40px; margin-bottom: 10px; }
    .card h3 { color: #333; margin-bottom: 10px; }
    footer {
      background: #333;
      color: white;
      padding: 30px;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>
    <div class="logo">🏢 ABC Resolve</div>
    <nav>
      <a href="/">Home</a>
      <a href="/categorias">Categorias</a>
      <a href="/auth/login">Login</a>
      <a href="/auth/registrar">Registrar</a>
    </nav>
  </header>

  <div class="hero">
    <h1>Encontre Serviços de Qualidade</h1>
    <p>Conectando clientes e prestadores de serviços em São Paulo</p>
    <div class="search-bar">
      <input type="text" placeholder="O que você procura?">
      <input type="text" placeholder="Qual cidade?">
      <button onclick="alert('Busca será implementada em breve')">Buscar</button>
    </div>
  </div>

  <div class="categories">
    <h2>Categorias Populares</h2>
    <div class="grid">
      <div class="card" onclick="window.location.href='/categorias'">
        <div class="card-icon">🔧</div>
        <h3>Encanador</h3>
      </div>
      <div class="card" onclick="window.location.href='/categorias'">
        <div class="card-icon">⚡</div>
        <h3>Eletricista</h3>
      </div>
      <div class="card" onclick="window.location.href='/categorias'">
        <div class="card-icon">🪵</div>
        <h3>Marceneiro</h3>
      </div>
      <div class="card" onclick="window.location.href='/categorias'">
        <div class="card-icon">🏗️</div>
        <h3>Pedreiro</h3>
      </div>
      <div class="card" onclick="window.location.href='/categorias'">
        <div class="card-icon">🎨</div>
        <h3>Pintor</h3>
      </div>
      <div class="card" onclick="window.location.href='/categorias'">
        <div class="card-icon">🌿</div>
        <h3>Jardinagem</h3>
      </div>
    </div>
  </div>

  <footer>
    <p>&copy; 2026 ABC Resolve. Todos os direitos reservados.</p>
  </footer>
</body>
</html>`;
}

function renderLogin() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - ABC Resolve</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      max-width: 400px;
      width: 100%;
    }
    h1 { color: #E74C3C; margin-bottom: 30px; text-align: center; }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }
    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    }
    input:focus {
      outline: none;
      border-color: #E74C3C;
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    button {
      width: 100%;
      padding: 12px;
      background: #E74C3C;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
    }
    button:hover { background: #d83d2a; }
    p { text-align: center; margin-top: 20px; color: #666; }
    a { color: #E74C3C; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .back {
      margin-bottom: 20px;
    }
    .back a {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="back"><a href="/">&larr; Voltar</a></div>
    <h1>Login</h1>
    <form onsubmit="login(event)">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" required placeholder="seu@email.com">
      </div>
      <div class="form-group">
        <label for="senha">Senha</label>
        <input type="password" id="senha" required placeholder="Sua senha">
      </div>
      <button type="submit">Entrar</button>
    </form>
    <p>Não tem conta? <a href="/auth/registrar">Registre-se aqui</a></p>
  </div>

  <script>
    async function login(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha })
        });
        const data = await response.json();

        if (data.success) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          alert('Login realizado com sucesso!');
          window.location.href = '/';
        } else {
          alert('Erro: ' + data.error);
        }
      } catch (err) {
        alert('Erro ao fazer login: ' + err.message);
      }
    }
  </script>
</body>
</html>`;
}

function renderRegistrar() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registrar - ABC Resolve</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      max-width: 400px;
      width: 100%;
    }
    h1 { color: #E74C3C; margin-bottom: 30px; text-align: center; }
    .form-group { margin-bottom: 20px; }
    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }
    input, select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #E74C3C;
    }
    button {
      width: 100%;
      padding: 12px;
      background: #E74C3C;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
    }
    button:hover { background: #d83d2a; }
    p { text-align: center; margin-top: 20px; color: #666; }
    a { color: #E74C3C; text-decoration: none; }
    .back { margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="back"><a href="/">&larr; Voltar</a></div>
    <h1>Registrar</h1>
    <form onsubmit="registrar(event)">
      <div class="form-group">
        <label for="nome">Nome</label>
        <input type="text" id="nome" required placeholder="Seu nome completo">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" required placeholder="seu@email.com">
      </div>
      <div class="form-group">
        <label for="senha">Senha</label>
        <input type="password" id="senha" required placeholder="Mínimo 6 caracteres">
      </div>
      <div class="form-group">
        <label for="tipo">Tipo de Conta</label>
        <select id="tipo" required>
          <option value="">Selecione...</option>
          <option value="cliente">Cliente</option>
          <option value="prestador">Prestador de Serviço</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cidade">Cidade</label>
        <input type="text" id="cidade" required placeholder="São Paulo">
      </div>
      <div class="form-group">
        <label for="estado">Estado</label>
        <input type="text" id="estado" required placeholder="SP" maxlength="2">
      </div>
      <button type="submit">Registrar</button>
    </form>
    <p>Já tem conta? <a href="/auth/login">Faça login aqui</a></p>
  </div>

  <script>
    async function registrar(e) {
      e.preventDefault();
      const payload = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        tipo: document.getElementById('tipo').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
      };

      try {
        const response = await fetch('/api/auth/registrar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (data.success) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          alert('Registrado com sucesso!');
          window.location.href = '/';
        } else {
          alert('Erro: ' + data.error);
        }
      } catch (err) {
        alert('Erro: ' + err.message);
      }
    }
  </script>
</body>
</html>`;
}

function renderCategorias() {
  return `<html><head><title>Categorias</title><style>body{font-family:sans-serif;padding:20px}</style></head><body><h1>Categorias</h1><p>Página de categorias</p><a href="/">← Voltar</a></body></html>`;
}

function renderDashboard() {
  return `<html><head><title>Dashboard</title><style>body{font-family:sans-serif;padding:20px}</style></head><body><h1>Dashboard do Prestador</h1><p>Página do dashboard</p><a href="/">← Voltar</a></body></html>`;
}

function renderSolicitacoes() {
  return `<html><head><title>Solicitações</title><style>body{font-family:sans-serif;padding:20px}</style></head><body><h1>Minhas Solicitações</h1><p>Página de solicitações</p><a href="/">← Voltar</a></body></html>`;
}

function renderNovaSolicitacao() {
  return `<html><head><title>Nova Solicitação</title><style>body{font-family:sans-serif;padding:20px}</style></head><body><h1>Nova Solicitação</h1><p>Formulário de nova solicitação</p><a href="/">← Voltar</a></body></html>`;
}

function renderServicoDetalhes() {
  return `<html><head><title>Detalhes do Serviço</title><style>body{font-family:sans-serif;padding:20px}</style></head><body><h1>Detalhes do Serviço</h1><p>Página de detalhes</p><a href="/">← Voltar</a></body></html>`;
}

function renderPrestadorPerfil() {
  return `<html><head><title>Perfil do Prestador</title><style>body{font-family:sans-serif;padding:20px}</style></head><body><h1>Perfil do Prestador</h1><p>Página de perfil</p><a href="/">← Voltar</a></body></html>`;
}

function renderEditarConta() {
  return `<html><head><title>Editar Conta</title><style>body{font-family:sans-serif;padding:20px}</style></head><body><h1>Editar Conta</h1><p>Página de edição de conta</p><a href="/">← Voltar</a></body></html>`;
}

function render404() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Página não encontrada</title>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      background: #f5f5f5;
    }
    h1 { font-size: 60px; color: #E74C3C; }
    p { color: #666; font-size: 18px; }
  </style>
</head>
<body>
  <div>
    <h1>404</h1>
    <p>Página não encontrada</p>
    <a href="/">Voltar ao início</a>
  </div>
</body>
</html>`;
}
