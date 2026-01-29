import type { SupportedLanguage } from './constants';

type TranslationKeys = {
  // Start Menu
  'menu.profile': string;
  'menu.theme': string;
  'menu.language': string;
  'menu.login': string;
  'menu.logout': string;
  'menu.settings': string;
  
  // Theme
  'theme.system': string;
  'theme.light': string;
  'theme.dark': string;
  'theme.premium': string;
  
  // Auth
  'auth.login': string;
  'auth.signup': string;
  'auth.email': string;
  'auth.password': string;
  'auth.confirmPassword': string;
  'auth.forgotPassword': string;
  'auth.orContinueWith': string;
  'auth.google': string;
  'auth.noAccount': string;
  'auth.hasAccount': string;
  'auth.loginPrompt.title': string;
  'auth.loginPrompt.description': string;
  'auth.loginPrompt.reward': string;
  
  // Donation
  'donation.title': string;
  'donation.description': string;
  'donation.pixKey': string;
  'donation.copied': string;
  'donation.copy': string;
  'donation.confirm': string;
  'donation.thankYou': string;
  
  // Reader
  'reader.chapter': string;
  'reader.fragment': string;
  'reader.progress': string;
  'reader.tableOfContents': string;
  'reader.continue': string;
  'reader.startReading': string;
  'reader.locked': string;
  'reader.free': string;
  
  // Desktop
  'desktop.folder.books': string;
  'desktop.emptyFolder': string;
  
  // Errors
  'error.title': string;
  'error.generic': string;
  'error.notFound': string;
  'error.unauthorized': string;
  'error.retry': string;
  'error.close': string;
  
  // Loading
  'loading.default': string;
  
  // Profile
  'profile.title': string;
  'profile.booksOwned': string;
  'profile.readingProgress': string;
  'profile.donations': string;
};

type Translations = Record<SupportedLanguage, TranslationKeys>;

export const translations: Translations = {
  'pt-BR': {
    // Start Menu
    'menu.profile': 'Perfil',
    'menu.theme': 'Tema',
    'menu.language': 'Idioma',
    'menu.login': 'Entrar',
    'menu.logout': 'Sair',
    'menu.settings': 'Configurações',
    
    // Theme
    'theme.system': 'Sistema',
    'theme.light': 'Claro',
    'theme.dark': 'Escuro',
    'theme.premium': 'Premium',
    
    // Auth
    'auth.login': 'Entrar',
    'auth.signup': 'Cadastrar',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.confirmPassword': 'Confirmar senha',
    'auth.forgotPassword': 'Esqueci minha senha',
    'auth.orContinueWith': 'ou continue com',
    'auth.google': 'Google',
    'auth.noAccount': 'Não tem uma conta?',
    'auth.hasAccount': 'Já tem uma conta?',
    'auth.loginPrompt.title': 'Continue lendo',
    'auth.loginPrompt.description': 'Você leu 12 fragmentos. Cadastre-se para desbloquear o primeiro capítulo gratuitamente!',
    'auth.loginPrompt.reward': 'Ganhe o primeiro capítulo completo ao se cadastrar',
    
    // Donation
    'donation.title': 'Apoie o AlterGenus',
    'donation.description': 'Para continuar lendo este livro, considere fazer uma contribuição via Pix.',
    'donation.pixKey': 'Chave Pix',
    'donation.copied': 'Copiado!',
    'donation.copy': 'Copiar',
    'donation.confirm': 'Já fiz minha doação',
    'donation.thankYou': 'Obrigado pelo seu apoio!',
    
    // Reader
    'reader.chapter': 'Capítulo',
    'reader.fragment': 'Fragmento',
    'reader.progress': 'Progresso',
    'reader.tableOfContents': 'Índice',
    'reader.continue': 'Continuar lendo',
    'reader.startReading': 'Começar a ler',
    'reader.locked': 'Bloqueado',
    'reader.free': 'Grátis',
    
    // Desktop
    'desktop.folder.books': 'livros',
    'desktop.emptyFolder': 'Esta pasta está vazia',
    
    // Errors
    'error.title': 'Erro',
    'error.generic': 'Algo deu errado. Por favor, tente novamente.',
    'error.notFound': 'Não encontrado',
    'error.unauthorized': 'Você não tem permissão para acessar este conteúdo.',
    'error.retry': 'Tentar novamente',
    'error.close': 'Fechar',
    
    // Loading
    'loading.default': 'Carregando...',
    
    // Profile
    'profile.title': 'Meu Perfil',
    'profile.booksOwned': 'Livros adquiridos',
    'profile.readingProgress': 'Progresso de leitura',
    'profile.donations': 'Doações',
  },
  
  'es': {
    // Start Menu
    'menu.profile': 'Perfil',
    'menu.theme': 'Tema',
    'menu.language': 'Idioma',
    'menu.login': 'Iniciar sesión',
    'menu.logout': 'Cerrar sesión',
    'menu.settings': 'Configuración',
    
    // Theme
    'theme.system': 'Sistema',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'theme.premium': 'Premium',
    
    // Auth
    'auth.login': 'Iniciar sesión',
    'auth.signup': 'Registrarse',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar contraseña',
    'auth.forgotPassword': 'Olvidé mi contraseña',
    'auth.orContinueWith': 'o continuar con',
    'auth.google': 'Google',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'auth.loginPrompt.title': 'Continúa leyendo',
    'auth.loginPrompt.description': 'Has leído 12 fragmentos. ¡Regístrate para desbloquear el primer capítulo gratis!',
    'auth.loginPrompt.reward': 'Obtén el primer capítulo completo al registrarte',
    
    // Donation
    'donation.title': 'Apoya AlterGenus',
    'donation.description': 'Para continuar leyendo este libro, considera hacer una contribución via Pix.',
    'donation.pixKey': 'Clave Pix',
    'donation.copied': '¡Copiado!',
    'donation.copy': 'Copiar',
    'donation.confirm': 'Ya hice mi donación',
    'donation.thankYou': '¡Gracias por tu apoyo!',
    
    // Reader
    'reader.chapter': 'Capítulo',
    'reader.fragment': 'Fragmento',
    'reader.progress': 'Progreso',
    'reader.tableOfContents': 'Índice',
    'reader.continue': 'Continuar leyendo',
    'reader.startReading': 'Empezar a leer',
    'reader.locked': 'Bloqueado',
    'reader.free': 'Gratis',
    
    // Desktop
    'desktop.folder.books': 'libros',
    'desktop.emptyFolder': 'Esta carpeta está vacía',
    
    // Errors
    'error.title': 'Error',
    'error.generic': 'Algo salió mal. Por favor, inténtalo de nuevo.',
    'error.notFound': 'No encontrado',
    'error.unauthorized': 'No tienes permiso para acceder a este contenido.',
    'error.retry': 'Reintentar',
    'error.close': 'Cerrar',
    
    // Loading
    'loading.default': 'Cargando...',
    
    // Profile
    'profile.title': 'Mi Perfil',
    'profile.booksOwned': 'Libros adquiridos',
    'profile.readingProgress': 'Progreso de lectura',
    'profile.donations': 'Donaciones',
  },
  
  'en-US': {
    // Start Menu
    'menu.profile': 'Profile',
    'menu.theme': 'Theme',
    'menu.language': 'Language',
    'menu.login': 'Log in',
    'menu.logout': 'Log out',
    'menu.settings': 'Settings',
    
    // Theme
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.premium': 'Premium',
    
    // Auth
    'auth.login': 'Log in',
    'auth.signup': 'Sign up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm password',
    'auth.forgotPassword': 'Forgot password',
    'auth.orContinueWith': 'or continue with',
    'auth.google': 'Google',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loginPrompt.title': 'Continue reading',
    'auth.loginPrompt.description': "You've read 12 fragments. Sign up to unlock the first chapter for free!",
    'auth.loginPrompt.reward': 'Get the complete first chapter when you sign up',
    
    // Donation
    'donation.title': 'Support AlterGenus',
    'donation.description': 'To continue reading this book, please consider making a contribution via Pix.',
    'donation.pixKey': 'Pix Key',
    'donation.copied': 'Copied!',
    'donation.copy': 'Copy',
    'donation.confirm': 'I have made my donation',
    'donation.thankYou': 'Thank you for your support!',
    
    // Reader
    'reader.chapter': 'Chapter',
    'reader.fragment': 'Fragment',
    'reader.progress': 'Progress',
    'reader.tableOfContents': 'Table of Contents',
    'reader.continue': 'Continue reading',
    'reader.startReading': 'Start reading',
    'reader.locked': 'Locked',
    'reader.free': 'Free',
    
    // Desktop
    'desktop.folder.books': 'books',
    'desktop.emptyFolder': 'This folder is empty',
    
    // Errors
    'error.title': 'Error',
    'error.generic': 'Something went wrong. Please try again.',
    'error.notFound': 'Not found',
    'error.unauthorized': "You don't have permission to access this content.",
    'error.retry': 'Retry',
    'error.close': 'Close',
    
    // Loading
    'loading.default': 'Loading...',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.booksOwned': 'Books owned',
    'profile.readingProgress': 'Reading progress',
    'profile.donations': 'Donations',
  },
};

export function t(key: keyof TranslationKeys, language: SupportedLanguage): string {
  return translations[language][key] || translations['en-US'][key] || key;
}
