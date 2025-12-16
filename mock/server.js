const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// CORS - Debe ir ANTES de otros middlewares
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Responder a preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Leer db.json una sola vez al inicio
const dbPath = path.join(__dirname, 'db.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Verificar datos cargados
console.log('[DB] Datos cargados:', Object.keys(db));

// Recargar DB solo cuando sea necesario (opcional)
const reloadDB = () => {
  db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  console.log('[DB] Base de datos recargada');
};

// Delay simulado solo para rutas API (no para archivos estáticos)
server.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    setTimeout(next, 300); // Reducido a 300ms
  } else {
    next();
  }
});

// Middleware de logging solo para rutas API
server.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.url}`);
  }
  next();
});

// Middleware personalizado para autenticación
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  // POST /api/Auth/login - Validar credenciales
  if (req.method === 'POST' && req.url === '/api/Auth/login') {
    console.log('[LOGIN] Body completo:', req.body);
    
    const { email, password, username } = req.body;
    const loginEmail = email || username; // Intentar con ambos campos
    
    console.log('[LOGIN] Intento de login:', { email: loginEmail, password });
    console.log('[LOGIN] Credenciales disponibles:', db.credentials);
    
    const credential = db.credentials.find(
      c => c.email === loginEmail && c.password === password
    );
    
    console.log('[LOGIN] Credencial encontrada:', credential);
    
    if (credential) {
      const user = db.users.find(u => u.id === credential.userId);
      console.log('[LOGIN] Usuario encontrado:', user);
      res.status(200).json({
        ...db.login,
        user: user || db.login.user
      });
      return;
    } else {
      console.log('[LOGIN] ❌ Credenciales inválidas');
      res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
      return;
    }
  }
  
  // POST /api/Auth/register - Crear nuevo usuario
  if (req.method === 'POST' && req.url === '/api/Auth/register') {
    const { email, password, name } = req.body;
    
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      res.status(400).json({ 
        error: 'Email already exists',
        message: 'A user with this email already exists'
      });
      return;
    }
    
    const newUser = {
      id: String(db.users.length + 1),
      email,
      name,
      roles: ['User'],
      status: 'Active',
      position: 'New User'
    };
    
    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
    return;
  }
  
  // GET /api/Auth/me - Verificar autenticación
  if (req.method === 'GET' && req.url === '/api/Auth/me') {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
      return;
    }
    
    res.status(200).json(db.me);
    return;
  }

  // GET /api/Users/me - Alias para obtener usuario autenticado
  if (req.method === 'GET' && req.url === '/api/Users/me') {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
      return;
    }
    
    res.status(200).json(db.me);
    return;
  }
  
  // Verificar token para rutas protegidas
  if (req.url.startsWith('/api/users') || req.url.startsWith('/api/roles')) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authentication required'
      });
      return;
    }
  }
  
  next();
});

// Reescribir rutas (equivalente al archivo routes.json)
server.use((req, res, next) => {
  if (req.url.startsWith('/api/Auth/login')) {
    req.url = '/login';
  } else if (req.url.startsWith('/api/Auth/register')) {
    req.url = '/register';
  } else if (req.url.startsWith('/api/Auth/me')) {
    req.url = '/me';
  } else if (req.url.startsWith('/api/Dashboard/summary')) {
    req.url = '/summary';
  } else if (req.url.startsWith('/api/Dashboard/metrics')) {
    req.url = '/metrics';
  } else if (req.url.startsWith('/api/Dashboard/notifications')) {
    req.url = '/notifications';
  } else if (req.url.startsWith('/api/Dashboard/recent')) {
    req.url = '/recent';
  } else if (req.url.startsWith('/api/Audit/logs')) {
    req.url = '/logs';
  } else if (req.url.startsWith('/api/Settings')) {
    req.url = '/settings';
  } else if (req.url.startsWith('/api/Users')) {
    req.url = req.url.replace('/api/Users', '/users');
  } else if (req.url.startsWith('/api/users')) {
    req.url = req.url.replace('/api/users', '/users');
  } else if (req.url.startsWith('/api/Roles')) {
    req.url = req.url.replace('/api/Roles', '/roles');
  } else if (req.url.startsWith('/api/roles')) {
    req.url = req.url.replace('/api/roles', '/roles');
  }
  next();
});

server.use(middlewares);
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 JSON Server is running on http://localhost:${PORT}`);
  console.log(`📊 Mock API endpoints:`);
  console.log(`   Auth:`);
  console.log(`     POST   http://localhost:${PORT}/api/Auth/login`);
  console.log(`     POST   http://localhost:${PORT}/api/Auth/register`);
  console.log(`     GET    http://localhost:${PORT}/api/Auth/me`);
  console.log(`   Dashboard:`);
  console.log(`     GET    http://localhost:${PORT}/api/Dashboard/summary`);
  console.log(`     GET    http://localhost:${PORT}/api/Dashboard/metrics`);
  console.log(`     GET    http://localhost:${PORT}/api/Dashboard/notifications`);
  console.log(`     GET    http://localhost:${PORT}/api/Dashboard/recent`);
  console.log(`   Audit:`);
  console.log(`     GET    http://localhost:${PORT}/api/Audit/logs`);
  console.log(`   Settings:`);
  console.log(`     GET    http://localhost:${PORT}/api/Settings`);
  console.log(`   Users & Roles:`);
  console.log(`     GET    http://localhost:${PORT}/api/Users`);
  console.log(`     GET    http://localhost:${PORT}/api/Users/me`);
  console.log(`     GET    http://localhost:${PORT}/api/Roles`);
  console.log(`\n💡 Credentials: admin@example.com / admin123\n`);
});
